# telegram-info-bot
Telegram Analytics Bot recopila y genera estadísticas de grupos de Telegram para monitorear el tráfico. Fácil de configurar y personalizar.

Herramientas: 
- NodeJs
- Mysql
- 
¿Como utilizar este bot?
- Primero debes crear un bot en Telegram.
- Debes guardar el token de tu bot.
- Ya que tengas tu propio bot, puedes agregarlo a un grupo de Telegram.
- Para que comienze a recopilar la información de los usuarios del grupo como: id_usuario, username, mensaje(y fecha); además del conteo de los mensajes entre intervalos de tiempo, debes descargar el proyecto y ejecutarlo en tu editor de código.
- No te olvides de ejecutar el proyecto y de configurar la informacion de autenticación de la base de datos y del token necesario. 

OJO: El primer intervalo de tiempo inicia cuando el servidor capta el primer mensaje que se envie en el grupo de Telegram, y el final de ese intervalo se da cuando pasa 2 minutos desde el ultimo mensaje enviado. En la base de datos se guarda: el inicio del intervalo, el fin del intervalo y la cantidad de mensajes enviados en ese intervalo. Además, una vez que se termine el intervalo, se reiniciara cuando el servidor reciba otro mensaje y desde ahí comenzara un nuevo intervalo.
