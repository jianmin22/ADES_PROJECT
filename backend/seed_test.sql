CREATE DATABASE  IF NOT EXISTS `ades_bakery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ades_bakery`;
-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ades_bakery
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `idtest` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idtest`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (1,'Joseph Roques','joseph.roques9@yahoo.com'),(2,'Ruth Tuitt','ruth.tuitt94@yahoo.com'),(3,'Daniel Thigpen','daniel.thigpen6@outlook.com'),(4,'Alton Gondek','alton.gondek81@gmail.com'),(5,'Charity Robinson','charity.robinson55@gmail.com'),(6,'Jason Bearden','jason.bearden95@icloud.com'),(7,'Maggie Rodriguez','maggie.rodriguez42@outlook.com'),(8,'Lori Addesso','lori.addesso66@outlook.com'),(9,'Andre Miller','andre.miller67@outlook.com'),(10,'Douglas Statler','douglas.statler77@gmail.com'),(11,'Edward Johnson','edward.johnson4@outlook.com'),(12,'Adriana Malec','adriana.malec86@gmail.com'),(13,'Rashad Cumpston','rashad.cumpston51@gmail.com'),(14,'Craig Daniels','craig.daniels31@yahoo.com'),(15,'Susie Schaffert','susie.schaffert86@yahoo.com'),(16,'Stephanie Arellano','stephanie.arellano59@gmail.com'),(17,'Erich Buckingham','erich.buckingham36@gmail.com'),(18,'Tina Stall','tina.stall78@icloud.com'),(19,'John Arfman','john.arfman42@outlook.com'),(20,'Josephine Duncan','josephine.duncan93@yahoo.com'),(21,'Gene Brown','gene.brown56@icloud.com'),(22,'David Flores','david.flores70@yahoo.com'),(23,'Timothy Mercer','timothy.mercer67@gmail.com'),(24,'Crystal Rice','crystal.rice28@gmail.com'),(25,'Hope Cloer','hope.cloer77@outlook.com'),(26,'Darrell Swanson','darrell.swanson39@outlook.com'),(27,'Milton Debnam','milton.debnam84@gmail.com'),(28,'Harold Sanders','harold.sanders23@icloud.com'),(29,'Randall Jansen','randall.jansen81@icloud.com'),(30,'Otilia Trevino','otilia.trevino14@gmail.com'),(31,'Michelle Thompson','michelle.thompson64@outlook.com'),(32,'Gwenda Carpenter','gwenda.carpenter95@yahoo.com'),(33,'Hazel Adams','hazel.adams57@icloud.com'),(34,'Deborah Smith','deborah.smith64@outlook.com'),(35,'Carlene Olsen','carlene.olsen90@yahoo.com'),(36,'Francesca Verduzco','francesca.verduzco87@icloud.com'),(37,'Jason Stallings','jason.stallings45@gmail.com'),(38,'Larry Sisco','larry.sisco26@yahoo.com'),(39,'John Watkins','john.watkins64@yahoo.com'),(40,'Michael Cross','michael.cross20@outlook.com'),(41,'Sally Carter','sally.carter24@gmail.com'),(42,'Mildred Weeks','mildred.weeks8@gmail.com'),(43,'Dennis Curry','dennis.curry33@outlook.com'),(44,'Timothy Cox','timothy.cox11@gmail.com'),(45,'Sonia Germain','sonia.germain66@yahoo.com'),(46,'Joshua Patton','joshua.patton7@icloud.com'),(47,'Carol Rinehart','carol.rinehart11@yahoo.com'),(48,'Dorothy Burnette','dorothy.burnette41@yahoo.com'),(49,'Jose Zalewski','jose.zalewski92@gmail.com'),(50,'Crystal Hudock','crystal.hudock15@yahoo.com');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-10 14:17:05
