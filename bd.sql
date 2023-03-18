create database telegram_bot;
use telegram_bot;


CREATE TABLE `conteo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_inicio` timestamp DEFAULT NULL,
  `fecha_fin` timestamp DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_name` text NOT NULL,
  `message` text NOT NULL,
  `fecha` timestamp NOT NULL,
  PRIMARY KEY (`id`)
);