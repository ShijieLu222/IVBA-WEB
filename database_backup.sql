-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: venue_db
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_id` int NOT NULL,
  `booking_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `user_name` varchar(255) DEFAULT NULL,
  `contact_info` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`venue_id`) REFERENCES `venues` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (13,1,'2025-03-08','09:00:00','12:00:00','pending','JohnDoe','john@example.com','2025-03-07 12:22:45','2025-03-07 19:32:20'),(14,2,'2025-04-02','14:00:00','17:00:00','confirmed','JaneSmith','jane@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(15,6,'2025-04-05','10:00:00','11:30:00','cancelled','AliceWonder','alice@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(16,7,'2025-04-07','08:30:00','10:30:00','pending','DavidLee','david@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(17,8,'2025-04-09','13:00:00','15:00:00','confirmed','EmmaStone','emma@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(18,9,'2025-04-12','09:00:00','12:00:00','pending','HenryGreen','henry@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(19,10,'2025-04-15','14:00:00','17:00:00','confirmed','IsabellaW','isabella@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45'),(20,11,'2025-04-18','10:00:00','12:00:00','cancelled','JackBrown','jack@example.com','2025-03-07 12:22:45','2025-03-07 12:22:45');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hashed_password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_admin` tinyint DEFAULT '0' COMMENT '0: user, 1: admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'admin','$2b$12$5M8upQHk3HQhDLwEiz0vSepvbwC7skSDOAWc78HQofJ2BItBpweF2',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venues`
--

DROP TABLE IF EXISTS `venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venues` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venue_name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `contact_name` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `description` text,
  `size_sqm` float DEFAULT NULL,
  `price` float DEFAULT NULL,
  `maximum_capacity` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `currency` varchar(10) DEFAULT 'GBP',
  `facilities` json DEFAULT NULL,
  `availability` json DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE','PENDING') DEFAULT 'ACTIVE',
  `user_has_saved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venues`
--

LOCK TABLES `venues` WRITE;
/*!40000 ALTER TABLE `venues` DISABLE KEYS */;
INSERT INTO `venues` VALUES (1,'The Grand Hall','123 Main Street, London','Alice Smith','alice@example.com','0123456789','A spacious and elegant venue for events.',300,100,300,'2025-03-06 21:09:23','2025-03-07 12:02:17','USD','[]','[]','ACTIVE',0),(2,'City Conference Room','456 City Road, London','Bob Johnson','bob@example.com','0987654321','Perfect for conferences and corporate meetings.',150,80,150,'2025-03-06 21:09:23','2025-03-06 21:09:23','GBP','[]','[]','ACTIVE',0),(6,'Open-Air Theatre','789 Park Avenue, London','Charlie Brown','charlie@example.com','0987000000','An outdoor theatre perfect for summer events.',400,200,500,'2025-03-07 12:14:55','2025-03-07 12:14:55','GBP','[\"Lighting\", \"Outdoor Stage\"]','[{\"date\": \"2025-07-15\", \"available\": true}]','ACTIVE',0),(7,'Private Dining Room','10 Downing Street, London','Theresa May','theresa@example.com','0111111111','A luxurious private dining room for exclusive events.',60,150,40,'2025-03-07 12:14:55','2025-03-07 12:14:55','GBP','[\"Table Service\", \"Sound System\"]','[{\"date\": \"2025-08-01\", \"available\": false}]','INACTIVE',0),(8,'Riverside Banquet Hall','101 River Road, London','Daisy Miller','daisy@example.com','0123456000','A large riverside hall suitable for weddings and receptions.',350,180,400,'2025-03-07 12:16:20','2025-03-07 12:16:20','GBP','[\"Catering Area\", \"Stage\", \"Sound System\"]','[{\"date\": \"2025-09-10\", \"available\": true}, {\"date\": \"2025-09-11\", \"available\": false}]','ACTIVE',0),(9,'Historic Castle Hall','Castle Lane, Edinburgh','Edgar Wallace','edgar@example.com','0998887777','A centuries-old castle hall with stunning architecture and ambiance.',500,300,600,'2025-03-07 12:16:20','2025-03-07 12:16:20','GBP','[\"VIP Room\", \"Parking\", \"Security\"]','[{\"date\": \"2025-10-01\", \"available\": true}, {\"date\": \"2025-10-02\", \"available\": true}]','ACTIVE',0),(10,'Seaside Pavilion','22 Coastal Avenue, Brighton','Fiona Shore','fiona@example.com','0987001234','An open-air pavilion overlooking the sea, perfect for summer events.',250,220,300,'2025-03-07 12:16:20','2025-03-07 12:16:20','GBP','[\"Open Air\", \"Lighting\", \"Seating\"]','[{\"date\": \"2025-06-15\", \"available\": true}, {\"date\": \"2025-06-16\", \"available\": false}]','INACTIVE',0),(11,'Modern Art Gallery','33 Museum Street, Manchester','Gina Carter','gina@example.com','0712345678','A sleek, modern gallery space for art exhibitions and private events.',150,100,200,'2025-03-07 12:16:20','2025-03-07 12:16:20','GBP','[\"WiFi\", \"Projector\", \"Air Conditioning\"]','[{\"date\": \"2025-11-05\", \"available\": true}, {\"date\": \"2025-11-06\", \"available\": true}]','ACTIVE',0),(12,'Mountain Retreat Center','Highland Rd, Lake District','Harvey Lake','harvey@example.com','0799999999','A peaceful retreat center in the mountains, ideal for workshops and nature events.',400,90,100,'2025-03-07 12:16:20','2025-03-07 12:16:20','GBP','[\"Cabins\", \"Campfire Area\", \"Hiking Trails\"]','[{\"date\": \"2025-05-20\", \"available\": false}, {\"date\": \"2025-05-21\", \"available\": true}]','PENDING',0);
/*!40000 ALTER TABLE `venues` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-08 10:43:35
