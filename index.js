const TelegramBot = require('node-telegram-bot-api');
const token = '6238926102:AAFAJ3VTTYxXxE7G5orEHeaFNiboxh1K5r0'; //Cambiar por el token del bot de telegram
const bot = new TelegramBot(token, { polling: true });
const mysql = require('mysql2/promise');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

app.use(express.json());


//Conexion a la base de datos
const connection = mysql.createPool({
  port : process.env.DB_PORT || 3306,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'usuario1',
  database: process.env.DB_DATABASE || 'telegram_bot'
});

app.get('/api/mensajes', async (req, res) => {
  try {
    const sql = 'SELECT * FROM messages';
    const mostrar = await connection.query(sql);
    res.json(mostrar[0]);
} catch (error) {
    return res.status(500).json({
        message: 'Algo ocurrio mal'
    })
}
});

app.get('/api/conteo', async (req, res) => {
  const sql = 'SELECT * FROM conteo';
  const mostrar = await connection.query(sql);
  res.json(mostrar[0]);
});

//Variables para el conteo de mensajes
let messagesCount = 0;
let intervalEnd = undefined;
let firstinterval = undefined;


bot.on('message', async (msg) => {

  //Variables para identificar al usuario y el mensaje
  const userId = msg.from.id;
  const username = msg.from.username;
  const message = msg.text;
  
  //Condicional para el conteo de mensajes
  if (firstinterval == undefined) {
 
    firstinterval = new Date();
    messagesCount++;

  } else if ((new Date() - firstinterval) > (2 * 60 * 1000)) { //Si han pasado 2 minutos sin recibir mensajes

    firstinterval = firstinterval.toISOString().split('T')[0] + ' ' + firstinterval.toTimeString().split(' ')[0];
    intervalEnd = intervalEnd.toISOString().split('T')[0] + ' ' + intervalEnd.toTimeString().split(' ')[0];
    enviarDatos(firstinterval, intervalEnd, messagesCount);
    messagesCount = 1;
    intervalEnd = undefined;
    firstinterval = undefined;

  } else {

    messagesCount++;
    intervalEnd = new Date();

  }

  //Insertar datos del usuario y el mensaje en la base de datos
  try {
    const conn = await connection.getConnection();

    const sql = `INSERT INTO messages (user_id, user_name, message, fecha) VALUES ('${userId}' ,'${username}', '${message}', NOW())`;
    await conn.query(sql);

    conn.release();
  } catch (error) {
    console.log(error);
  }


});

//Funcion para enviar el conteo de mensajes a la base de datos
async function enviarDatos(inicio, fin, cantidad) {
  try {
    const conn = await connection.getConnection();
    const sql = `INSERT INTO conteo (fecha_inicio, fecha_fin, cantidad) VALUES ('${inicio}' ,'${fin}', '${cantidad}')`;
    await conn.query(sql);

    conn.release();
  } catch (error) {
    console.error(error);
  }

}

app.use((req, res, next) => {
  res.status(404).json({
      message:'Endpoint not found'
  })
})


app.listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000!');
});