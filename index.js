const TelegramBot = require('node-telegram-bot-api');

const token = 'TOKEN_BOT_TELEGRAM'; //Cambiar por el token del bot de telegram

const bot = new TelegramBot(token, { polling: true });

const mysql = require('mysql2/promise');

//Conexion a la base de datos
const connection = mysql.createPool({
  host: 'TU_HOST_DE_MYSQL',
  user: 'TU_USUARIO_DE_MYSQL',
  password: 'TU_PASSWORD_DE_MYSQL',
  database: 'TU_BASE_DE_DATOS'
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
    console.log(messagesCount);
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