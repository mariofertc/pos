-- phpMyAdmin SQL Dump
-- version 2.8.0.1
-- http://www.phpmyadmin.net
-- 
-- Host: custsql-myd02.eigbox.net
-- Generation Time: Feb 26, 2017 at 08:39 AM
-- Server version: 5.6.32
-- PHP Version: 4.4.9
-- 
-- Database: `dongu`
-- 
CREATE DATABASE `pos` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `pos`;

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_abonos`
-- 

CREATE TABLE `phppos_abonos` (
  `abono_id` int(10) NOT NULL AUTO_INCREMENT,
  `abono_amount` double(15,2) NOT NULL,
  `abono_type` varchar(50) NOT NULL,
  `abono_comment` varchar(200) DEFAULT NULL,
  `payment_id` int(10) NOT NULL,
  `sale_id` int(10) NOT NULL,
  `abono_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`abono_id`),
  KEY `fk_sale_in_abono` (`sale_id`),
  KEY `fk_payment_in_abono` (`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `phppos_abonos`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_almacenes`
-- 

CREATE TABLE `phppos_almacenes` (
  `almacen_id` int(10) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `deleted` int(1) DEFAULT '0',
  `utilidad` int(3) DEFAULT '0',
  PRIMARY KEY (`almacen_id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=latin1 AUTO_INCREMENT=32 ;

-- 
-- Dumping data for table `phppos_almacenes`
-- 

INSERT INTO `phppos_almacenes` VALUES (23, 'Principal', 'La Y', 0, 35);
INSERT INTO `phppos_almacenes` VALUES (31, 'Bodega', 'La Merced', 0, 0);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_app_config`
-- 

CREATE TABLE `phppos_app_config` (
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_app_config`
-- 

INSERT INTO `phppos_app_config` VALUES ('address', '27 de Febrero y Atahualpha');
INSERT INTO `phppos_app_config` VALUES ('company', 'DonGu');
INSERT INTO `phppos_app_config` VALUES ('default_tax_1_name', 'IVA');
INSERT INTO `phppos_app_config` VALUES ('default_tax_1_rate', '14');
INSERT INTO `phppos_app_config` VALUES ('default_tax_2_name', 'Impuesto 2 sobre las Ventas');
INSERT INTO `phppos_app_config` VALUES ('default_tax_2_rate', '');
INSERT INTO `phppos_app_config` VALUES ('default_tax_rate', '8');
INSERT INTO `phppos_app_config` VALUES ('email', 'info@dongu90.com');
INSERT INTO `phppos_app_config` VALUES ('fax', '');
INSERT INTO `phppos_app_config` VALUES ('language', 'spanishec');
INSERT INTO `phppos_app_config` VALUES ('phone', '032885885');
INSERT INTO `phppos_app_config` VALUES ('print_after_sale', 'print_after_sale');
INSERT INTO `phppos_app_config` VALUES ('return_policy', 'Salida la Mercadería no se aceptan devoluciones solo cambios hasta 8 dias, solo con la factura');
INSERT INTO `phppos_app_config` VALUES ('timezone', 'America/Bogota');
INSERT INTO `phppos_app_config` VALUES ('version', '10.0');
INSERT INTO `phppos_app_config` VALUES ('website', 'http://dongu90.com');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_boxes`
-- 

CREATE TABLE `phppos_boxes` (
  `close_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comment` text NOT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `box_id` int(11) NOT NULL AUTO_INCREMENT,
  `deleted` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`box_id`),
  KEY `pk_employees_boxes` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `phppos_boxes`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_cart`
-- 

CREATE TABLE `phppos_cart` (
  `cart_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT '1',
  `fecha_agregado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

-- 
-- Dumping data for table `phppos_cart`
-- 

INSERT INTO `phppos_cart` VALUES (3, 3, 4, 2, '2015-04-08 18:12:58');
INSERT INTO `phppos_cart` VALUES (4, 3, 3, 1, '2015-04-08 18:13:00');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_customers`
-- 

CREATE TABLE `phppos_customers` (
  `person_id` int(10) NOT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `taxable` int(1) NOT NULL DEFAULT '1',
  `deleted` int(1) NOT NULL DEFAULT '0',
  UNIQUE KEY `account_number` (`account_number`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_customers`
-- 

INSERT INTO `phppos_customers` VALUES (1087, NULL, 1, 0);
INSERT INTO `phppos_customers` VALUES (1089, NULL, 1, 0);
INSERT INTO `phppos_customers` VALUES (1093, NULL, 1, 0);
INSERT INTO `phppos_customers` VALUES (1094, NULL, 1, 0);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_employees`
-- 

CREATE TABLE `phppos_employees` (
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `person_id` int(10) NOT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  UNIQUE KEY `username` (`username`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_employees`
-- 

INSERT INTO `phppos_employees` VALUES ('mariofertc', 'cebdd715d4ecaafee8f147c2e85e0754', 180, 0);
INSERT INTO `phppos_employees` VALUES ('dongu', '996055e145b7575ee6baf93e87ed1d7a', 298, 0);
INSERT INTO `phppos_employees` VALUES ('james007', 'e84c55c90d955bf1cfa2d31a1f425383', 1088, 0);
INSERT INTO `phppos_employees` VALUES ('vendedor', 'a60c36fc7c825e68bb5371a0e08f828a', 527, 0);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_files`
-- 

CREATE TABLE `phppos_files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `size` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `item_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `phppos_files`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_inventory`
-- 

CREATE TABLE `phppos_inventory` (
  `trans_id` int(11) NOT NULL AUTO_INCREMENT,
  `trans_items` int(11) NOT NULL DEFAULT '0',
  `trans_user` int(11) NOT NULL DEFAULT '0',
  `trans_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `trans_comment` text NOT NULL,
  `trans_inventory` double(15,2) DEFAULT NULL,
  PRIMARY KEY (`trans_id`),
  KEY `phppos_inventory_ibfk_1` (`trans_items`),
  KEY `phppos_inventory_ibfk_2` (`trans_user`)
) ENGINE=MyISAM AUTO_INCREMENT=82 DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

-- 
-- Dumping data for table `phppos_inventory`
-- 

INSERT INTO `phppos_inventory` VALUES (1, 1, 298, '2016-10-21 12:38:51', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (2, 1, 298, '2016-10-21 12:40:34', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (3, 1, 298, '2016-10-21 12:41:43', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (4, 2, 298, '2016-10-21 17:37:22', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (5, 1, 298, '2016-10-22 08:35:50', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (6, 2, 298, '2016-10-22 08:36:17', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (7, 2, 180, '2016-10-25 07:27:35', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (8, 2, 180, '2016-10-25 07:36:47', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (9, 2, 180, '2016-10-26 08:40:57', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (10, 2, 180, '2016-10-26 08:44:32', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (11, 2, 180, '2016-10-26 08:45:58', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (12, 2, 180, '2016-11-16 12:05:49', 'Vent 1', -1.00);
INSERT INTO `phppos_inventory` VALUES (13, 3, 180, '2016-11-17 15:39:15', 'Edición Manual de Cantidad', 24.00);
INSERT INTO `phppos_inventory` VALUES (14, 3, 180, '2016-11-17 15:39:47', 'Robo', 4.00);
INSERT INTO `phppos_inventory` VALUES (15, 3, 180, '2016-11-17 15:40:44', 'fgfg', 10.00);
INSERT INTO `phppos_inventory` VALUES (16, 2, 180, '2016-11-25 20:32:40', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (17, 4, 180, '2016-11-25 20:34:36', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (18, 2, 180, '2016-11-25 20:35:40', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (19, 4, 180, '2016-11-25 20:36:04', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (20, 1, 180, '2016-11-25 20:38:19', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (21, 5, 180, '2016-11-25 20:50:52', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (22, 6, 180, '2016-11-25 20:51:23', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (23, 7, 180, '2016-11-25 20:51:50', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (24, 8, 180, '2016-11-25 20:54:21', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (25, 9, 180, '2016-11-25 20:57:26', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (26, 10, 180, '2016-11-25 20:57:47', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (27, 11, 180, '2016-11-25 20:59:01', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (28, 12, 180, '2016-11-25 20:59:48', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (29, 13, 180, '2016-11-25 21:00:15', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (30, 14, 180, '2016-11-25 21:00:32', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (31, 15, 180, '2016-11-25 21:00:47', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (32, 16, 180, '2016-11-25 21:01:00', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (33, 17, 180, '2016-11-25 21:01:13', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (34, 18, 180, '2016-11-25 21:01:28', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (35, 19, 180, '2016-11-25 21:03:17', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (36, 14, 180, '2016-11-25 21:06:14', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (37, 15, 180, '2016-11-25 21:06:22', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (38, 9, 180, '2016-11-25 21:07:26', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (39, 10, 180, '2016-11-25 21:07:54', 'Edición Manual de Cantidad', -1.00);
INSERT INTO `phppos_inventory` VALUES (40, 20, 180, '2016-11-25 21:09:15', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (41, 21, 180, '2016-11-25 21:09:38', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (42, 22, 180, '2016-11-25 21:13:11', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (43, 23, 180, '2016-11-25 21:15:04', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (44, 24, 298, '2017-01-03 08:13:01', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (45, 24, 298, '2017-01-03 08:15:12', 'Traspaso de Almacenes', 2.00);
INSERT INTO `phppos_inventory` VALUES (46, 24, 298, '2017-01-03 08:15:26', 'Traspaso de Almacenes', 2.00);
INSERT INTO `phppos_inventory` VALUES (47, 24, 298, '2017-01-03 08:16:23', 'Traspaso de Almacenes', 2.00);
INSERT INTO `phppos_inventory` VALUES (48, 24, 298, '2017-01-03 08:16:32', 'Traspaso de Almacenes', 2.00);
INSERT INTO `phppos_inventory` VALUES (49, 25, 298, '2017-01-11 18:16:58', 'Edición Manual de Cantidad', 2.00);
INSERT INTO `phppos_inventory` VALUES (50, 26, 298, '2017-01-11 18:38:58', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (51, 27, 298, '2017-01-11 18:39:30', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (52, 28, 298, '2017-01-11 18:40:05', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (53, 29, 298, '2017-01-11 18:42:05', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (54, 30, 298, '2017-01-11 18:44:10', 'Edición Manual de Cantidad', 2.00);
INSERT INTO `phppos_inventory` VALUES (55, 31, 298, '2017-01-11 18:45:26', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (56, 30, 298, '2017-01-11 18:47:43', 'Vent 2', -1.00);
INSERT INTO `phppos_inventory` VALUES (57, 31, 298, '2017-01-11 18:47:43', 'Vent 2', -1.00);
INSERT INTO `phppos_inventory` VALUES (58, 32, 298, '2017-01-14 17:36:20', 'Edición Manual de Cantidad', 2.00);
INSERT INTO `phppos_inventory` VALUES (59, 32, 298, '2017-01-14 17:38:10', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (60, 33, 298, '2017-01-14 17:40:42', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (61, 34, 298, '2017-01-14 17:42:08', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (62, 33, 298, '2017-01-14 17:43:24', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (63, 34, 298, '2017-01-14 17:43:48', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (64, 32, 298, '2017-01-14 17:52:57', 'Vent 3', -1.00);
INSERT INTO `phppos_inventory` VALUES (65, 33, 298, '2017-01-14 17:52:57', 'Vent 3', -1.00);
INSERT INTO `phppos_inventory` VALUES (66, 34, 298, '2017-01-14 17:52:57', 'Vent 3', -1.00);
INSERT INTO `phppos_inventory` VALUES (67, 24, 298, '2017-01-14 18:18:44', 'Vent 4', -1.00);
INSERT INTO `phppos_inventory` VALUES (68, 25, 180, '2017-01-15 10:12:03', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (69, 25, 180, '2017-01-15 10:12:44', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (70, 4, 180, '2017-01-15 10:37:18', 'Vent 5', -1.00);
INSERT INTO `phppos_inventory` VALUES (71, 25, 180, '2017-01-15 10:37:18', 'Vent 5', -1.00);
INSERT INTO `phppos_inventory` VALUES (72, 35, 298, '2017-02-15 12:32:04', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (73, 36, 298, '2017-02-15 12:35:18', 'Edición Manual de Cantidad', 2.00);
INSERT INTO `phppos_inventory` VALUES (74, 36, 298, '2017-02-15 12:36:08', 'Edición Manual de Cantidad', -2.00);
INSERT INTO `phppos_inventory` VALUES (75, 36, 298, '2017-02-15 12:38:18', 'Edición Manual de Cantidad', -4.00);
INSERT INTO `phppos_inventory` VALUES (76, 36, 298, '2017-02-15 12:39:21', 'Edición Manual de Cantidad', 0.00);
INSERT INTO `phppos_inventory` VALUES (77, 37, 298, '2017-02-15 17:36:08', 'Edición Manual de Cantidad', 1.00);
INSERT INTO `phppos_inventory` VALUES (78, 37, 298, '2017-02-15 17:37:06', 'Traspaso de Almacenes', 3.00);
INSERT INTO `phppos_inventory` VALUES (79, 37, 298, '2017-02-15 17:37:49', 'Edición Manual de Cantidad', -3.00);
INSERT INTO `phppos_inventory` VALUES (80, 35, 298, '2017-02-15 17:38:10', 'Edición Manual de Cantidad', -3.00);
INSERT INTO `phppos_inventory` VALUES (81, 38, 298, '2017-02-15 19:37:02', 'Edición Manual de Cantidad', 1.00);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_items`
-- 

CREATE TABLE `phppos_items` (
  `name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `supplier_id` int(11) DEFAULT NULL,
  `item_number` varchar(255) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `cost_price` double(15,2) NOT NULL,
  `unit_price` double(15,2) NOT NULL,
  `quantity` double(15,2) NOT NULL DEFAULT '0.00',
  `reorder_level` double(15,2) NOT NULL DEFAULT '0.00',
  `item_id` int(10) NOT NULL AUTO_INCREMENT,
  `allow_alt_description` tinyint(1) DEFAULT NULL,
  `is_serialized` tinyint(1) DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  `size` varchar(10) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `color_value` varchar(10) DEFAULT NULL,
  `brand` varchar(30) DEFAULT NULL,
  `tags` varchar(100) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  UNIQUE KEY `item_number` (`item_number`),
  KEY `phppos_items_ibfk_1` (`supplier_id`)
) ENGINE=MyISAM AUTO_INCREMENT=39 DEFAULT CHARSET=latin1 AUTO_INCREMENT=39 ;

-- 
-- Dumping data for table `phppos_items`
-- 

INSERT INTO `phppos_items` VALUES ('BUNKY', 'ZAPATO', 1090, '17000', '', 16.00, 25.00, 1.00, 1.00, 1, 0, 0, 1, '26', 'NEGRO', '', '', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, '11', '', 16.00, 25.00, 1.00, 2.00, 2, 0, 0, 1, '27', '', '#000000', 'Bunky', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('Llavero Ambato', 'souvenirs', 1090, '456745', 'sdfgfsdg  fsdg sdfg sdf gsdf gd f', 2.00, 5.00, 28.00, 3.00, 3, 0, 0, 1, '', '', '', 'xxx', 'llavero,redondo', '34');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, '12', '', 16.75, 26.00, 0.00, 2.00, 4, 0, 0, 1, '29', 'Negro', '#050000', 'Bunky', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 16.75, 26.00, 1.00, 2.00, 5, 0, 0, 1, '30', 'Negro', '#020000', 'Bunky', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 16.75, 26.00, 1.00, 2.00, 6, 0, 0, 1, '31', 'Negro', '#070000', 'Bunky', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 16.75, 26.00, 1.00, 2.00, 7, 0, 0, 1, '32', 'Negro', '#0a0000', 'Bunky', 'HOMBRE', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 17.75, 28.00, 1.00, 2.00, 8, 0, 0, 1, '33', '', '#010000', 'Bunky', 'HOMBRE,Cordón', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 17.75, 28.00, 2.00, 2.00, 9, 0, 0, 1, '34', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 17.75, 28.00, 0.00, 2.00, 10, 0, 0, 1, '35', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 17.75, 28.00, 1.00, 2.00, 11, 0, 0, 1, '36', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 1.00, 2.00, 12, 0, 0, 1, '37', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 1.00, 2.00, 13, 0, 0, 1, '38', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 2.00, 2.00, 14, 0, 0, 1, '39', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 2.00, 2.00, 15, 0, 0, 1, '40', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 1.00, 2.00, 16, 0, 0, 1, '41', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 1.00, 2.00, 17, 0, 0, 1, '42', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 19.45, 30.00, 1.00, 2.00, 18, 0, 0, 1, '43', '', '', 'Bunky', 'HOMBRE,Cordón,17000', '12');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'Botín', 1090, NULL, '', 17.45, 27.00, 1.00, 2.00, 19, 0, 0, 1, '28', '', '', 'Bunky', 'HOMBRE,Cordón,17400', '13');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'Botín', 1090, NULL, '', 19.30, 30.00, 1.00, 2.00, 20, 0, 0, 1, '29', '', '', 'Bunky', 'HOMBRE,Cordón,17400', '13');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'Botín', 1090, NULL, '', 19.30, 30.00, 1.00, 2.00, 21, 0, 0, 1, '32', '', '', 'Bunky', 'HOMBRE,Cordón,17400', '13');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 13.95, 22.00, 1.00, 2.00, 22, 0, 0, 1, '24', '', '#060000', 'Bunky', 'Mujer,40500,Correa', '40500');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 13.95, 22.00, 1.00, 2.00, 23, 0, 0, 1, '25', '', '', 'Bunky', 'Mujer,40500,Correa', '40500');
INSERT INTO `phppos_items` VALUES ('BUNKY', 'ZAPATO', 1090, NULL, '', 16.00, 16.00, 2.00, 1.00, 24, 0, 0, 1, '26', '', '#070606', '', '', '17000');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 25, 0, 0, 1, '37', 'AVELA', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 26, 0, 0, 1, '38', 'AVELA', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 27, 0, 0, 1, '38', '', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 28, 0, 0, 1, '40', 'AVELA', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 29, 0, 0, 1, '39', '', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, '', 20.18, 39.00, 1.00, 1.00, 30, 0, 0, 1, '39', '', '', '', '', 'X5934');
INSERT INTO `phppos_items` VALUES ('BUNKY Negro', 'ZAPATO', 1090, NULL, '', 13.95, 22.00, 0.00, 2.00, 31, 0, 0, 1, '29', '', '', 'Bunky', 'Mujer,40500,Correa', '40500');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, 'MAGNOLIA', 50.00, 65.00, 1.00, 1.00, 32, 0, 0, 1, '34', 'AVELA', '#cbc115', '', '', 'Z1501');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, 'MAGNOLIA', 50.00, 65.00, 0.00, 1.00, 33, 0, 0, 1, '35', 'AVELA', '#d6be4f', '', '', 'Z1501');
INSERT INTO `phppos_items` VALUES ('KOLOSH', 'SANDALIA', 1092, NULL, 'MAGNOLIA', 50.00, 65.00, 0.00, 1.00, 34, 0, 0, 1, '40', 'AVELA', '#e0c236', '', '', 'Z1501');
INSERT INTO `phppos_items` VALUES ('AZALEIA', 'SANDALIA', 1095, '424/450', '', 25.00, 35.00, 1.00, 1.00, 35, 0, 0, 0, '34', 'NOZES', '', '', '', '424/450');
INSERT INTO `phppos_items` VALUES ('AZALEIA', 'SANDALIA', 1095, NULL, '', 25.00, 35.00, 2.00, 1.00, 36, 0, 0, 0, '35', 'NAPA NOZES', '', '', '', '424/450');
INSERT INTO `phppos_items` VALUES ('AZALEIA', 'SANDALIAS', 1095, NULL, '', 25.00, 35.00, 1.00, 1.00, 37, 0, 0, 0, '36', 'NAPA NOZES', '', '', '', '424/450');
INSERT INTO `phppos_items` VALUES ('AZALEIA', 'SANDALIA', 1095, '604/530', '', 25.00, 35.00, 2.00, 1.00, 38, 0, 0, 0, '34', 'JUANA CANELA', '', '', '', '604/530');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_items_taxes`
-- 

CREATE TABLE `phppos_items_taxes` (
  `item_id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `percent` double(15,2) NOT NULL,
  PRIMARY KEY (`item_id`,`name`,`percent`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_items_taxes`
-- 

INSERT INTO `phppos_items_taxes` VALUES (1, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (2, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (3, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (4, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (5, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (6, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (7, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (8, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (9, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (10, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (11, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (12, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (13, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (14, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (15, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (16, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (17, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (18, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (19, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (20, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (21, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (22, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (23, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (24, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (25, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (26, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (27, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (28, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (29, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (30, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (31, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (32, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (33, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (34, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (35, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (36, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (37, 'IVA', 14.00);
INSERT INTO `phppos_items_taxes` VALUES (38, 'IVA', 14.00);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_modules`
-- 

CREATE TABLE `phppos_modules` (
  `name_lang_key` varchar(255) NOT NULL,
  `desc_lang_key` varchar(255) NOT NULL,
  `sort` int(10) NOT NULL,
  `module_id` varchar(255) NOT NULL,
  PRIMARY KEY (`module_id`),
  UNIQUE KEY `desc_lang_key` (`desc_lang_key`),
  UNIQUE KEY `name_lang_key` (`name_lang_key`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_modules`
-- 

INSERT INTO `phppos_modules` VALUES ('module_abonos', 'module_abonos_desc', 10, 'abonos');
INSERT INTO `phppos_modules` VALUES ('module_almacenes', 'module_almacenes_desc', 13, 'almacenes');
INSERT INTO `phppos_modules` VALUES ('module_close_box', 'module_close_box_desc', 8, 'boxes');
INSERT INTO `phppos_modules` VALUES ('module_config', 'module_config_desc', 12, 'config');
INSERT INTO `phppos_modules` VALUES ('module_customers', 'module_customers_desc', 1, 'customers');
INSERT INTO `phppos_modules` VALUES ('module_employees', 'module_employees_desc', 7, 'employees');
INSERT INTO `phppos_modules` VALUES ('module_items', 'module_items_desc', 2, 'items');
INSERT INTO `phppos_modules` VALUES ('module_payments', 'module_payments_desc', 9, 'payments');
INSERT INTO `phppos_modules` VALUES ('module_porpagar', 'module_porpagar_desc', 11, 'porpagar');
INSERT INTO `phppos_modules` VALUES ('module_receivings', 'module_receivings_desc', 5, 'receivings');
INSERT INTO `phppos_modules` VALUES ('module_reports', 'module_reports_desc', 3, 'reports');
INSERT INTO `phppos_modules` VALUES ('module_sales', 'module_sales_desc', 6, 'sales');
INSERT INTO `phppos_modules` VALUES ('module_suppliers', 'module_suppliers_desc', 4, 'suppliers');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_payments`
-- 

CREATE TABLE `phppos_payments` (
  `payment_id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_type` varchar(40) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT '0',
  `por_cobrar` int(1) DEFAULT '0',
  `sort` int(11) DEFAULT NULL,
  `have_plazo` int(1) DEFAULT '0',
  `payment_days` int(11) DEFAULT '0',
  `payment_months` int(11) DEFAULT '0',
  `share` int(11) DEFAULT '0',
  PRIMARY KEY (`payment_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1 AUTO_INCREMENT=24 ;

-- 
-- Dumping data for table `phppos_payments`
-- 

INSERT INTO `phppos_payments` VALUES (2, 'Efectivo', 0, 0, 1, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (3, 'Cheque', 0, 1, 3, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (4, 'Cuentas por Cobrar', 0, 1, 4, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (5, 'Tarjeta Débito', 0, 0, 5, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (13, 'Cr?dito 2 Sem', 1, 0, 6, 0, 7, 0, 2);
INSERT INTO `phppos_payments` VALUES (14, 'Cr?dito 60 d?as', 1, 0, 7, 0, 0, 2, 2);
INSERT INTO `phppos_payments` VALUES (15, 'Cr?dito Plazo Fijo', 1, 0, 8, 0, 1, 0, 1);
INSERT INTO `phppos_payments` VALUES (16, 'Tarjeta Crédito', 0, 0, 9, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (17, 'ABONO A LA FACTURA', 1, 0, NULL, 1, 30, 1, 0);
INSERT INTO `phppos_payments` VALUES (18, 'SALDOS 2011', 1, 0, NULL, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (19, 'SEPARADO', 1, 0, NULL, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (20, 'CUENTAS POR PAGAR', 1, 1, NULL, 1, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (21, 'Cuentas por pagar', 0, 0, NULL, 0, 0, 0, 0);
INSERT INTO `phppos_payments` VALUES (22, '6 meses', 0, 1, NULL, 1, 0, 6, 6);
INSERT INTO `phppos_payments` VALUES (23, 'Acumulativo', 0, 1, NULL, 1, 30, 0, 5);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_paypal`
-- 

CREATE TABLE `phppos_paypal` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(254) NOT NULL,
  `payment_id` varchar(50) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `valor` varchar(20) DEFAULT NULL,
  `descripcion` varchar(40) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1 AUTO_INCREMENT=8 ;

-- 
-- Dumping data for table `phppos_paypal`
-- 

INSERT INTO `phppos_paypal` VALUES (1, '2', 'PAY-5E871713ED106094YKUSAGDQ', 'approved', '12', '1', '2015-04-07 16:17:20');
INSERT INTO `phppos_paypal` VALUES (2, '2', 'PAY-2UE00548LX540141PKUSAORY', 'approved', '12', '1', '2015-04-07 16:35:20');
INSERT INTO `phppos_paypal` VALUES (3, '2', 'PAY-0GS2163430742331TKUSAQXY', 'created', '12', '1', '2015-04-07 11:39:58');
INSERT INTO `phppos_paypal` VALUES (4, '2', 'PAY-8ER491043V3096027KUSAR2A', 'created', '12', '1', '2015-04-07 11:42:16');
INSERT INTO `phppos_paypal` VALUES (5, '2', 'PAY-5NM51147BX784690TKUSASIQ', 'approved', '12', '1', '2015-04-07 16:43:15');
INSERT INTO `phppos_paypal` VALUES (6, '2', 'PAY-19V54538K52532359KUSATPQ', 'approved', '12', '1', '2015-04-07 16:45:52');
INSERT INTO `phppos_paypal` VALUES (7, '3', 'PAY-25S255896D479940PKUS2QEQ', 'created', '180', '4,3', '2015-04-08 17:13:36');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_people`
-- 

CREATE TABLE `phppos_people` (
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address_1` varchar(255) NOT NULL,
  `address_2` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `zip` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `comments` text NOT NULL,
  `person_id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`person_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1098 DEFAULT CHARSET=latin1 AUTO_INCREMENT=1098 ;

-- 
-- Dumping data for table `phppos_people`
-- 

INSERT INTO `phppos_people` VALUES ('John', 'Doe', '555-555-5555', 'admin@phppointofsale.com', 'Address 1', '', '', '', '', '', '', 1);
INSERT INTO `phppos_people` VALUES ('Josesaso', 'Solis', '', '', '', '', '', '', '', '', '', 2);
INSERT INTO `phppos_people` VALUES ('Mario', 'Torres', '', '', '', '', '', '', '', '', '', 3);
INSERT INTO `phppos_people` VALUES ('Juanito', 'Lara', '', '', '', '', '', '', '', '', '', 4);
INSERT INTO `phppos_people` VALUES ('Pepe', 'Robayo', '', '', '', '', '', '', '', '', '', 5);
INSERT INTO `phppos_people` VALUES ('Joaquin', 'Lalama', '', '', '', '', '', '', '', '', '', 6);
INSERT INTO `phppos_people` VALUES ('Ivonne Alexandra', 'Ald?s Mera', '', '', '', '', '', '', '', '', '', 7);
INSERT INTO `phppos_people` VALUES ('Vicente', 'Delgado', '', '', '', '', '', '', '', '', '', 8);
INSERT INTO `phppos_people` VALUES ('Patricia', 'Torres', '', 'pator@gmail.com', '', '', '', '', '', '', '', 9);
INSERT INTO `phppos_people` VALUES ('Tannia', 'Lascano', '', '', '', '', '', '', '', '', '', 10);
INSERT INTO `phppos_people` VALUES ('Gordita', 'Quito', '032876789', '', '', '', '', '', '', '', 'banco Pichincha', 11);
INSERT INTO `phppos_people` VALUES ('Patricio', 'Manobanda', '', '', '', '', '', '', '', '', 'Banco Guayaquil', 12);
INSERT INTO `phppos_people` VALUES ('Roc', 'Chavez', '22334455', '', '', '', '', '', '2223', '', '', 13);
INSERT INTO `phppos_people` VALUES ('Jamilet', 'Colombia', '', 'sex@xom.com', '', '', '', '', '', '', '', 14);
INSERT INTO `phppos_people` VALUES ('Carmen', 'Mangui', '', '', '', '', '', '', '', '', '', 15);
INSERT INTO `phppos_people` VALUES ('Jos', 'Acosta', '', '', '', '', '', '', '', '', '', 16);
INSERT INTO `phppos_people` VALUES ('Patricia Joaquina', 'Torres Toala', '', '', '', '', '', '', '', '', '', 17);
INSERT INTO `phppos_people` VALUES ('Daniela', 'Fernandez', '', '', '', '', '', '', '', '', '', 18);
INSERT INTO `phppos_people` VALUES ('Mario', 'Perez', '', '', '', '', '', '', '', '', '', 19);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 20);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 21);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 22);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 23);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 24);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 25);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 26);
INSERT INTO `phppos_people` VALUES ('0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', 27);
INSERT INTO `phppos_people` VALUES ('mar', 'tor', '', '', '', '', '', '', '', '', '', 28);
INSERT INTO `phppos_people` VALUES ('mar', 'tor', '', '', '', '', '', '', '', '', '', 29);
INSERT INTO `phppos_people` VALUES ('Carlos', 'Llucsa', '', '', '', '', '', '', '', '', '', 30);
INSERT INTO `phppos_people` VALUES ('Mario', 'Torres', '', '', '', '', '', '', '', '', '', 31);
INSERT INTO `phppos_people` VALUES ('Juan', 'Salas', '', '', '', '', '', '', '', '', '', 32);
INSERT INTO `phppos_people` VALUES ('Juan', 'Lalama', '', '', '', '', '', '', '', '', '', 33);
INSERT INTO `phppos_people` VALUES ('Freddy', 'Cabezas', '', '', '', '', '', '', '', '', '', 34);
INSERT INTO `phppos_people` VALUES ('Juan Alejandro', 'Cajas Monroy', '', '', '', '', '', '', '', '', '', 35);
INSERT INTO `phppos_people` VALUES ('Mart?n', 'Molina', '099358004', '', '', '', 'Cuenca', 'Azuay', '', 'Ecuador', '', 36);
INSERT INTO `phppos_people` VALUES ('Miryan', 'Morales', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 37);
INSERT INTO `phppos_people` VALUES ('Humberto', 'Molina', '', '', '', '', '', '', '', '', '', 38);
INSERT INTO `phppos_people` VALUES ('Vendedores', 'Varios', '', '', '', '', 'Ambato', 'Tungurahua', '', 'Ecuador', '', 39);
INSERT INTO `phppos_people` VALUES ('A?da Margot', 'Daqui Janeta', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 40);
INSERT INTO `phppos_people` VALUES ('Carlos', 'Ter?n', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 41);
INSERT INTO `phppos_people` VALUES ('N\n', 'N', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 42);
INSERT INTO `phppos_people` VALUES ('Eguberto', 'Molina', '', '', '', '', '', '', '', '', '', 43);
INSERT INTO `phppos_people` VALUES ('Juan', 'Vaca', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 44);
INSERT INTO `phppos_people` VALUES ('Diego', 'Larrea', '', '', '', '', '', '', '', '', '', 45);
INSERT INTO `phppos_people` VALUES ('Monica', 'Cobo', '096275971', '', '', '', '', '', '', '', '', 46);
INSERT INTO `phppos_people` VALUES ('Marcela', 'Romero', '02-232237 / 095666704', '', '', '', '', '', '', '', '', 47);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 48);
INSERT INTO `phppos_people` VALUES ('Yolanda', 'Villota', '', '', '', '', '', '', '', '', 'Produbanco', 49);
INSERT INTO `phppos_people` VALUES ('Carolina', 'Andrade', '', '', '', '', '', '', '', '', '', 50);
INSERT INTO `phppos_people` VALUES ('Marcela', 'Romero', '095666704', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 58);
INSERT INTO `phppos_people` VALUES ('Sr', 'Caiza', '', '', '', '', '', '', '', '', '', 59);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 60);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 61);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 62);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 63);
INSERT INTO `phppos_people` VALUES ('N', 'N', '022474585', '', 'Mariano Cardenal 7335 y Jos? Larrea', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 64);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 65);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 66);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 67);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 68);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 69);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 70);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 71);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 72);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 73);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 74);
INSERT INTO `phppos_people` VALUES ('nn', 'nn', '', '', '', '', '', '', '', '', '', 75);
INSERT INTO `phppos_people` VALUES ('nn', 'nn', '', '', '', '', '', '', '', '', '', 76);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 77);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 78);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 79);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 80);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 81);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 82);
INSERT INTO `phppos_people` VALUES ('SANDRA ', 'BELTRAN', '', '', '', '', '', '', '', '', '', 83);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 84);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 85);
INSERT INTO `phppos_people` VALUES ('Araceli ', 'Barreno', '', '', '', '', '', '', '', '', '', 86);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 87);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 88);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 89);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 90);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 91);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 92);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 93);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 94);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 95);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 96);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 97);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 98);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 99);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 100);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 101);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 102);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 103);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 104);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 105);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 106);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 107);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 108);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 109);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 110);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 111);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 112);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 113);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 114);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 115);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 116);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 117);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 118);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 119);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 120);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 121);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 122);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 123);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 124);
INSERT INTO `phppos_people` VALUES ('N', 'Sr castro', '', '', '', '', '', '', '', '', '', 125);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 126);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 127);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 128);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 129);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 130);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 131);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 132);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 133);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 134);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 135);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 136);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 137);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 138);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 139);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 140);
INSERT INTO `phppos_people` VALUES ('NN', 'NN', '', '', '', '', '', '', '', '', '', 141);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 142);
INSERT INTO `phppos_people` VALUES ('Emma', 'Chicaiza', '', '', '', '', '', '', '', '', '', 143);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 144);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 145);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 146);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 147);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 148);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 149);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 150);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 151);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 152);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 153);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 154);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 155);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 156);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 157);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 158);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 159);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 160);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 161);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 162);
INSERT INTO `phppos_people` VALUES ('N', 'N', '', '', '', '', '', '', '', '', '', 163);
INSERT INTO `phppos_people` VALUES ('Karla', 'Falquez', '', 'KK@II.COM', '', '', '', '', '1222', '', '', 164);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 165);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '0018907897', 'Ecuador', 'ninguno', 166);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '1313131313', 'Ecuador', 'ningun', 170);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 171);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 172);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 173);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 174);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 175);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 176);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 177);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 178);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 179);
INSERT INTO `phppos_people` VALUES ('Jose Luis', 'Acosta Suarez', '491333', 'jooo@kkkd.com', 'Simon Voil', 'Dount City', 'Ambato', 'Tungurahua', '000', 'Ecuador', 'ningun', 180);
INSERT INTO `phppos_people` VALUES ('Karina Irene', 'Opel Hustin', '221143', 'mitoyo@mitoyo.com', 'yahuira', 'urbina', 'Quito', 'Pichincha', '001', 'Ecuador', 'ninguno', 181);
INSERT INTO `phppos_people` VALUES ('Irene', 'Artiaga', '', '', '', '', '', '', '', '', '', 182);
INSERT INTO `phppos_people` VALUES ('Rosa  Amada', 'Vargas Ulloa', '095124343', 'rosa.amada69@hotmail.com', 'La  Prensa', ' Guajalo', 'Quito', 'Pichincha', '1802268654', 'Ecuador', 'TIENE ACSESO A TODOS LOS PUNTOS', 183);
INSERT INTO `phppos_people` VALUES ('Luis', 'Ronquillo', '086926199-042322090', '', 'Sucre y Santa Elena ', '', 'Guayaquil', 'Guayas', '', 'Ecuador', 'distriuidor de west,croydon ', 184);
INSERT INTO `phppos_people` VALUES ('Rosa', 'Alvarez', '', '', '', '', '', '', '', '', '', 185);
INSERT INTO `phppos_people` VALUES ('MARYURY', 'S?nchez', '081322973', '', 'La Ofelia', '', 'QUITO', 'Pichincha', '1718940305', 'ECUADOR', '', 186);
INSERT INTO `phppos_people` VALUES ('Cintia', 'Ronquillo', '093343750', '', 'Guayaquil', '', '', '', '', '', 'DISTRIBUIDOR DE KNUP, GRASEP', 187);
INSERT INTO `phppos_people` VALUES ('Grase', 'Figueroa', '093289760-2950984-042320195', '', 'Edi. el dorado ', 'Chimborazo y Chile ', 'guayaquil', 'guayas', '0992154527001', 'ecuador', '', 188);
INSERT INTO `phppos_people` VALUES ('Miguel', 'Hernandez', '088621472-042519980', '', 'edificio el galeon', '', 'guayaquil', 'guayas', '0991457712001', 'ecuador', 'DISTRIBUIDOR KANUP VALVULA- GRASEP', 189);
INSERT INTO `phppos_people` VALUES ('Nelson', 'Ruales', '095614255', '', '', '', 'quito', 'pichincha', '', 'ecuador', 'distribuidor Adix\n', 190);
INSERT INTO `phppos_people` VALUES ('Cesar ', 'Vasquez', '0422404376', '', 'La Bahia', '', 'Guayaquil ', 'Guayas', '', 'Ecuador', '', 191);
INSERT INTO `phppos_people` VALUES ('Bolivar', 'Vallesteros', '032412260 / 098715814', '', 'Manuelita Saenz', '', 'Ambato', 'Tungurahua', '1801882620001', 'Ecuador', 'Distribuidor de calzado clasico', 192);
INSERT INTO `phppos_people` VALUES ('Javier', 'Montero', '042329047', '', 'edificio el galeon', '', 'Guayaquil', 'Guayas', '', 'Ecuador', 'Distribuidor proescate, knup,\nskaters', 193);
INSERT INTO `phppos_people` VALUES ('Janeth', 'Diaz', '085669858', '', 'Colon y Dies de Agosto', '', 'Quito', 'Pichincha', '', 'Ecuador', 'Distribuidor de groove, botas de mujer ', 194);
INSERT INTO `phppos_people` VALUES ('Jaqueline', 'Rojas', '042326468', '', 'Colon y Malecon', '', 'Guayaquil', 'Guayas', '', 'Ecuador', 'Distriduidor de roquer, ', 195);
INSERT INTO `phppos_people` VALUES ('Gladys ', 'de Rivera', '', '', 'Ceballos ', '', 'Ambato', 'Tungurahua', '', 'Ecuador', 'Distribuidor de botas y botines ', 196);
INSERT INTO `phppos_people` VALUES ('Gladis', 'de Rivera', '', '', 'Cevallos  ', '', 'Ambato', 'Tungurahua', '', 'Ecuador', 'distribuidor de botas y botines ', 197);
INSERT INTO `phppos_people` VALUES ('Judith', 'Carrillo', '', '', 'Cevallos', '', 'Ambato', 'Tungurahua', '', 'Ecuador', 'Distribuidor de botas squimal ', 198);
INSERT INTO `phppos_people` VALUES ('Cecilia ', 'Lopez', '092829994', '', 'C.C.M.N.A', 'AV. Maldonado ', 'Quito', 'Pichincha ', '', 'Ecuador', 'distribuidor de zapato de mujer ', 199);
INSERT INTO `phppos_people` VALUES ('Nelson ', 'Ruales ', '097614255', '', 'La Mena ', '', 'Quito', 'Pichincha', '', 'Ecuador', 'Distribuidor deportivo de ni?o ', 200);
INSERT INTO `phppos_people` VALUES ('CESAR', 'VASQUEZ', '0', '', 'Guayaquil', 'LA BAHIA', 'GUYAQUIL', 'GUAYAS', '1000200', 'ECUADOR', 'sapatilla de mujer de adesivo 35-38', 201);
INSERT INTO `phppos_people` VALUES ('SILVANA ', 'DE URGUILES', '042323310', '', 'edificio el galeon', '', '', '', '', '', 'DISTRIBUIDOR  DE RANCO ', 202);
INSERT INTO `phppos_people` VALUES ('IVAN', 'sailema ', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'bota de cuero', 203);
INSERT INTO `phppos_people` VALUES ('BERTHA', 'SANCHEZ', '', '', '', '', 'CEBALLOS', 'Tungurahua', '', 'Ecuador', 'BOTA DE CUERO', 204);
INSERT INTO `phppos_people` VALUES ('Jomayra', 'Uribe', '089983907', 'superyojj@hotmail.com', 'la breta?a', '', 'Quito', 'Pichincha', '1725216657', 'Ecuador', 'vendedora majo 2', 205);
INSERT INTO `phppos_people` VALUES ('Alicia Oliva', 'Sanchez', '023210618', '', 'CCMNA  Asc Tungurahua', 'Maldonado y Quimiag', 'Quito', 'Pichincha', '', 'Ecuador', 'Venta  al por mayor', 206);
INSERT INTO `phppos_people` VALUES ('ISABEL', 'Negrete', '', '', 'C. C.Chillogallo', '', 'Quito', 'Pichincha', '', 'Ecuador', 'Vntas por mayor', 208);
INSERT INTO `phppos_people` VALUES ('Mar', 'Rosa', '', '', 'C.C.M.N. A.', 'Asc Tungurahua', 'Quito', 'Pichincha', '', 'Ecuador', 'Venta por mayor', 212);
INSERT INTO `phppos_people` VALUES ('BLANCA', 'PROA?O', '', '', '', '', '', '', '', '', 'CLIENTE "CREDITO"', 213);
INSERT INTO `phppos_people` VALUES ('DAISY', 'CABRERA', '', '', '', '', '', '', '', '', 'VENTA DE CONTADO', 214);
INSERT INTO `phppos_people` VALUES ('DAISY', 'CABRERA', '', '', '', '', '', '', '', '', 'VENTA DE CONTADO', 215);
INSERT INTO `phppos_people` VALUES ('Saulo', 'Pallo', '097142917', 'danipallo@hotmail.com', 'La lucha de los pobres', '', 'Quito', 'Pichincha', '1751280593', 'Ecuador', ' YA NO TRABAJA EN LA EMPRESA', 232);
INSERT INTO `phppos_people` VALUES ('NICOLAS', 'HERAS', '097484636', '', 'CIUDADELA CLEMENTE VALLEN', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 233);
INSERT INTO `phppos_people` VALUES ('HILDA ', 'SANTANA', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 234);
INSERT INTO `phppos_people` VALUES ('CONSUMIDOR', 'FINAL', '', '', '', '', '', '', '', '', '', 235);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'SALCEDO', '', '', '', '', '', '', '', '', '', 236);
INSERT INTO `phppos_people` VALUES ('ROSA', 'VARGAS', '095124343', '', '', '', 'QUITO', 'Pichincha', '1802268654', 'Ecuador', '', 237);
INSERT INTO `phppos_people` VALUES ('ANITA', 'NICOLALDE', '', '', 'MINAS', '', 'QUITO', 'Pichincha', '', 'Ecuador', 'CLIENTE COMPRA AL POR MAYOR', 238);
INSERT INTO `phppos_people` VALUES ('MARTHA', 'TOCTAQUIZA', '', '', 'HERMANO MIGUEL', '', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 239);
INSERT INTO `phppos_people` VALUES ('BLANCA ', 'PADILLA', '', '', 'IBARRA', '', 'IBARRA', 'IMBABURA', '', 'Ecuador', 'COMPRA AL POR MAYOR', 240);
INSERT INTO `phppos_people` VALUES ('PILAR ', 'CAJILEMA', '2510498', '', 'HERMANO MIGUEL', '', 'QUITO', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 241);
INSERT INTO `phppos_people` VALUES ('ROSA ', 'HERAS', '', '', '', '', 'QUITO', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 242);
INSERT INTO `phppos_people` VALUES ('AMERICA DE LA', 'LANDAZURI', '', '', 'EL QUICHE', '', 'EL QUICHE', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 243);
INSERT INTO `phppos_people` VALUES ('MARLENE ', 'ALVARES', '2571248', '', 'CHILE E6-34 Y BALPARAIZO', '098797575', 'Quito', 'Pichincha', '', 'Ecuador', ' COMPRA AL POR MAYOR', 244);
INSERT INTO `phppos_people` VALUES ('NINFA', 'ARTEAGA', '0980236072', '', 'VILLAFLORA', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 245);
INSERT INTO `phppos_people` VALUES ('JENNY', 'ALVARES', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 246);
INSERT INTO `phppos_people` VALUES ('MARIA ROSA', 'POAQUIZA', '', '', '', 'CCMNA', 'Quito', 'Pichincha', '', 'Ecuador', 'CMPRA AL POR MAYOR', 247);
INSERT INTO `phppos_people` VALUES ('GLORIA', 'MOLINA', '', '', '', 'CHILLOGALLO', 'Quito', 'Pichincha', '', 'Ecuador', 'COIMPRA AL POR MAYOR', 248);
INSERT INTO `phppos_people` VALUES ('GLORIA', 'MOLINA', '', '', '', 'CHILLOGALLO', 'Quito', 'Pichincha', '', 'Ecuador', 'COIMPRA AL POR MAYOR', 249);
INSERT INTO `phppos_people` VALUES ('ROSA ', 'YANCHATU?A', '', '', '', 'CIUDADELA IBARRA', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 250);
INSERT INTO `phppos_people` VALUES ('DAVID', 'MOLINA GLORIA', '089440879', '', 'CHILLOGALLO', '', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR MAYOR', 251);
INSERT INTO `phppos_people` VALUES ('ROSA ', 'MONTERO', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA AL POR  MAYOR', 252);
INSERT INTO `phppos_people` VALUES ('VILMA', 'VIDAL', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'COMPRA UNIDADES POR MAYOR', 253);
INSERT INTO `phppos_people` VALUES ('GUIDO', 'CABRERA', '098454278', '', '3500120', 'Av 10 de Agosto y enrrique Guerrero', 'Quito', 'Pichincha', '', 'Ecuador', 'distribuye sapatilla deportiva y botas de mujer', 254);
INSERT INTO `phppos_people` VALUES ('MILTON', 'MU?OZ', '', '', '', '', 'CUENCA', 'CUENCA', '', 'Ecuador', 'VENDEDOR ZAPATO DE MUJER', 255);
INSERT INTO `phppos_people` VALUES ('MERCEDES', 'CUZCO', '3383388', '', '080627027', 'LA PLANADA', 'QUITO', 'Pichincha', '1712651452', 'Ecuador', 'VENTA AL POR MAYOR', 256);
INSERT INTO `phppos_people` VALUES ('SONIA ', 'NAVAS', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 257);
INSERT INTO `phppos_people` VALUES ('MARIA', 'VASQUEZ', '', '', '', '', '', '', '', '', 'VENTA PARA NEGOCIO', 258);
INSERT INTO `phppos_people` VALUES ('EDUARDO ', 'MEZA', '089304540', '', '', '', 'OTAVALO', 'IMBABURA', '', 'Ecuador', 'VENTA AL POR MAYOR', 259);
INSERT INTO `phppos_people` VALUES ('EDUARDO ', 'MEZA', '089304540', '', '', '', 'OTAVALO', 'IMBABURA', '', 'Ecuador', 'VENTA AL POR MAYOR', 260);
INSERT INTO `phppos_people` VALUES ('EDUARDO ', 'MEZA', '089304540', '', '', '', 'OTAVALO', 'IMBABURA', '', 'Ecuador', 'VENTA AL POR MAYOR', 261);
INSERT INTO `phppos_people` VALUES ('SEGUNDO', 'SANCHEZ', '092581756', '', 'ESTACIN RECREO TROLE', '', 'QUITO', 'Pichincha', '', 'Ecuador', 'VENTA AL POR  MAYOR', 262);
INSERT INTO `phppos_people` VALUES ('INES', 'MOLINA', '', '', '', 'CALDERON', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 263);
INSERT INTO `phppos_people` VALUES ('VICENTE', 'PINSON', '', '', '', '', '', 'LOJA', '1102268958', 'Ecuador', 'VENTA AL POR MAYOR', 264);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 265);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 266);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 267);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 268);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 269);
INSERT INTO `phppos_people` VALUES ('CARMELA ', 'CAIZA', '', '', '', '', 'CALDERON', 'Pichincha', '', 'Ecuador', 'VETA AL POR MAYOR  UNIDADES', 270);
INSERT INTO `phppos_people` VALUES ('CLIENTES', 'IVA', '', '', '', '', '', '', '', '', 'SOLO  PARA LOS CLIENTES QUE PIDEN FACTURA', 271);
INSERT INTO `phppos_people` VALUES ('IRALDA', 'MIRANDA', '', '', '', '', '', '', '', '', '', 272);
INSERT INTO `phppos_people` VALUES ('JHOSON', 'ELIZALDE ROSARIO', '081509047', '', '', '', '', '', '', '', 'VENTA CON TARJETA', 273);
INSERT INTO `phppos_people` VALUES ('MAGDALENA', 'BENALCAZAR', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 274);
INSERT INTO `phppos_people` VALUES ('MAARLENE ', 'ALVARES', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA  PARA NEGOCIO POR UNIDADES', 275);
INSERT INTO `phppos_people` VALUES ('WILSON', 'MEJIA', '', '', '', '', '', '', '', '', '', 276);
INSERT INTO `phppos_people` VALUES ('JORGE', 'GUANOLUISA', '2245954', '', 'COTOCOLLAO', '', 'QUITO', 'Pichincha', '0501746713', 'Ecuador', 'VENTA PARA NEGOCIO ', 277);
INSERT INTO `phppos_people` VALUES ('FINAL', 'CONSUMIDOR', '', '', '', '', '', '', '', '', '', 278);
INSERT INTO `phppos_people` VALUES ('JORGE', 'PAREDES', '', '', '', 'REGISTRO  CIVIL SUR', '', '', '', '', 'VENTA POR MAYOR', 279);
INSERT INTO `phppos_people` VALUES ('MARIA', 'COBO', '', '', '', '', '', '', '', '', '', 280);
INSERT INTO `phppos_people` VALUES ('RAMIRO', 'YUGSI', '3026215', '', 'SHARLI  LOTE 56', 'SANTA BARBARA', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA POR PARES PARA NEGOCIO', 281);
INSERT INTO `phppos_people` VALUES ('ENRRIQUE ', 'AMAGUA', '087406952', '', 'SANGOLQUI', 'VIA RUMILOMA', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA PARA NEGOCIO', 282);
INSERT INTO `phppos_people` VALUES ('ENRRIQUE ', 'AMAGUA', '087406952', '', 'SANGOLQUI', 'VIA RUMILOMA', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA PARA NEGOCIO', 283);
INSERT INTO `phppos_people` VALUES ('EDISON', 'CAMPOS', '2801458', '', 'CARCELEN', 'Urb. MARISOL CALLE10', 'Quito', 'Pichincha', '170668343-8', 'Ecuador', 'COMPRA PARA NEGOCIO POR PARES', 284);
INSERT INTO `phppos_people` VALUES ('SANDRA', 'ANDAGONA', '', '', '', '', '', '', '', '', 'VENTA IR ABONANDO', 285);
INSERT INTO `phppos_people` VALUES ('SUSANA ', 'CHICO', '', '', '', '', '', '', '', '', 'VENTA PARA HACER ABOS', 286);
INSERT INTO `phppos_people` VALUES ('SUSANA', 'SALCEDO', '', '', '', '', '', '', '', '', 'VENTA UNIDADE PARA NEGOCIO', 287);
INSERT INTO `phppos_people` VALUES ('VILMA', 'PEREZ', '', '', '', '', '', '', '', '', 'SEOARA UNA BOTA DE TACO COLOR NEGRA\nVALOR 49,00 USD', 288);
INSERT INTO `phppos_people` VALUES ('MARCELO ', 'AREQUIPA', '', '', '', 'COMITE DEL PUBLO', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA PARA NEGOCIO POR DOCENAS', 289);
INSERT INTO `phppos_people` VALUES ('MARCELO ', 'AREQUIPA', '', '', '', 'COMITE DEL PUBLO', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA PARA NEGOCIO POR DOCENAS', 290);
INSERT INTO `phppos_people` VALUES ('MARCELO ', 'AREQUIPA', '', '', '', 'COMITE DEL PUBLO', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA PARA NEGOCIO POR DOCENAS', 291);
INSERT INTO `phppos_people` VALUES ('RODIGO', 'UGSHA', '3102310-085306932', '', 'CATAMAYO OE146 Y PANSALA', 'MAGDALENA', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA POR DOCENAS HERMANO MIGUE ANTIGUO IPIALES ', 292);
INSERT INTO `phppos_people` VALUES ('Rosita Lissette', 'Saltos Vargas', '2595252', 'rositasaltos@hotmail.com', 'La  Prensa', '', 'Quito', 'Pichincha', '', 'Ecuador', 'Tiene acceso a todos los iconos', 294);
INSERT INTO `phppos_people` VALUES ('DANIELA', 'PAZ', '', '', '', '', '', '', '', '', 'SEPARA PARA SEGUIR HACIENDO ABONOS', 295);
INSERT INTO `phppos_people` VALUES ('MARIA CRISTINA', 'SALDAS', '', '', '', '', '', '', '', '', 'SEPARA UNA BOTA PARA SEGUI ASIENDO ABONOS', 296);
INSERT INTO `phppos_people` VALUES ('DIANO', 'DIONICIO', '', '', '', '', '', '', '', '', 'SEPARA UNA BOTA PARA SGUIR ABONANDO', 297);
INSERT INTO `phppos_people` VALUES ('Don', 'Gu', '', 'xxx@hotmail.com', '', '', 'Puyo', 'Pastaza', '1818181818', 'Ecuador', '', 298);
INSERT INTO `phppos_people` VALUES ('jaime', 'santana', '', '', '', '', '', '', '160039239', '', '', 1085);
INSERT INTO `phppos_people` VALUES ('MARIA', 'DE  DORIS', '', '', '', '', '', '', '', '', '', 299);
INSERT INTO `phppos_people` VALUES ('JUNIOR', 'GUILLEN', '', '', '', '', '', '', '', '', '', 300);
INSERT INTO `phppos_people` VALUES ('SANDRA', 'GUEVARA', '2354563', '', '', '', '', '', '170897963', '', '', 301);
INSERT INTO `phppos_people` VALUES ('JEFFERSON', 'PALLO', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'ya no trabaja', 302);
INSERT INTO `phppos_people` VALUES ('MARIANA ', 'CERON', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 303);
INSERT INTO `phppos_people` VALUES ('SANDRA', 'BENAVIDEZ', '3385640', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 304);
INSERT INTO `phppos_people` VALUES ('ALVA ', 'COTACACHI', '', '', '', '', '', '', '', '', '', 305);
INSERT INTO `phppos_people` VALUES ('NANCY', 'ANDRAGO', '0825972', '', 'CALDERON', '', 'QUITO', 'Pichincha', '1711338457', 'ECUADOR', '', 306);
INSERT INTO `phppos_people` VALUES ('Victoria', 'Saltos', '083793361', 'viky_yady@hotmail.com', '', '', 'Quito', 'Pichincha', '1723307383', 'Ecuador', '', 307);
INSERT INTO `phppos_people` VALUES ('PAUBLINA', 'DAVILA', '', '', '', '', '', '', '1711868917001', '', '', 308);
INSERT INTO `phppos_people` VALUES ('CESAR', 'VERA', '2852855', 'INCALSID@SEEDY.NET.EC', 'AQUILEMA E ISIDRO AYORA', '', 'AMBATO', 'TUNGURAHUA', '1891734715', 'ECUADOR', 'BOTA MUJER', 309);
INSERT INTO `phppos_people` VALUES ('CESAR', 'VERA', '2852855', 'INCALSID@SEEDY.NET.EC', 'AQUILEMA E ISIDRO AYORA', '', 'AMBATO', 'TUNGURAHUA', '1891734715', 'ECUADOR', 'BOTA MUJER', 310);
INSERT INTO `phppos_people` VALUES ('JANETH', 'ESPIN', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 311);
INSERT INTO `phppos_people` VALUES ('MARTHA', 'COLOMBIANA', '', '', '', '', '', '', '', '', '', 312);
INSERT INTO `phppos_people` VALUES ('WILSON ', 'CARRILLO', '', '', '', '', '', '', '', '', '', 313);
INSERT INTO `phppos_people` VALUES ('WILSON', 'CARRILLO', '', '', '', '', '', '', ' ', '', '', 314);
INSERT INTO `phppos_people` VALUES ('SANDRA ', 'MINA', '', '', '', '', '', '', '', '', 'SEPARA BOTA ALPINA NEGRA 37', 315);
INSERT INTO `phppos_people` VALUES ('FACTURA', 'IVA', '', '', '', '', '', '', '', '', '', 316);
INSERT INTO `phppos_people` VALUES ('JUAN MANUEL', 'MEJIA CASTILLO', '046016951', '', 'SAUCES 2 SOLAR 6 MZ.72 F', '', 'GUAYAQUIL', 'GUAYAS', '0930415278001', 'ECUADOR', 'DEPORTIVO AXION\n', 317);
INSERT INTO `phppos_people` VALUES ('ANGEL', 'REINA', '', '', '', '', '', '', '', '', 'CLIENTE OR MENOR\n', 318);
INSERT INTO `phppos_people` VALUES ('ELIZABETH', 'SALTOS', '093709960', 'lubrillantas_sc@hotmail.com', '', '', 'Quito', 'Pichincha', '1803753753', 'Ecuador', 'YA NO TRABAJA  EN LA EMPRESA', 319);
INSERT INTO `phppos_people` VALUES ('JORGE', 'GARCES', '095551224', '', '', '', 'GUAYAQUIL', 'GUAYAS', '', 'ECUADOR', '', 320);
INSERT INTO `phppos_people` VALUES ('ALFREDO', 'ALFREDO', '', '', '', '', '', '', '', '', '', 321);
INSERT INTO `phppos_people` VALUES ('DORIS', 'DORIS', '', '', '', '', '', '', '', '', '', 322);
INSERT INTO `phppos_people` VALUES ('MARIA', 'DORIS', '', '', '', '', '', '', '', '', '', 323);
INSERT INTO `phppos_people` VALUES ('SEBASTIAN', 'ACURIO', '', '', 'SAN CARLOS', '', 'QYUITO', 'Pichincha', '171746617', 'Ecuador', 'VENTA POR PARES', 324);
INSERT INTO `phppos_people` VALUES ('ROSA AMADA ', 'VARGAS ULLOA', '', '', '', '', '', '', '', '', 'AL COSTO', 325);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'PERUGACHI', '', '', '', 'FRANCISCO DE RUMIORCO', 'Quito', 'Pichincha', '1707954275', 'Ecuador', 'VENTA AL POR MENOR', 326);
INSERT INTO `phppos_people` VALUES ('Fernando ', 'Osorio', '5107896', '', '', '', 'Quito', 'Pichincha', '1708531189', 'Ecuador', '', 327);
INSERT INTO `phppos_people` VALUES ('MARY', 'MORALES', '', '', '', '', '', '', '', '', 'SEPARADO', 328);
INSERT INTO `phppos_people` VALUES ('MARYURY', 'SANCHEZ', '', '', '', '', '', '', '', '', '', 329);
INSERT INTO `phppos_people` VALUES ('ELIZABETH', 'SALTOS', '', '', '', '', '', '', '', '', '', 330);
INSERT INTO `phppos_people` VALUES ('Mercedes', 'Sandobal', '', '', '', 'Tumbaco', 'Quito', 'Pichincha', '', 'Ecuador', '', 331);
INSERT INTO `phppos_people` VALUES ('GLADYS ', 'ARCOS', '', '', '', '', '', '', '', '', '', 332);
INSERT INTO `phppos_people` VALUES ('JUAN', 'CASTA?EDA', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 333);
INSERT INTO `phppos_people` VALUES ('PIEDAD', 'MONTALVO', '2302676', '', 'SAN JOSE DE MINAS', '', 'MINAS', 'Pichincha', '1706499371001', 'Ecuador', 'VENTA AL POR MAYOR', 334);
INSERT INTO `phppos_people` VALUES ('MARIBEL', 'BRAVO', '', '', 'RUMICHACA', 'EL COMERCIO', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 335);
INSERT INTO `phppos_people` VALUES ('EXDRAG S.A', 'EXDRAG S.A', '2514476', '', 'VILLAMIL 117 Y CALDERON ', 'EDIF. EL DORADO', 'GUAYAQUIL', 'GUAYAS', '0992465999001', 'ECUADOR', 'ZAPATILLA RANCO', 336);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'ALMACHE', '', '', '', '', '', '', '', '', '', 337);
INSERT INTO `phppos_people` VALUES ('NANCY', 'ANDRANGO', '', '', '', '', '', '', '', '', '', 338);
INSERT INTO `phppos_people` VALUES ('CARMEN', 'VAZQUEZ', '', '', '', '', 'IBARRA', '', '', '', '', 339);
INSERT INTO `phppos_people` VALUES ('LUIS GONZALO', 'BAUTISTA M', '0989989733-0959446017', '', 'LA GARCIA MISENA 411 Y ROCA', '', 'QUITO', 'Pichincha', '', 'Ecuador', '', 340);
INSERT INTO `phppos_people` VALUES ('TEREZA', 'GORDON', '', '', '', '', '', '', '', '', '', 341);
INSERT INTO `phppos_people` VALUES ('MAGDALENA ', 'COLLAGUAZO', '', '', '', '', '', '', '', '', '', 342);
INSERT INTO `phppos_people` VALUES ('MARISOL ', 'CRIOLLO', '', '', 'VIA AMAGU?A', '', 'Quito', 'Pichincha', '', 'Ecuador', 'VENTA AL POR MAYOR', 343);
INSERT INTO `phppos_people` VALUES ('HUMBERTO ', 'GUATINANGO', '0992241071', '', 'VELLAVISTA Y REAL AUDIENCIA', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'CLIENTE PARES', 344);
INSERT INTO `phppos_people` VALUES ('GONZALO', 'GONZALO', '', '', '', '', '', '', '', '', '', 345);
INSERT INTO `phppos_people` VALUES ('JAVIER', 'SANCHEZ', '', '', '', '', '', '', '', '', '', 346);
INSERT INTO `phppos_people` VALUES ('JAVIER', 'SANCHEZ', '', '', '', '', '', '', '', '', '', 347);
INSERT INTO `phppos_people` VALUES ('RICARDO', 'ROMO', '', '', '', '', '', '', '', '', '', 348);
INSERT INTO `phppos_people` VALUES ('JORGE', 'FLORES', '', '', '', '', '', '', '', '', '', 349);
INSERT INTO `phppos_people` VALUES ('FALLAS', 'FALLAS', '', '', '', '', '', '', '', '', '', 350);
INSERT INTO `phppos_people` VALUES ('FAVIO', 'ANDINO', '', '', '', '', '', '', '', '', '', 351);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'ALARCON', '', '', '', '', '', '', '', '', '', 352);
INSERT INTO `phppos_people` VALUES ('ANGEL', 'PILLAJO', '', '', '', '', '', '', '', '', '', 353);
INSERT INTO `phppos_people` VALUES ('SAILA', 'SUAREZ', '', '', '', '', '', '', '', '', '', 354);
INSERT INTO `phppos_people` VALUES ('JENNY', 'PILATAXI', '', '', '', '', '', '', '', '', '', 355);
INSERT INTO `phppos_people` VALUES ('MARLENE', 'ARIAS', '', '', '', '', '', '', '', '', '', 356);
INSERT INTO `phppos_people` VALUES ('MARIA', 'ZAMBRANO', '', '', '', '', '', '', '', '', '', 357);
INSERT INTO `phppos_people` VALUES ('LIGIA', 'GUERRERO', '3430506', '', 'PUSUQUI', '', '', '', '', '', '', 358);
INSERT INTO `phppos_people` VALUES ('WALTER', 'YANES', '', '', '', '', '', '', '', '', '', 359);
INSERT INTO `phppos_people` VALUES ('FLAVIO', 'REYES', '2597440', '', 'COTOCOLLAO', '', 'QUITO', 'PICHINCHA', '1715022024001', 'ECUADOR', 'POR MAYOR', 360);
INSERT INTO `phppos_people` VALUES ('PAPA', 'SAUL', '', '', '', '', '', '', '', '', '', 361);
INSERT INTO `phppos_people` VALUES ('MARLENE', 'BORJA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 362);
INSERT INTO `phppos_people` VALUES ('RAFAEL', 'RAFAEL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 363);
INSERT INTO `phppos_people` VALUES ('MARCELO ', 'DAVILA', '', '', '', '', '', '', '', '', '', 364);
INSERT INTO `phppos_people` VALUES ('DIANA ', 'RIVERA', '', '', '', '', 'CEVALLOS', 'TUNGUARHUA', '', 'ECUADOR', 'DISTRIBUIDOR BOTAS SINTETICA', 365);
INSERT INTO `phppos_people` VALUES ('JOSE', 'GUANINGA', '', '', '', '', '', '', '1719758755', '', '', 366);
INSERT INTO `phppos_people` VALUES ('FABRICIO ', 'CRUZ', '', '', '', '', '', '', '', '', '', 367);
INSERT INTO `phppos_people` VALUES ('BLANCA ', 'VERONES', '', '', '', '', '', '', '', '', '', 368);
INSERT INTO `phppos_people` VALUES ('FERNANDA JANET', 'MENDIETA BARBERAN', '0982526274', 'yumin_love@hotmail.es', 'CONJUNTO  LOYOLA', 'BOQUE 14 DEP. 44', 'Quito', 'Pichincha', '0503126294', 'Ecuador', 'EMPLEADA YA NO TRABAJA EN LA EMPRESA', 369);
INSERT INTO `phppos_people` VALUES ('LUIS VENALCAZAR', 'VENALCAZAR', '', '', '', '', '', '', '1710446624', '', '', 370);
INSERT INTO `phppos_people` VALUES ('LUIS', 'VENALCAZAR', '0987340148', '', 'SAN JOSE DE JARDIN', '', 'Quito', 'Pichincha', '1710446624', 'Ecuador', '', 371);
INSERT INTO `phppos_people` VALUES ('MARY ', 'GUDI?O', '', '', '', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 372);
INSERT INTO `phppos_people` VALUES ('MILTON', 'VALAREZO', '0966722774', '', 'CHONE', '', 'Quito', 'Pichincha', '', 'Ecuador', '', 373);
INSERT INTO `phppos_people` VALUES ('CECILIA', 'VASQUEZ', '022598099', '', 'COTOCOLLAO', '', 'QUITO', 'PICHINCHA', '1001298106', 'ECUADIR', '', 374);
INSERT INTO `phppos_people` VALUES ('CECILIA', 'VASQUEZ', '022598099', '', 'COTOCOLLAO', '', 'QUITO', 'PICHINCHA', '1001298106', 'ECUADOR', '', 375);
INSERT INTO `phppos_people` VALUES ('BLANCA', 'CALDERON', '', '', '', '', '', '', '', '', '', 376);
INSERT INTO `phppos_people` VALUES ('MARLENE ', 'ARIAS', '', '', '', '', '', '', '', '', '', 377);
INSERT INTO `phppos_people` VALUES ('LUIS', 'ANIBAL', '', '', '', '', '', '', '', '', '', 378);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'MORA', '', '', '', '', '', '', '', '', '', 379);
INSERT INTO `phppos_people` VALUES ('STALIN', 'VELA', '', '', '', 'LA PLANADA', 'Quito', 'Pichincha', '', 'Ecuador', 'PARA NEGOCIO', 380);
INSERT INTO `phppos_people` VALUES ('MARIANA ', 'ORTIZ', '', '', 'CCMNA', 'MALDONADO', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'SE COMPRA CON CHEQUES', 381);
INSERT INTO `phppos_people` VALUES ('JOSE', 'GURANDA', '', '', '', '', '', '', '', '', '', 382);
INSERT INTO `phppos_people` VALUES ('DOLORES ', 'ZAMBRANO', '', '', '', '', '', '', '', '', '', 383);
INSERT INTO `phppos_people` VALUES ('NORMA', 'EGAS', '', '', '', '', 'Quito', 'PICHINCHA', '', 'ECUADOR', 'SUURSAL MAJO 1 JUEVES18/05/2013 FACTURA 916', 384);
INSERT INTO `phppos_people` VALUES ('PABLO', 'RIBERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO#1       JUEVES 18/05/2013 NOTA DE PADIDO 915', 385);
INSERT INTO `phppos_people` VALUES ('SONIA ', 'SALCEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA  MAJO #1', 386);
INSERT INTO `phppos_people` VALUES ('DIANA ', 'BONILLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO #1', 387);
INSERT INTO `phppos_people` VALUES ('DIANA ', 'VARGAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO#1\n', 388);
INSERT INTO `phppos_people` VALUES ('DIANA ', 'CABRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADIR', 'DISTRIBUIDORA MAJOS#1', 389);
INSERT INTO `phppos_people` VALUES ('CRISTIAM ', 'SUAREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO#1', 390);
INSERT INTO `phppos_people` VALUES ('CRISTIAM ', 'SUAREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO#1', 391);
INSERT INTO `phppos_people` VALUES ('SANTIAGO', 'PONCE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO #1\n', 392);
INSERT INTO `phppos_people` VALUES ('SANTIAGO', 'PONCE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO #1\n', 393);
INSERT INTO `phppos_people` VALUES ('JHONN', 'MORA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJOS #1', 394);
INSERT INTO `phppos_people` VALUES ('SALINA ', 'MALDONADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO #1', 395);
INSERT INTO `phppos_people` VALUES ('GRACIELA ', 'QUISPE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO # 1', 396);
INSERT INTO `phppos_people` VALUES ('ALICIA ', 'GALLEGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJOS #1\n', 397);
INSERT INTO `phppos_people` VALUES ('CARLOS ', 'HATIVA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'DISTRIBUIDORA MAJO #1', 398);
INSERT INTO `phppos_people` VALUES ('FERNANDA JANET', 'MENDIETA BARBERAN', '', 'yumin_love@hotmail.es', '', '', 'QUITO', 'PICHINCHA', '0503126294', 'ECUADOR', '', 399);
INSERT INTO `phppos_people` VALUES ('MARIA', 'MALLA ', '', '', '', '', '', '', '', '', '', 400);
INSERT INTO `phppos_people` VALUES ('MARIA', 'MALLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 401);
INSERT INTO `phppos_people` VALUES ('NANCY', 'ANDRADE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 402);
INSERT INTO `phppos_people` VALUES ('PATRICIO ', 'CUAMA?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 403);
INSERT INTO `phppos_people` VALUES ('EDSON', 'ORELLANA', '', '', '', '', 'AMBATO', 'TUNGURAHUA', '', 'ECUADOR', 'SE PAGA CON CHEUQES POSFECHADOS', 404);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'MAGIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 405);
INSERT INTO `phppos_people` VALUES ('MERCEDES', 'MARMOL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 406);
INSERT INTO `phppos_people` VALUES ('MAGDALENA ', 'COLLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 407);
INSERT INTO `phppos_people` VALUES ('NATHALY ', 'SHUGULY', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 408);
INSERT INTO `phppos_people` VALUES ('PEDRO ', 'MERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 409);
INSERT INTO `phppos_people` VALUES ('SOFIA ', 'MOLINA', '', '', '', '', '', '', '', '', '', 410);
INSERT INTO `phppos_people` VALUES ('SOFIA ', 'MOLINA', '', '', '', '', '', '', '', '', '', 411);
INSERT INTO `phppos_people` VALUES ('SOFIA ', 'MOLINA', '', '', '', '', '', '', '', '', '', 412);
INSERT INTO `phppos_people` VALUES ('SOFIA ', 'MOLINA', '', '', '', '', '', '', '', '', '', 413);
INSERT INTO `phppos_people` VALUES ('SOFIA ', 'MOLINA', '', '', '', '', '', '', '', '', '', 414);
INSERT INTO `phppos_people` VALUES ('RAMON', 'GARCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 415);
INSERT INTO `phppos_people` VALUES ('MONICA', 'MIRANDA', '', '', '', '', '', '', '', '', '', 416);
INSERT INTO `phppos_people` VALUES ('ALEJANDRO', 'YAGUALE', '', '', '', '', '', '', '', '', '', 417);
INSERT INTO `phppos_people` VALUES ('FRANCISCO', 'SARAZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 418);
INSERT INTO `phppos_people` VALUES ('CARMEN ', 'O?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 419);
INSERT INTO `phppos_people` VALUES ('LUCIA', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 420);
INSERT INTO `phppos_people` VALUES ('MILENA', 'HENAO', '', '', '', '', '', '', '', '', '', 421);
INSERT INTO `phppos_people` VALUES ('TANIA ', 'SANTILLANA', '', '', '', '', '', '', '', '', '', 422);
INSERT INTO `phppos_people` VALUES ('ADELA', 'SANTILLANA', '', '', '', '', '', '', '', '', '', 423);
INSERT INTO `phppos_people` VALUES ('PRICILA ', 'SANTANA', '', '', '', '', '', '', '', '', '', 424);
INSERT INTO `phppos_people` VALUES ('RAQUEL', 'BOLA?OS', '', '', '', '', '', '', '', '', '', 425);
INSERT INTO `phppos_people` VALUES ('ROSA', 'VARGAS', '09995124343', 'rosa.amada69@hotmail.com', '', '', '', '', '1802268654001', '', '', 426);
INSERT INTO `phppos_people` VALUES ('ALICIA', 'DOMINGUEZ', '', '', '', '', '', '', '', '', '', 427);
INSERT INTO `phppos_people` VALUES ('REINDER ', 'FLEXISOF', '042647524', '', 'VI JUAN TAMARENGO', '', 'GUAYAQUIL', 'GUAYAS', '0992634138001', 'ECUADOR', 'MERCADERIA COLOMBIANA', 428);
INSERT INTO `phppos_people` VALUES ('FRANCIA', ' BRASIL', '3340824', '', 'MONTESERRIN', '', 'QUITO', 'PICHINCHA', '1791714814001', 'ECUADOR', 'ZAPATO BRASILERO', 429);
INSERT INTO `phppos_people` VALUES ('VENTA ', 'FACTURA', '', '', '', '', '', '', '', '', '', 430);
INSERT INTO `phppos_people` VALUES ('FS', 'SF', '', '', '', '', '', '', '', '', '', 431);
INSERT INTO `phppos_people` VALUES ('MONICA', 'SUAREZ MEZA', '0959757762', 'monykasuarez@hotmail.com', 'PONCIANO BAJO', '', 'QUITO', 'PICHINCHA', '1314565548', 'ECUADOR', 'ya no trabaja en la empresa', 432);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'CHAVARRIA', '', '', '', '', '', '', '', '', '', 433);
INSERT INTO `phppos_people` VALUES ('MONICA', 'SUAREZ MEZA', '', '', '', '', '', '', '', '', '', 434);
INSERT INTO `phppos_people` VALUES ('GRACE', 'ANDRADE', '', '', '', '', '', '', '', '', '', 435);
INSERT INTO `phppos_people` VALUES ('JESUS', 'DE LA CRUZ', '', '', '', '', '', '', '', '', '', 436);
INSERT INTO `phppos_people` VALUES ('RAMIRO', 'ARCO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'SE VENDE CON TARJETA DE CREDITO', 437);
INSERT INTO `phppos_people` VALUES ('MONICA', 'VALLEJO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 438);
INSERT INTO `phppos_people` VALUES ('MARIA', 'LOPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 439);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'PEREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 440);
INSERT INTO `phppos_people` VALUES ('FANNY', 'MOYA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 441);
INSERT INTO `phppos_people` VALUES ('EDUARDO ', 'AYALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 442);
INSERT INTO `phppos_people` VALUES ('DANIELA ', 'MONAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 443);
INSERT INTO `phppos_people` VALUES ('DAYSI ', 'TUQUERZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 444);
INSERT INTO `phppos_people` VALUES ('FRANCISCO ', 'TIIENRO', '', '', '', '', '', '', '', '', '', 445);
INSERT INTO `phppos_people` VALUES ('JESSICA', 'DE LA CRUZ', '', '', '', '', '', '', '', '', '', 446);
INSERT INTO `phppos_people` VALUES ('JAVIER ', 'QUISHPE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 447);
INSERT INTO `phppos_people` VALUES ('DARIO', 'CUEVA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 448);
INSERT INTO `phppos_people` VALUES ('ANDRES', 'MEZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 449);
INSERT INTO `phppos_people` VALUES ('FANNY', 'DELGADO', '', '', '', '', '', '', '', '', '', 450);
INSERT INTO `phppos_people` VALUES ('CARLOS ', 'CALBOPI?A', '', '', '', '', '', '', '', '', '', 451);
INSERT INTO `phppos_people` VALUES ('NICOLAS ', 'HERAS ', '', '', '', '', '', '', '', '', '', 452);
INSERT INTO `phppos_people` VALUES ('FERNENDO ', 'VASAVEZ', '', '', '', '', '', '', '', '', '', 453);
INSERT INTO `phppos_people` VALUES ('GUSTAVO ', 'TAMAYO ', '', '', '', '', '', '', '', '', '', 454);
INSERT INTO `phppos_people` VALUES ('KLEVER ', 'PAREDES ', '', '', '', '', '', '', '', '', '', 455);
INSERT INTO `phppos_people` VALUES ('DIVIANA ', 'RUEDA', '', '', '', '', '', '', '', '', '', 456);
INSERT INTO `phppos_people` VALUES ('MAURICIO ', 'CALAHORANO ', '', '', '', '', '', '', '', '', '', 457);
INSERT INTO `phppos_people` VALUES ('GUSTAVO', 'RUGUEL', '', '', '', '', '', '', '', '', '', 458);
INSERT INTO `phppos_people` VALUES ('PABLO', 'LAINES', '', '', '', '', '', '', '', '', '', 459);
INSERT INTO `phppos_people` VALUES ('ROMEL', 'RAMOS', '', '', '', '', '', '', '', '', '', 460);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'DE ROJA', '', '', '', '', '', '', '', '', '', 461);
INSERT INTO `phppos_people` VALUES ('WASHINGTON', 'MORALES', '', '', '', '', '', '', '', '', '', 462);
INSERT INTO `phppos_people` VALUES ('HERLITIDA', 'IDALGO', '', '', '', '', '', '', '', '', '', 463);
INSERT INTO `phppos_people` VALUES ('EVA', 'AMAGUAYA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 464);
INSERT INTO `phppos_people` VALUES ('AVA', 'AMAGUAYA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 465);
INSERT INTO `phppos_people` VALUES ('AVA', 'AMAGUAYA', '', '', '', '', '', '', '', '', '', 466);
INSERT INTO `phppos_people` VALUES ('MANUEL', 'MANZABA', '', '', '', '', '', '', '', '', '', 467);
INSERT INTO `phppos_people` VALUES ('LUIS ', 'TIBAN', '', '', '', '', '', '', '', '', '', 468);
INSERT INTO `phppos_people` VALUES ('ALEXANDRA ', 'ACUNA', '', '', '', '', '', '', '', '', '', 469);
INSERT INTO `phppos_people` VALUES ('nelly', 'pacuchaqui', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 470);
INSERT INTO `phppos_people` VALUES ('FRANCISCO ', 'URQUISA', '0999105840', '', 'OLMADO Y JUAN MONTALVO', '', 'MACHALA', 'EL ORO', '0791756936001', 'ECUADOR', 'DISTRIBUYE CALZADO DEPORTIVO', 471);
INSERT INTO `phppos_people` VALUES ('FERNANDO ', 'PADILLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 472);
INSERT INTO `phppos_people` VALUES ('SUSANA ', 'JARAMILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 473);
INSERT INTO `phppos_people` VALUES ('MARLENNE', 'CAIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 474);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'ULLAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 475);
INSERT INTO `phppos_people` VALUES ('JENNY', 'REAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 476);
INSERT INTO `phppos_people` VALUES ('JOEL ', 'ALARCON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 477);
INSERT INTO `phppos_people` VALUES ('ANGEL ', 'MALACATUS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 478);
INSERT INTO `phppos_people` VALUES ('MARCO', 'GALARREGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 479);
INSERT INTO `phppos_people` VALUES ('ANGEL', 'LOPEZ', '032844027', '', 'HUACHI', 'JUAN CAJAS', 'AMBATO', 'TUNGURAHUA', '', 'ECUADOR', 'SE CANCELA LA MERCADERIA CON CHEUES', 480);
INSERT INTO `phppos_people` VALUES ('ZAIDA ', 'MALDONADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 481);
INSERT INTO `phppos_people` VALUES ('CONSINE', 'GANAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 482);
INSERT INTO `phppos_people` VALUES ('MARTHA ', 'CRIOLLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 483);
INSERT INTO `phppos_people` VALUES ('HILDA', 'SANTANA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 484);
INSERT INTO `phppos_people` VALUES ('FERNANDO ', 'ENCALADA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 485);
INSERT INTO `phppos_people` VALUES ('ANGEL', 'PINOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 486);
INSERT INTO `phppos_people` VALUES ('GREGORIA ', 'MOREIRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 487);
INSERT INTO `phppos_people` VALUES ('MARLENNE ', 'ALVAREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 488);
INSERT INTO `phppos_people` VALUES ('ALICIA', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 489);
INSERT INTO `phppos_people` VALUES ('JORGE ', 'HUACA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'COMPRA AL POR MAYOR POR PARES', 490);
INSERT INTO `phppos_people` VALUES ('JAIME', 'NARVAEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 491);
INSERT INTO `phppos_people` VALUES ('JOSE', 'SANTIANA', '', '', '', 'CABLEC', 'QUITO', 'PICHINCHA', '', 'ECUADOR', 'VENTA AL POR MAYOR', 492);
INSERT INTO `phppos_people` VALUES ('DAYSI ', 'CABRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 493);
INSERT INTO `phppos_people` VALUES ('DAYSI ', 'CABRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 494);
INSERT INTO `phppos_people` VALUES ('RAFAEL', 'COLLAGUASO', '', '', '', '', '', '', '', '', '', 495);
INSERT INTO `phppos_people` VALUES ('JANET', 'ALARCON', '', '', '', '', '', '', '', '', '', 496);
INSERT INTO `phppos_people` VALUES ('NATHALIA', 'GUEVARA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 497);
INSERT INTO `phppos_people` VALUES ('LUIS', 'CASTRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 498);
INSERT INTO `phppos_people` VALUES ('CRISTINA ', 'GARZON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 499);
INSERT INTO `phppos_people` VALUES ('PAULINA ', 'MORALES', '0999204917', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 500);
INSERT INTO `phppos_people` VALUES ('LUIS', 'VARELA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 501);
INSERT INTO `phppos_people` VALUES ('ELSA ', 'DE CUEVA ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 502);
INSERT INTO `phppos_people` VALUES ('ELSA ', 'DE CUEVA ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 503);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'MORA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 504);
INSERT INTO `phppos_people` VALUES ('FERNANDA ', 'ARMIJOS ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 505);
INSERT INTO `phppos_people` VALUES ('LOLA', 'SOMBA?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 506);
INSERT INTO `phppos_people` VALUES ('STALIN ', 'ZAMBRANO ', '0992254785', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 507);
INSERT INTO `phppos_people` VALUES ('STALIN ', 'ZAMBRANO ', '0992254785', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 508);
INSERT INTO `phppos_people` VALUES ('STALIN ', 'ZAMBRANO ', '0992254785', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 509);
INSERT INTO `phppos_people` VALUES ('BYRON ', 'ZAMBRANO ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 510);
INSERT INTO `phppos_people` VALUES ('BYRON ', 'ZAMBRANO ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 511);
INSERT INTO `phppos_people` VALUES ('PAUL ', 'AREVALO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 512);
INSERT INTO `phppos_people` VALUES ('RODRIGO ', 'ANDRADE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 513);
INSERT INTO `phppos_people` VALUES ('EDGAR ', 'ENRRIQUES ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 514);
INSERT INTO `phppos_people` VALUES ('LAURA', 'GORDON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 515);
INSERT INTO `phppos_people` VALUES ('GUILLERMO ', 'REAZCO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 516);
INSERT INTO `phppos_people` VALUES ('MARIA', 'CUESTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 517);
INSERT INTO `phppos_people` VALUES ('LUIS ', 'MINDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 518);
INSERT INTO `phppos_people` VALUES ('CECILIA ', 'ORMA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 519);
INSERT INTO `phppos_people` VALUES ('SANTIAGO ', 'PUGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 520);
INSERT INTO `phppos_people` VALUES ('JUAN CARLOS ', 'INAPANTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 521);
INSERT INTO `phppos_people` VALUES ('JOSE', 'MOSACHE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'E', '', 522);
INSERT INTO `phppos_people` VALUES ('LILIANA ', 'ESPINOZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 523);
INSERT INTO `phppos_people` VALUES ('CAMILO', 'BALLEJO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 524);
INSERT INTO `phppos_people` VALUES ('JORGE ', 'FLORES ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 525);
INSERT INTO `phppos_people` VALUES ('GUILLERMO ', 'RAMO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 526);
INSERT INTO `phppos_people` VALUES ('Vendedor 1', 'Vendedor AA', '', 'x@gmail.com', '', '', 'Puyo', 'Pastaza', '1212121212', 'ECUADOR', 'VENDEDOR DonGu', 527);
INSERT INTO `phppos_people` VALUES ('CARMEN ', 'BONE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 528);
INSERT INTO `phppos_people` VALUES ('MIRIAN', 'UYAGUALI ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 529);
INSERT INTO `phppos_people` VALUES ('CINTIA', 'RONQUILLO', '04234018', '', 'ALBORADA QUINTA ETAPA', '', 'GUAYAQUIL', 'GUYAS', '0904160033', 'ECUADOR', 'SE COMPRA CON CHEQUES', 530);
INSERT INTO `phppos_people` VALUES ('JORGE', 'CEPEDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 531);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'TORRES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 532);
INSERT INTO `phppos_people` VALUES ('MARIA', 'JOSE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 533);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'BORJA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 534);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'CORNEJO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 535);
INSERT INTO `phppos_people` VALUES ('ROSA', 'ACEVEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 536);
INSERT INTO `phppos_people` VALUES ('ELENA ', 'VACA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 537);
INSERT INTO `phppos_people` VALUES ('CARMEN ', 'COLLAGUAZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 538);
INSERT INTO `phppos_people` VALUES ('RAUL GUSTAVO', 'MARTINEZ GUERRERO', '032872417', '', 'GONZALEZ SUARES', 'Y 13 DE MAYO', 'CEVALLOS', 'TUNGURAHUA', '1801752005001', 'ECUADOR', 'SE COMPRA CON CHEQUES', 539);
INSERT INTO `phppos_people` VALUES ('RAUL GUSTAVO', 'MARTINEZ GUERRERO', '032872417', '', 'GONZALEZ SUARES', 'Y 13 DE MAYO', 'CEVALLOS', 'TUNGURAHUA', '1801752005001', 'ECUADOR', 'SE COMPRA CON CHEQUES', 540);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'PUENTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 541);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'TIBANLOMBO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 542);
INSERT INTO `phppos_people` VALUES ('MONICA', 'VITERI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 543);
INSERT INTO `phppos_people` VALUES ('FLOR', 'CAICEDO', '', '', '', '', '', '', '', '', '', 544);
INSERT INTO `phppos_people` VALUES ('MARISOL', 'PUERTA', '', '', '', '', '', '', '', '', '', 545);
INSERT INTO `phppos_people` VALUES ('HUGO ', 'ORTIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 546);
INSERT INTO `phppos_people` VALUES ('CRISTIAN', 'BASANTES', '', '', '', '', '', '', '', '', '', 547);
INSERT INTO `phppos_people` VALUES ('JAVIER', 'YANES', '', '', '', '', '', '', '', '', '', 548);
INSERT INTO `phppos_people` VALUES ('LORENA', 'VEGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 549);
INSERT INTO `phppos_people` VALUES ('EDISON ', 'JEMENEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 550);
INSERT INTO `phppos_people` VALUES ('IVAN ', 'GORDILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 551);
INSERT INTO `phppos_people` VALUES ('LILIANA', 'MAMARANDI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 552);
INSERT INTO `phppos_people` VALUES ('ROSA', 'MONTENEGRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 553);
INSERT INTO `phppos_people` VALUES ('BEATRIZ ', 'ARMIJOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 554);
INSERT INTO `phppos_people` VALUES ('RODRIGO ', 'LAVERDE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 555);
INSERT INTO `phppos_people` VALUES ('LUIS', 'CARDONA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 556);
INSERT INTO `phppos_people` VALUES ('YAQUELINE', 'MOREIRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 557);
INSERT INTO `phppos_people` VALUES ('GLORIA', 'TRONCOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 558);
INSERT INTO `phppos_people` VALUES ('JENNY', 'PAREDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 559);
INSERT INTO `phppos_people` VALUES ('VICTORIA ', 'BONILLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 560);
INSERT INTO `phppos_people` VALUES ('EULALIA', 'ROMO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 561);
INSERT INTO `phppos_people` VALUES ('LUCIA', 'SAMANIEGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 562);
INSERT INTO `phppos_people` VALUES ('EDUARDO ', 'MONTALVO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 563);
INSERT INTO `phppos_people` VALUES ('GERARDO ', 'HEREDIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 564);
INSERT INTO `phppos_people` VALUES ('MARLENE ', 'RUIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 565);
INSERT INTO `phppos_people` VALUES ('GLADYS ', 'GONZALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 566);
INSERT INTO `phppos_people` VALUES ('ESTUARDO ', 'CHANGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 567);
INSERT INTO `phppos_people` VALUES ('SOLEDAD ', 'ZU?IGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 568);
INSERT INTO `phppos_people` VALUES ('MARCELA ', 'MANCEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 569);
INSERT INTO `phppos_people` VALUES ('ANA ', 'MARTINEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 570);
INSERT INTO `phppos_people` VALUES ('LAURA', 'AREVALO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 571);
INSERT INTO `phppos_people` VALUES ('SANDRA ', 'TERAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 572);
INSERT INTO `phppos_people` VALUES ('MARIA', 'NASIMBA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 573);
INSERT INTO `phppos_people` VALUES ('PATRICIO ', 'VILLAMARIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 574);
INSERT INTO `phppos_people` VALUES ('MARIBEL', 'SOSA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 575);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'HUQUILLAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 576);
INSERT INTO `phppos_people` VALUES ('HECTOR ', 'DELGADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 577);
INSERT INTO `phppos_people` VALUES ('MIRIAM ', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 578);
INSERT INTO `phppos_people` VALUES ('VERONICA ', 'ROMO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 579);
INSERT INTO `phppos_people` VALUES ('CARMEN', 'FERNANDEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 580);
INSERT INTO `phppos_people` VALUES ('FRANKLIN', 'GARCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 581);
INSERT INTO `phppos_people` VALUES ('RAMIRO', 'CASTRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 582);
INSERT INTO `phppos_people` VALUES ('TAMARA', 'AYALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 583);
INSERT INTO `phppos_people` VALUES ('SAINT', 'FRANCION', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 584);
INSERT INTO `phppos_people` VALUES ('JORGE', 'MORALES', '', '', '', 'Q', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 585);
INSERT INTO `phppos_people` VALUES ('RENATA', 'CARDENAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 586);
INSERT INTO `phppos_people` VALUES ('LIVIA', 'CARDENAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 587);
INSERT INTO `phppos_people` VALUES ('PAOLA ', 'ZAMBRANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 588);
INSERT INTO `phppos_people` VALUES ('VICTORIA ', 'MIELES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 589);
INSERT INTO `phppos_people` VALUES ('WILLIAMS ', 'MEDINA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 590);
INSERT INTO `phppos_people` VALUES ('OLGA', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 591);
INSERT INTO `phppos_people` VALUES ('ESTELA', 'MALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 592);
INSERT INTO `phppos_people` VALUES ('RUTH', 'GAVILANES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 593);
INSERT INTO `phppos_people` VALUES ('JENNY', 'SALAZAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 594);
INSERT INTO `phppos_people` VALUES ('NARCISA', 'VALENCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 595);
INSERT INTO `phppos_people` VALUES ('MARCELO ', 'TOBAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 596);
INSERT INTO `phppos_people` VALUES ('JUAN ', 'PADILLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 597);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'JAUME', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 598);
INSERT INTO `phppos_people` VALUES ('WILSON', 'VILLOTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 599);
INSERT INTO `phppos_people` VALUES ('MARITZA ', 'FREIRE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 600);
INSERT INTO `phppos_people` VALUES ('ARACELY ', 'ROMERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 601);
INSERT INTO `phppos_people` VALUES ('MONICA', 'RAMIREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 602);
INSERT INTO `phppos_people` VALUES ('HENRRY', 'PE?AFIEL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 603);
INSERT INTO `phppos_people` VALUES ('MAYRA ', 'MONCAYO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 604);
INSERT INTO `phppos_people` VALUES ('FRANCISCO', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 605);
INSERT INTO `phppos_people` VALUES ('WILDER', 'GUARAMA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 606);
INSERT INTO `phppos_people` VALUES ('MANUEL ', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 607);
INSERT INTO `phppos_people` VALUES ('CARINA', 'PAREDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 608);
INSERT INTO `phppos_people` VALUES ('DAVID', 'HERDOIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 609);
INSERT INTO `phppos_people` VALUES ('RAMIRO ', 'FREIRE ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 610);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'CHALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 611);
INSERT INTO `phppos_people` VALUES ('JAIME', 'BAYAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 612);
INSERT INTO `phppos_people` VALUES ('VILMA', 'RAMON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 613);
INSERT INTO `phppos_people` VALUES ('DIEGO ', 'MONTENEGRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 614);
INSERT INTO `phppos_people` VALUES ('EDGAR ', 'CARDENAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 615);
INSERT INTO `phppos_people` VALUES ('FANNY', 'LARREA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 616);
INSERT INTO `phppos_people` VALUES ('MARCO', 'NOCCE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 617);
INSERT INTO `phppos_people` VALUES ('PABLO', 'ROSALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 618);
INSERT INTO `phppos_people` VALUES ('ROSA', 'CALVO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 619);
INSERT INTO `phppos_people` VALUES ('GUSTAVO', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 620);
INSERT INTO `phppos_people` VALUES ('DAYSI', 'LLUSCA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 621);
INSERT INTO `phppos_people` VALUES ('JAVIER', 'VITERI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 622);
INSERT INTO `phppos_people` VALUES ('PAULA', 'MADRU?ERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 623);
INSERT INTO `phppos_people` VALUES ('ANDREA ', 'MORA ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 624);
INSERT INTO `phppos_people` VALUES ('JAIME', 'CARDENAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 625);
INSERT INTO `phppos_people` VALUES ('CESAREO', 'GAVILANEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 626);
INSERT INTO `phppos_people` VALUES ('DANIELA ', 'TOAPANTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 627);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'MANOSALVAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 628);
INSERT INTO `phppos_people` VALUES ('FANNY', 'BAUSTISTO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 629);
INSERT INTO `phppos_people` VALUES ('ROSA', 'CAJAMARCA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 630);
INSERT INTO `phppos_people` VALUES ('TERESA', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 631);
INSERT INTO `phppos_people` VALUES ('VICENTE ', 'REO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 632);
INSERT INTO `phppos_people` VALUES ('ROLANDO', 'GUAMAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 633);
INSERT INTO `phppos_people` VALUES ('MARCO', 'QUEVEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 634);
INSERT INTO `phppos_people` VALUES ('DEYSI', 'GALLEGOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 635);
INSERT INTO `phppos_people` VALUES ('MARCELO', 'GRANIZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 636);
INSERT INTO `phppos_people` VALUES ('GEOVANNA', 'GUERRON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 637);
INSERT INTO `phppos_people` VALUES ('ROSA', 'LEICA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 638);
INSERT INTO `phppos_people` VALUES ('VIVIANA', 'ZURITA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 639);
INSERT INTO `phppos_people` VALUES ('ELIZABETH', 'ZEAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 640);
INSERT INTO `phppos_people` VALUES ('PABLO', 'CHANGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 641);
INSERT INTO `phppos_people` VALUES ('MARIA', 'VEGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 642);
INSERT INTO `phppos_people` VALUES ('PIGUAVE', 'RODRIGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 643);
INSERT INTO `phppos_people` VALUES ('RODRIGO', 'TOPON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 644);
INSERT INTO `phppos_people` VALUES ('PEDRO', 'YAUTIBUG', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 645);
INSERT INTO `phppos_people` VALUES ('FELIPE', 'MEJIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 646);
INSERT INTO `phppos_people` VALUES ('CONSUELO', 'GUANOLUISA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 647);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'BECERRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 648);
INSERT INTO `phppos_people` VALUES ('ALICIA', 'CUSHICAGUA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 649);
INSERT INTO `phppos_people` VALUES ('JUAN ', 'GUAMANALCA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 650);
INSERT INTO `phppos_people` VALUES ('FABIOLA', 'ARBOLEDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 651);
INSERT INTO `phppos_people` VALUES ('BERTHA', 'CARRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 652);
INSERT INTO `phppos_people` VALUES ('FERNANDO ', 'CARVAJAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 653);
INSERT INTO `phppos_people` VALUES ('MARISOL', 'RODRIGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 654);
INSERT INTO `phppos_people` VALUES ('JEFERSON', 'RAMOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 655);
INSERT INTO `phppos_people` VALUES ('EDISON', 'MASANCHE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 656);
INSERT INTO `phppos_people` VALUES ('ESTEFANIA', 'ANDRADE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 657);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'CANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 658);
INSERT INTO `phppos_people` VALUES ('ALBERTO', 'CARRILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 659);
INSERT INTO `phppos_people` VALUES ('NAVILA', 'PICO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 660);
INSERT INTO `phppos_people` VALUES ('ANDREA ', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 661);
INSERT INTO `phppos_people` VALUES ('FABIOLA', 'VILLAREAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 662);
INSERT INTO `phppos_people` VALUES ('JOSE', 'BENAVIDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 663);
INSERT INTO `phppos_people` VALUES ('MERY', 'CALE?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 664);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'TRONCOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 665);
INSERT INTO `phppos_people` VALUES ('MARCO ', 'CHANGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 666);
INSERT INTO `phppos_people` VALUES ('ROSA', 'DE LA CADENA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 667);
INSERT INTO `phppos_people` VALUES ('MONICA', 'GUAMAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 668);
INSERT INTO `phppos_people` VALUES ('ARMIDA', 'AVEROS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 669);
INSERT INTO `phppos_people` VALUES ('MAGOLA ', 'NAVARRETE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 670);
INSERT INTO `phppos_people` VALUES ('JAIRO', 'CARCELEN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 671);
INSERT INTO `phppos_people` VALUES ('RAFAEL', 'RAMIRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 672);
INSERT INTO `phppos_people` VALUES ('RAFAEL', 'RAMIRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 673);
INSERT INTO `phppos_people` VALUES ('FANNY', 'ANGULO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 674);
INSERT INTO `phppos_people` VALUES ('EVELYN', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 675);
INSERT INTO `phppos_people` VALUES ('CORINA', 'PAQUI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 676);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'CRIOLLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 677);
INSERT INTO `phppos_people` VALUES ('RENE', 'JIMENEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 678);
INSERT INTO `phppos_people` VALUES ('MARTHA', 'PAEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 679);
INSERT INTO `phppos_people` VALUES ('TANIA', 'SALAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 680);
INSERT INTO `phppos_people` VALUES ('MERCEDES', 'LOPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 681);
INSERT INTO `phppos_people` VALUES ('VIDAL', 'SALAVARRIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 682);
INSERT INTO `phppos_people` VALUES ('VICTORIA', 'CUASQUER', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 683);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'TUCANES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 684);
INSERT INTO `phppos_people` VALUES ('ALFREDO', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 685);
INSERT INTO `phppos_people` VALUES ('WILLIAMS', 'CEDE?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 686);
INSERT INTO `phppos_people` VALUES ('FAUSTO', 'LLORI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 687);
INSERT INTO `phppos_people` VALUES ('GEOVANY', 'OSORIO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 688);
INSERT INTO `phppos_people` VALUES ('CARMITA ', 'BENAVIDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 689);
INSERT INTO `phppos_people` VALUES ('ROBERTO', 'MORENO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 690);
INSERT INTO `phppos_people` VALUES ('LORENA', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 691);
INSERT INTO `phppos_people` VALUES ('KATHERINE', 'VANEGAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 692);
INSERT INTO `phppos_people` VALUES ('PLUTARCO', 'AGUILAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 693);
INSERT INTO `phppos_people` VALUES ('PATRICIA ', 'VILLALVA', '', '', '', '', '', '', '', '', '', 694);
INSERT INTO `phppos_people` VALUES ('STEFANY', 'CAIZA', '09995356910', '', '', '', '', '', '', '', '', 695);
INSERT INTO `phppos_people` VALUES ('MARIELA', 'CHILA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 696);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'ZAPATA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 697);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'VALAREZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 698);
INSERT INTO `phppos_people` VALUES ('ELVIA', 'VIVANCO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 699);
INSERT INTO `phppos_people` VALUES ('ALEXANDRA ', 'VILLEGAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 700);
INSERT INTO `phppos_people` VALUES ('INES', 'PINTO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 701);
INSERT INTO `phppos_people` VALUES ('GRACE', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 702);
INSERT INTO `phppos_people` VALUES ('LUIS ', 'MOSCOSO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 703);
INSERT INTO `phppos_people` VALUES ('ESPERANZA', 'CUSME', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 704);
INSERT INTO `phppos_people` VALUES ('KLEVER', 'CHAUCA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 705);
INSERT INTO `phppos_people` VALUES ('MONICA', 'SANDOVAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 706);
INSERT INTO `phppos_people` VALUES ('FABRICIO', 'MONTENEGRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 707);
INSERT INTO `phppos_people` VALUES ('PABLO', 'PILAQUINGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 708);
INSERT INTO `phppos_people` VALUES ('ANGELA', 'ARTEAGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 709);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 710);
INSERT INTO `phppos_people` VALUES ('JESSICA ', 'VELEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 711);
INSERT INTO `phppos_people` VALUES ('CRISTHIAN', 'ACONDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 712);
INSERT INTO `phppos_people` VALUES ('CRISTHIAN', 'GUACALLANTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 713);
INSERT INTO `phppos_people` VALUES ('LORENA', 'JARAMILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 714);
INSERT INTO `phppos_people` VALUES ('ADRIANA ', 'NU?EZ', '', '', '', '', '', '', '', '', '', 715);
INSERT INTO `phppos_people` VALUES ('FERNANDO', 'CHALPARIZAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 716);
INSERT INTO `phppos_people` VALUES ('DAYANNA ', 'BENITEZ', '', '', '', '', '', '', '', '', '', 717);
INSERT INTO `phppos_people` VALUES ('DAYANNA', 'BENITEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 718);
INSERT INTO `phppos_people` VALUES ('MARTHA', 'DIAZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 719);
INSERT INTO `phppos_people` VALUES ('GABRIELA', 'PONCE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 720);
INSERT INTO `phppos_people` VALUES ('JESSICA', 'MOSQUERA', '', '', '', '', '', '', '', '', '', 721);
INSERT INTO `phppos_people` VALUES ('JULIA', 'JIMENEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 722);
INSERT INTO `phppos_people` VALUES ('FERNANDA', 'HIPO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 723);
INSERT INTO `phppos_people` VALUES ('JULIO', 'RUALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 724);
INSERT INTO `phppos_people` VALUES ('MAYRA ', 'CADENA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 725);
INSERT INTO `phppos_people` VALUES ('EDWIN ', 'CULLUPAXI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 726);
INSERT INTO `phppos_people` VALUES ('MONICA', 'HARO', '', '', '', '', 'AMBATO', 'TUNGURAHUA', '', 'ECUADOR', '', 727);
INSERT INTO `phppos_people` VALUES ('ADRIANA', 'VARGAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 728);
INSERT INTO `phppos_people` VALUES ('DIANA', 'UBIDIA', '', '', '', '', '', '', '', '', '', 729);
INSERT INTO `phppos_people` VALUES ('MONICA', 'SALAZAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 730);
INSERT INTO `phppos_people` VALUES ('SEGUNDO', 'GRANDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 731);
INSERT INTO `phppos_people` VALUES ('DANIELA', 'RIVAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 732);
INSERT INTO `phppos_people` VALUES ('SONIA', 'VIDAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 733);
INSERT INTO `phppos_people` VALUES ('CRISTIAN', 'PUEBLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 734);
INSERT INTO `phppos_people` VALUES ('PRECILA', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 735);
INSERT INTO `phppos_people` VALUES ('FRANCISCO ', 'TORRES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 736);
INSERT INTO `phppos_people` VALUES ('GUIDO', 'RUEDAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 737);
INSERT INTO `phppos_people` VALUES ('CRISTOBAL', 'FRANCO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 738);
INSERT INTO `phppos_people` VALUES ('DIANA', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 739);
INSERT INTO `phppos_people` VALUES ('SOLEDAD', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 740);
INSERT INTO `phppos_people` VALUES ('OSWALDO', 'QUIMBIULCO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 741);
INSERT INTO `phppos_people` VALUES ('LUIS', 'GUANOLIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 742);
INSERT INTO `phppos_people` VALUES ('MAYRA ', 'CADENA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 743);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'ESPINOZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 744);
INSERT INTO `phppos_people` VALUES ('MARIA SOL', 'PUERTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 745);
INSERT INTO `phppos_people` VALUES ('MAYRA', 'BARROS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 746);
INSERT INTO `phppos_people` VALUES ('VICTOR', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 747);
INSERT INTO `phppos_people` VALUES ('LUIS', 'CABASCANGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 748);
INSERT INTO `phppos_people` VALUES ('JONATHAN', 'DOMINGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 749);
INSERT INTO `phppos_people` VALUES ('MARIA', 'GUALAPURO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 750);
INSERT INTO `phppos_people` VALUES ('ROSA', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 751);
INSERT INTO `phppos_people` VALUES ('SRA', 'NANCY', '', '', '', '', '', '', '', '', '', 752);
INSERT INTO `phppos_people` VALUES ('VALERIA', 'MATEUS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 753);
INSERT INTO `phppos_people` VALUES ('FANNY', 'PAUTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 754);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'MONTEVERDE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 755);
INSERT INTO `phppos_people` VALUES ('GLORIA', 'YUGCHA', '', '', '', '', 'AMBATO', 'TUNGURAHUA', '', 'ECUADOR', '', 756);
INSERT INTO `phppos_people` VALUES ('FERNANDO ', 'QUEZADA', '2421035', '', 'CALDERON', '', 'QUITO', 'PICHINCHA', '1714507751001', 'ECUADOR', '', 757);
INSERT INTO `phppos_people` VALUES ('MARCIA ', 'CHOEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 758);
INSERT INTO `phppos_people` VALUES ('CAROLINA ', 'QUE?OZAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 759);
INSERT INTO `phppos_people` VALUES ('ROSARIO', 'JIMENEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 760);
INSERT INTO `phppos_people` VALUES ('TANIA', 'CHICAIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 761);
INSERT INTO `phppos_people` VALUES ('LUIS', 'HARO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 762);
INSERT INTO `phppos_people` VALUES ('JAIME', 'CHAVEZ', '', '', '', '', '', '', '', '', '', 763);
INSERT INTO `phppos_people` VALUES ('stela ', 'rivadeneira', '', '', '', '', 'QUITO', 'PICHINCHA', '', '', '', 764);
INSERT INTO `phppos_people` VALUES ('MARCELA', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 765);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'TIGSE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 766);
INSERT INTO `phppos_people` VALUES ('RAQUEL', 'PALACIOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 767);
INSERT INTO `phppos_people` VALUES ('JOSE', 'TRONCOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 768);
INSERT INTO `phppos_people` VALUES ('EDISON', 'PANCHIS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 769);
INSERT INTO `phppos_people` VALUES ('MANUEL', 'CARLOSAMA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 770);
INSERT INTO `phppos_people` VALUES ('ROCIO', 'SUAREZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 771);
INSERT INTO `phppos_people` VALUES ('PABLO', 'SIMBA?EZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 772);
INSERT INTO `phppos_people` VALUES ('LUIS', 'GUANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 773);
INSERT INTO `phppos_people` VALUES ('RENATA', 'ORTIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 774);
INSERT INTO `phppos_people` VALUES ('JOSE', 'MONTERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 775);
INSERT INTO `phppos_people` VALUES ('OLGA', 'QUEMAG', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 776);
INSERT INTO `phppos_people` VALUES ('IVAN', 'TOLEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 777);
INSERT INTO `phppos_people` VALUES ('MAURICIO ', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 778);
INSERT INTO `phppos_people` VALUES ('SHIRLEY', 'NIETO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 779);
INSERT INTO `phppos_people` VALUES ('BYRAN', 'OGONADA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 780);
INSERT INTO `phppos_people` VALUES ('MELANIEE', 'CA?AR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 781);
INSERT INTO `phppos_people` VALUES ('WILSON', 'AMAGUA?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 782);
INSERT INTO `phppos_people` VALUES ('JUAN', 'FERNANDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 783);
INSERT INTO `phppos_people` VALUES ('MANUEL', 'CHICAIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 784);
INSERT INTO `phppos_people` VALUES ('FANNY', 'MISE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 785);
INSERT INTO `phppos_people` VALUES ('ROSA', 'CORONEL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 786);
INSERT INTO `phppos_people` VALUES ('SUSANA ', 'RODRIGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 787);
INSERT INTO `phppos_people` VALUES ('BEATRIZ ', 'SALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 788);
INSERT INTO `phppos_people` VALUES ('LUIS', 'COLLAGUAZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 789);
INSERT INTO `phppos_people` VALUES ('FERNANDO', 'BRAVO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 790);
INSERT INTO `phppos_people` VALUES ('LUCIA', 'GARCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 791);
INSERT INTO `phppos_people` VALUES ('VICENTE ', 'JUMBO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 792);
INSERT INTO `phppos_people` VALUES ('DIEGO', 'MONTALVO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 793);
INSERT INTO `phppos_people` VALUES ('MARIA', 'CEBALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 794);
INSERT INTO `phppos_people` VALUES ('FRANCISCO', 'GUACOLLAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 795);
INSERT INTO `phppos_people` VALUES ('MARIA', 'PANTOJA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 796);
INSERT INTO `phppos_people` VALUES ('MONICA', 'QUISPE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 797);
INSERT INTO `phppos_people` VALUES ('JENNY', 'MERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 798);
INSERT INTO `phppos_people` VALUES ('ANDRES', 'FAZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 799);
INSERT INTO `phppos_people` VALUES ('SANTIAGO', 'ROMAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 800);
INSERT INTO `phppos_people` VALUES ('FAUSTO', 'BALDEON', '', '', '', '', 'QUITO', 'PICHINCHA', '1708003437001', 'ECUADOR', '', 801);
INSERT INTO `phppos_people` VALUES ('TANIA', 'MEJIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 802);
INSERT INTO `phppos_people` VALUES ('MIREYA', 'PUSDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 803);
INSERT INTO `phppos_people` VALUES ('WILSON', 'VALLADARES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 804);
INSERT INTO `phppos_people` VALUES ('DESCUENTO', 'PERDIDO', '', '', '', '', '', '', '', '', '', 805);
INSERT INTO `phppos_people` VALUES ('ADRIANA', 'GUALSAQUI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 806);
INSERT INTO `phppos_people` VALUES ('MARIELA ', 'LUCERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 807);
INSERT INTO `phppos_people` VALUES ('JOSE', 'COSTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 808);
INSERT INTO `phppos_people` VALUES ('NATALIA', 'GONZALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 809);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'MOLINA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 810);
INSERT INTO `phppos_people` VALUES ('AMPARO', 'ROSADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 811);
INSERT INTO `phppos_people` VALUES ('MAYRA', 'REISANCHO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 812);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'JURADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 813);
INSERT INTO `phppos_people` VALUES ('ALEXANDRA', 'INLAGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 814);
INSERT INTO `phppos_people` VALUES ('MARISOL', 'GAONA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 815);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'CASTILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 816);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'CASERES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 817);
INSERT INTO `phppos_people` VALUES ('LUIS', 'ZARATE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 818);
INSERT INTO `phppos_people` VALUES ('MARIA', 'TORRES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 819);
INSERT INTO `phppos_people` VALUES ('DIEGO', 'CARVAJAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 820);
INSERT INTO `phppos_people` VALUES ('LINA', 'ANDRADE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 821);
INSERT INTO `phppos_people` VALUES ('CAROLINA', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 822);
INSERT INTO `phppos_people` VALUES ('MARGARITA', 'ESPINOZA', '', '', '', '', 'QUITO', 'P', '', 'ECUADOR', '', 823);
INSERT INTO `phppos_people` VALUES ('VICENTE', 'NIETO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 824);
INSERT INTO `phppos_people` VALUES ('MARCELO', 'MARDO?ES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 825);
INSERT INTO `phppos_people` VALUES ('ALFREDO', 'SANABRIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 826);
INSERT INTO `phppos_people` VALUES ('ANA', 'ARMIJOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 827);
INSERT INTO `phppos_people` VALUES ('MARTHA', 'CARANGUI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 828);
INSERT INTO `phppos_people` VALUES ('MARLENE', 'PROA?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 829);
INSERT INTO `phppos_people` VALUES ('DANIEL ', 'OBANDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 830);
INSERT INTO `phppos_people` VALUES ('JANETH', 'VERDESOTO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 831);
INSERT INTO `phppos_people` VALUES ('YOLANDA', 'ASTUDILLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 832);
INSERT INTO `phppos_people` VALUES ('EDGAR', 'GUBIO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 833);
INSERT INTO `phppos_people` VALUES ('VICENTE', 'LEON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 834);
INSERT INTO `phppos_people` VALUES ('OLGA', 'RUEDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 835);
INSERT INTO `phppos_people` VALUES ('PATRICIA', 'CARRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 836);
INSERT INTO `phppos_people` VALUES ('TERESA', 'CHANCUSI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 837);
INSERT INTO `phppos_people` VALUES ('MARITZA', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 838);
INSERT INTO `phppos_people` VALUES ('FRANCISCO', 'MORA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 839);
INSERT INTO `phppos_people` VALUES ('HECTOR', 'GONZALEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 840);
INSERT INTO `phppos_people` VALUES ('YULI', 'ALONSO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 841);
INSERT INTO `phppos_people` VALUES ('ANA', 'ESPERANZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 842);
INSERT INTO `phppos_people` VALUES ('MILLER', 'PINARGOTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 843);
INSERT INTO `phppos_people` VALUES ('JORGE', 'O?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 844);
INSERT INTO `phppos_people` VALUES ('ALEXANDRA', 'CAIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 845);
INSERT INTO `phppos_people` VALUES ('CECILIA ', 'REYES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 846);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'SALTOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 847);
INSERT INTO `phppos_people` VALUES ('LUXI', 'MACIAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 848);
INSERT INTO `phppos_people` VALUES ('JORGE', 'HUACA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 849);
INSERT INTO `phppos_people` VALUES ('MARGOTH', 'CU?AS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 850);
INSERT INTO `phppos_people` VALUES ('LINDA', 'JOSEF', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 851);
INSERT INTO `phppos_people` VALUES ('JEFERSON', 'QUIROZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 852);
INSERT INTO `phppos_people` VALUES ('PIEDAD', 'MONTALVO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 853);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'VALENZUELA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 854);
INSERT INTO `phppos_people` VALUES ('SONIA', 'RIVERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 855);
INSERT INTO `phppos_people` VALUES ('GOLDEN', 'PUBLICITY', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 856);
INSERT INTO `phppos_people` VALUES ('ISABEL', 'GRANJA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 857);
INSERT INTO `phppos_people` VALUES ('NORMA', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 858);
INSERT INTO `phppos_people` VALUES ('SRA', 'FLAKA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 859);
INSERT INTO `phppos_people` VALUES ('RAMIRO', 'SALVADOR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 860);
INSERT INTO `phppos_people` VALUES ('WASHINGTON', 'PUCACHAQUI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 861);
INSERT INTO `phppos_people` VALUES ('EDGAR', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 862);
INSERT INTO `phppos_people` VALUES ('IVAN', 'LOMBEIDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 863);
INSERT INTO `phppos_people` VALUES ('INES', 'RAMOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 864);
INSERT INTO `phppos_people` VALUES ('EDWAR', 'ROMERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 865);
INSERT INTO `phppos_people` VALUES ('OSWALDO', 'INAPANTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 866);
INSERT INTO `phppos_people` VALUES ('MARGARITA', 'VASQUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 867);
INSERT INTO `phppos_people` VALUES ('GONZALO', 'FIERRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 868);
INSERT INTO `phppos_people` VALUES ('MILTON', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 869);
INSERT INTO `phppos_people` VALUES ('JOSE', 'PILA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 870);
INSERT INTO `phppos_people` VALUES ('CRISTIAN', 'BUSTAMANTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 871);
INSERT INTO `phppos_people` VALUES ('ANA', 'ALMEIDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 872);
INSERT INTO `phppos_people` VALUES ('FAUSTO', 'GUACHAMIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 873);
INSERT INTO `phppos_people` VALUES ('ANA', 'CAIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 874);
INSERT INTO `phppos_people` VALUES ('GALO', 'MOYA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 875);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'CEPEDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 876);
INSERT INTO `phppos_people` VALUES ('MARCO', 'SANDOVAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 877);
INSERT INTO `phppos_people` VALUES ('LUIS', 'BENALCAZAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 878);
INSERT INTO `phppos_people` VALUES ('EDWIN', 'ORTEGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 879);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'CARRION', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 880);
INSERT INTO `phppos_people` VALUES ('DEIVIS', 'ALAVA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 881);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'CUYO', '', '', '', 'CHILLOGALLO', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 882);
INSERT INTO `phppos_people` VALUES ('CATALINA', 'ESPINOZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 883);
INSERT INTO `phppos_people` VALUES ('MARGARITA', 'GUERRERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 884);
INSERT INTO `phppos_people` VALUES ('ALBERTO', 'CASTA?EDA', '', '', '', '', '', '', '', '', '', 885);
INSERT INTO `phppos_people` VALUES ('CESAR', 'BURGOS', '0983652384', '', '', '', 'CAYAMBE', 'PICHINCHA', '1002313812', 'ECUADOR', '', 886);
INSERT INTO `phppos_people` VALUES ('JUAN ', 'CASTA?EDA', '', '', '', '', '', '', '', '', '', 887);
INSERT INTO `phppos_people` VALUES ('FERNANDO', 'GOMES', '0993783326', '', '', '', 'IBARRA', 'IMBABURA', '', 'ECUADOR', '', 888);
INSERT INTO `phppos_people` VALUES ('TATIANA', 'AMAGUA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 889);
INSERT INTO `phppos_people` VALUES ('DIANA', 'ROSALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 890);
INSERT INTO `phppos_people` VALUES ('JOSE', 'ALMEIDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 891);
INSERT INTO `phppos_people` VALUES ('CARMEN', 'CALUGULLIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 892);
INSERT INTO `phppos_people` VALUES ('MARIA', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 893);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'OMAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 894);
INSERT INTO `phppos_people` VALUES ('ELSA', 'SARMIENTO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 895);
INSERT INTO `phppos_people` VALUES ('WALTER', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 896);
INSERT INTO `phppos_people` VALUES ('TANIA', 'AMAGUA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 897);
INSERT INTO `phppos_people` VALUES ('EDISON', 'MANOSALVAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 898);
INSERT INTO `phppos_people` VALUES ('JAVIER', 'FUELPAZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 899);
INSERT INTO `phppos_people` VALUES ('JOSE', 'RODRIGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 900);
INSERT INTO `phppos_people` VALUES ('MARIA', 'GOMEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 901);
INSERT INTO `phppos_people` VALUES ('WILSON', 'TOAQUIZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 902);
INSERT INTO `phppos_people` VALUES ('GRACIELA', 'TORO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 903);
INSERT INTO `phppos_people` VALUES ('MARCELO', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 904);
INSERT INTO `phppos_people` VALUES ('ELVIA', 'ROJAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 905);
INSERT INTO `phppos_people` VALUES ('KARINA', 'NOTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 906);
INSERT INTO `phppos_people` VALUES ('EDWIN', 'PERALTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 907);
INSERT INTO `phppos_people` VALUES ('ESTEBAN', 'YEPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 908);
INSERT INTO `phppos_people` VALUES ('SONIA', 'ALBARRACIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 909);
INSERT INTO `phppos_people` VALUES ('JOSE', 'USHI?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 910);
INSERT INTO `phppos_people` VALUES ('MIRYAN ', 'JADA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 911);
INSERT INTO `phppos_people` VALUES ('JORGE', 'PARDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 912);
INSERT INTO `phppos_people` VALUES ('IVAN', 'GUEVARA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 913);
INSERT INTO `phppos_people` VALUES ('ANDRES ', 'AMAGUA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 914);
INSERT INTO `phppos_people` VALUES ('LUCIA', 'ROSERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 915);
INSERT INTO `phppos_people` VALUES ('RONALD', 'YEPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 916);
INSERT INTO `phppos_people` VALUES ('WILSON', 'PALACIOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 917);
INSERT INTO `phppos_people` VALUES ('MILTON', 'HINOJOSA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 918);
INSERT INTO `phppos_people` VALUES ('FLOR', 'CAICEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 919);
INSERT INTO `phppos_people` VALUES ('EDUARDO', 'GORDON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 920);
INSERT INTO `phppos_people` VALUES ('JAIME ', 'BENAVIDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 921);
INSERT INTO `phppos_people` VALUES ('NANCY', 'GORDILLO', '', '', '', 'Q', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 922);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'TAMAYO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 923);
INSERT INTO `phppos_people` VALUES ('SRA', 'MARIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 924);
INSERT INTO `phppos_people` VALUES ('DEISE', 'TURQUEAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 925);
INSERT INTO `phppos_people` VALUES ('MAYRA', 'ALMEIDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 926);
INSERT INTO `phppos_people` VALUES ('LUIS', 'PROA?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 927);
INSERT INTO `phppos_people` VALUES ('JESSICA', 'CRUZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 928);
INSERT INTO `phppos_people` VALUES ('CARMEN', 'SANDOVAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 929);
INSERT INTO `phppos_people` VALUES ('PAOLA', 'BUSTOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 930);
INSERT INTO `phppos_people` VALUES ('XIMENA', 'ANDRADE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 931);
INSERT INTO `phppos_people` VALUES ('SRA', 'PERLA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 932);
INSERT INTO `phppos_people` VALUES ('ANGEL', 'JURADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 933);
INSERT INTO `phppos_people` VALUES ('CECILIA', 'POZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 934);
INSERT INTO `phppos_people` VALUES ('MAYRA', 'SHUGELI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 935);
INSERT INTO `phppos_people` VALUES ('MARIA', 'SANCHEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 936);
INSERT INTO `phppos_people` VALUES ('MARLON', 'NORO?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 937);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'ULLOA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 938);
INSERT INTO `phppos_people` VALUES ('PEDRO', 'CANDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 939);
INSERT INTO `phppos_people` VALUES ('LUPE', 'VISCARRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 940);
INSERT INTO `phppos_people` VALUES ('IRENE', 'BENAVIDES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 941);
INSERT INTO `phppos_people` VALUES ('SANTIAGO ', 'GUSMAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 942);
INSERT INTO `phppos_people` VALUES ('KATERINE', 'TOAPANTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 943);
INSERT INTO `phppos_people` VALUES ('MARIA', 'CHIGUANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 944);
INSERT INTO `phppos_people` VALUES ('ROBERT', 'SANTOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 945);
INSERT INTO `phppos_people` VALUES ('JULIO', 'YAPO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 946);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'TAPIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 947);
INSERT INTO `phppos_people` VALUES ('OSWALDO', 'LARA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 948);
INSERT INTO `phppos_people` VALUES ('PAUL', 'SOLIS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 949);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'ALMEIDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 950);
INSERT INTO `phppos_people` VALUES ('LUISA', 'CANELO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 951);
INSERT INTO `phppos_people` VALUES ('EDISON', 'HERNANDEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 952);
INSERT INTO `phppos_people` VALUES ('MARCO', 'MOROCHO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 953);
INSERT INTO `phppos_people` VALUES ('EMMA', 'ARGUELLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 954);
INSERT INTO `phppos_people` VALUES ('MARIA', 'BANDA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 955);
INSERT INTO `phppos_people` VALUES ('JAIME', 'NU?EZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 956);
INSERT INTO `phppos_people` VALUES ('XAVIER', 'MORENO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 957);
INSERT INTO `phppos_people` VALUES ('GUADALUPE', 'QUISPE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 958);
INSERT INTO `phppos_people` VALUES ('DIANA', 'VALDIVIESO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 959);
INSERT INTO `phppos_people` VALUES ('LUIS', 'VILLAMARIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 960);
INSERT INTO `phppos_people` VALUES ('PIEDAD', 'ARMAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 961);
INSERT INTO `phppos_people` VALUES ('ANA', 'CARDENAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 962);
INSERT INTO `phppos_people` VALUES ('MIGUEL', 'HIPO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 963);
INSERT INTO `phppos_people` VALUES ('SILVIA', 'MALDONADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 964);
INSERT INTO `phppos_people` VALUES ('SOFIA', 'RUIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 965);
INSERT INTO `phppos_people` VALUES ('JOSE', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 966);
INSERT INTO `phppos_people` VALUES ('CECILIA', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 967);
INSERT INTO `phppos_people` VALUES ('GALO', 'CARVAJAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 968);
INSERT INTO `phppos_people` VALUES ('JENNY', 'GARCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 969);
INSERT INTO `phppos_people` VALUES ('JESSICA', 'VILLAMAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 970);
INSERT INTO `phppos_people` VALUES ('MIGUEL', 'SALAZAR', '', '', '', '', 'CAYAMBE', 'PICHINCHA', '1001496700001', 'ECUADOR', '', 971);
INSERT INTO `phppos_people` VALUES ('ANDRES', 'GARZON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 972);
INSERT INTO `phppos_people` VALUES ('ANDRES', 'GARZON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 973);
INSERT INTO `phppos_people` VALUES ('ANDRES', 'GARZON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 974);
INSERT INTO `phppos_people` VALUES ('OSWALDO', 'CUASCOTA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 975);
INSERT INTO `phppos_people` VALUES ('JOSE ', 'ERAZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 976);
INSERT INTO `phppos_people` VALUES ('EDISON', 'MORA ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 977);
INSERT INTO `phppos_people` VALUES ('EDISON', 'MORA ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 978);
INSERT INTO `phppos_people` VALUES ('ALBA', 'BELTRAN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 979);
INSERT INTO `phppos_people` VALUES ('MONICA', 'RUIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 980);
INSERT INTO `phppos_people` VALUES ('LUIS ', 'RAMOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 981);
INSERT INTO `phppos_people` VALUES ('LUIS ', 'RAMOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 982);
INSERT INTO `phppos_people` VALUES ('LUIS', 'MONTENEGRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 983);
INSERT INTO `phppos_people` VALUES ('SUSANA', 'SALCEDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 984);
INSERT INTO `phppos_people` VALUES ('LORENA', 'GARZON', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 985);
INSERT INTO `phppos_people` VALUES ('LICENIA', 'MENA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 986);
INSERT INTO `phppos_people` VALUES ('MAYRA', 'SALAZAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 987);
INSERT INTO `phppos_people` VALUES ('BETTY', 'VILLANUEVA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 988);
INSERT INTO `phppos_people` VALUES ('MISHELL', 'ZURITA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 989);
INSERT INTO `phppos_people` VALUES ('TANIA', 'CEVALLOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 990);
INSERT INTO `phppos_people` VALUES ('ALICIA', 'SANGUCHO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 991);
INSERT INTO `phppos_people` VALUES ('JAIME ', 'RAZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 992);
INSERT INTO `phppos_people` VALUES ('GABRIEL', 'BUSTOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 993);
INSERT INTO `phppos_people` VALUES ('DARWIN', 'AGUILAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 994);
INSERT INTO `phppos_people` VALUES ('MARIA', 'VALAREZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 995);
INSERT INTO `phppos_people` VALUES ('LUXI', 'MACIAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 996);
INSERT INTO `phppos_people` VALUES ('MARIA ', 'GUASGUA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 997);
INSERT INTO `phppos_people` VALUES ('ALFONSO', 'MOREIRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 998);
INSERT INTO `phppos_people` VALUES ('ERIKA', 'MORENO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 999);
INSERT INTO `phppos_people` VALUES ('MELIDA', 'PALACIOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1000);
INSERT INTO `phppos_people` VALUES ('FABIAN', 'VEGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1001);
INSERT INTO `phppos_people` VALUES ('JUAN', 'YUGSI', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1002);
INSERT INTO `phppos_people` VALUES ('MILTON', 'LOPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1003);
INSERT INTO `phppos_people` VALUES ('CARLOS ', 'ORTEGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1004);
INSERT INTO `phppos_people` VALUES ('XAVIER', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1005);
INSERT INTO `phppos_people` VALUES ('ANIBAL', 'MOSQUERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1006);
INSERT INTO `phppos_people` VALUES ('RONY', 'VILLALBA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1007);
INSERT INTO `phppos_people` VALUES ('FRANCISCO', 'DELGADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1008);
INSERT INTO `phppos_people` VALUES ('MARCELO', 'ESTEVEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1009);
INSERT INTO `phppos_people` VALUES ('WASHINGTON', 'MORALES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1010);
INSERT INTO `phppos_people` VALUES ('SRA', 'ESTETICA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1011);
INSERT INTO `phppos_people` VALUES ('ALAN', 'JACOME', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1012);
INSERT INTO `phppos_people` VALUES ('MARIA', 'CHIRIBOGA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1013);
INSERT INTO `phppos_people` VALUES ('DANNY', 'RUIZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1014);
INSERT INTO `phppos_people` VALUES ('NELLY', 'MENDOZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1015);
INSERT INTO `phppos_people` VALUES ('ALFREDO', 'RAMOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', '', '', 1016);
INSERT INTO `phppos_people` VALUES ('SONIA ', 'TELLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1017);
INSERT INTO `phppos_people` VALUES ('SONIA ', 'TELLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1018);
INSERT INTO `phppos_people` VALUES ('VICTOR', 'CAIZALITIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1019);
INSERT INTO `phppos_people` VALUES ('LUIS', 'ARAUJO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1020);
INSERT INTO `phppos_people` VALUES ('MARLENE', 'LARA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1021);
INSERT INTO `phppos_people` VALUES ('RAMIRO', 'QUINTEROS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1022);
INSERT INTO `phppos_people` VALUES ('SRA', 'UNIFORME', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1023);
INSERT INTO `phppos_people` VALUES ('ESTUARDO', 'CORREAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1024);
INSERT INTO `phppos_people` VALUES ('CECILIA ', 'CUYASHAMIN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1025);
INSERT INTO `phppos_people` VALUES ('GRACE', 'VALAREZO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1026);
INSERT INTO `phppos_people` VALUES ('EDITA', 'DOMINGUEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1027);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'MANTUANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1028);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'ANTE', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1029);
INSERT INTO `phppos_people` VALUES ('LENIN', 'ARCOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1030);
INSERT INTO `phppos_people` VALUES ('FERNANDO', 'FAJARDO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1031);
INSERT INTO `phppos_people` VALUES ('NELLY', 'GARCIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1032);
INSERT INTO `phppos_people` VALUES ('TANIA', 'GALLEGOS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1033);
INSERT INTO `phppos_people` VALUES ('BYRON ', 'CORONADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1034);
INSERT INTO `phppos_people` VALUES ('LUIS', 'LANDIVAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1035);
INSERT INTO `phppos_people` VALUES ('FAUSTO ', 'MU?OZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1036);
INSERT INTO `phppos_people` VALUES ('YOLANDA', 'MU?OZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1037);
INSERT INTO `phppos_people` VALUES ('DINO ', 'GREY', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1038);
INSERT INTO `phppos_people` VALUES ('ADRIANA', 'GOMEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1039);
INSERT INTO `phppos_people` VALUES ('JENNY', 'GARCEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1040);
INSERT INTO `phppos_people` VALUES ('ROSA', 'GUILLEN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1041);
INSERT INTO `phppos_people` VALUES ('ARLINE', 'ALAVA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1042);
INSERT INTO `phppos_people` VALUES ('MILTON', 'HINOJOSA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1043);
INSERT INTO `phppos_people` VALUES ('CARMEN', 'HERRERA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1044);
INSERT INTO `phppos_people` VALUES ('GALO', 'CARVAJAL', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1045);
INSERT INTO `phppos_people` VALUES ('CARLOS', 'CAZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1046);
INSERT INTO `phppos_people` VALUES ('ADRIANA', 'MORALES', '', '', '', '', '', '', '', '', '', 1047);
INSERT INTO `phppos_people` VALUES ('WILLIAMS', 'TINAJERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1048);
INSERT INTO `phppos_people` VALUES ('EDUARDO', 'AYALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1049);
INSERT INTO `phppos_people` VALUES ('VERONICA', 'FIGUEROA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1050);
INSERT INTO `phppos_people` VALUES ('NANCY', 'CASTRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1051);
INSERT INTO `phppos_people` VALUES ('LORENA ', 'COMPA?ERA', '', '', '', '', '', '', '', '', '', 1052);
INSERT INTO `phppos_people` VALUES ('WILSON', 'NEJER', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1053);
INSERT INTO `phppos_people` VALUES ('PAOLA', 'PAZMI?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1054);
INSERT INTO `phppos_people` VALUES ('MARIANELA', 'ORDO?EZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1055);
INSERT INTO `phppos_people` VALUES ('JENIFER', 'MACIAS', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1056);
INSERT INTO `phppos_people` VALUES ('LUISA', 'SEGOVIA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1057);
INSERT INTO `phppos_people` VALUES ('JOSE', 'PALLO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1058);
INSERT INTO `phppos_people` VALUES ('VINICIO', 'GUERRERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1059);
INSERT INTO `phppos_people` VALUES ('CLEMENTE', 'CAMACHO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1060);
INSERT INTO `phppos_people` VALUES ('WILSON', 'FLORES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1061);
INSERT INTO `phppos_people` VALUES ('MONICA', 'ESPA?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1062);
INSERT INTO `phppos_people` VALUES ('JOSE', 'PE?A', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1063);
INSERT INTO `phppos_people` VALUES ('SANTIAGO', 'LOPEZ', '', '', '', '', 'QUITO', 'P', '', 'ECUADOR', '', 1064);
INSERT INTO `phppos_people` VALUES ('PIEDAD', 'AYALA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1065);
INSERT INTO `phppos_people` VALUES ('ANGELA', 'BERMEO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1066);
INSERT INTO `phppos_people` VALUES ('ALFONSO', 'GUAMANGATE', '', '', '', 'CABLEC', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1067);
INSERT INTO `phppos_people` VALUES ('JUAN', 'ANGULO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1068);
INSERT INTO `phppos_people` VALUES ('CESAR', 'AGUILAR', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1069);
INSERT INTO `phppos_people` VALUES ('MANUEL', 'REYES', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1070);
INSERT INTO `phppos_people` VALUES ('MARIA', 'MALDONADO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1071);
INSERT INTO `phppos_people` VALUES ('GUILLERMO ', 'SAEN', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1072);
INSERT INTO `phppos_people` VALUES ('PATRICIO', 'QUITO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1073);
INSERT INTO `phppos_people` VALUES ('BRAYAN', 'SANTIAGO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1074);
INSERT INTO `phppos_people` VALUES ('NANCY', 'MONTA?O', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1075);
INSERT INTO `phppos_people` VALUES ('LOREN', 'RUBIO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1076);
INSERT INTO `phppos_people` VALUES ('LOREN', 'RUBIO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1077);
INSERT INTO `phppos_people` VALUES ('GABRIELA', 'LOPEZ', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1078);
INSERT INTO `phppos_people` VALUES ('DIEGO', 'CHAMORRO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1079);
INSERT INTO `phppos_people` VALUES ('MATILDE', 'MOREIRA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1080);
INSERT INTO `phppos_people` VALUES ('LUIS', 'BASURTO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1081);
INSERT INTO `phppos_people` VALUES ('LEONEL', 'MONTERO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1082);
INSERT INTO `phppos_people` VALUES ('FELIPE', 'ZAMBRANO', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1083);
INSERT INTO `phppos_people` VALUES ('LORENA', 'GALARZA', '', '', '', '', 'QUITO', 'PICHINCHA', '', 'ECUADOR', '', 1084);
INSERT INTO `phppos_people` VALUES ('jaime', 'santana', '', '', '', '', '', '', '160039239', '', '', 1086);
INSERT INTO `phppos_people` VALUES ('Jaime', 'Santana', '12345', 'dexterx17@hotmail.com', '', '', 'Ambato', '', '1600392359', '', '', 1087);
INSERT INTO `phppos_people` VALUES ('James', 'Bond', '007', 'agente@007.com', '', '', '', '', '007', '', '', 1088);
INSERT INTO `phppos_people` VALUES ('mario', 'torres', '', 'wert@iuy.con', '', '', '', '', '1212121212', '', '', 1089);
INSERT INTO `phppos_people` VALUES ('ALEX', 'MOREMO', '022673444', '', 'QUIMIAG OE2-106 Y GONZOL', 'QUIMIAG OE2-106 Y GONZOL', 'QUITO', 'PICHINCHA', '1790163776001', 'ECUADOR', 'BINKY', 1090);
INSERT INTO `phppos_people` VALUES ('BUESTAN', 'BUESTAN', '', '', '', '', '', 'PICHINCHA', '1790554295001', '', '', 1091);
INSERT INTO `phppos_people` VALUES ('JUAN CARLOS', 'CABRERA', '', '', '', '', '', '', '', '', '', 1092);
INSERT INTO `phppos_people` VALUES ('SEBASTIAN', 'GUTIERREZ', '', '', '', '', '', '', '1803594033', '', '', 1093);
INSERT INTO `phppos_people` VALUES ('PATRICIA ', 'GUTIERREZ', '0995455655', '', 'LA MERCED', '', 'PUYO', 'PASTAZA', '1803594041', 'ECUADOR', '', 1094);
INSERT INTO `phppos_people` VALUES ('AZALEIA', 'BR', '', '', '', '', '', '', '', '', '', 1095);
INSERT INTO `phppos_people` VALUES ('BIBI ESTYLOSA', 'BR', '', '', '', '', '', '', '', '', '', 1096);
INSERT INTO `phppos_people` VALUES ('CONVERSE', 'CVS', '', '', '', '', '', '', '', '', '', 1097);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_permissions`
-- 

CREATE TABLE `phppos_permissions` (
  `module_id` varchar(255) NOT NULL,
  `person_id` int(10) NOT NULL,
  PRIMARY KEY (`module_id`,`person_id`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_permissions`
-- 

INSERT INTO `phppos_permissions` VALUES ('abonos', 180);
INSERT INTO `phppos_permissions` VALUES ('abonos', 183);
INSERT INTO `phppos_permissions` VALUES ('abonos', 294);
INSERT INTO `phppos_permissions` VALUES ('abonos', 298);
INSERT INTO `phppos_permissions` VALUES ('abonos', 307);
INSERT INTO `phppos_permissions` VALUES ('abonos', 527);
INSERT INTO `phppos_permissions` VALUES ('abonos', 1088);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 180);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 183);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 294);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 298);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 307);
INSERT INTO `phppos_permissions` VALUES ('almacenes', 1088);
INSERT INTO `phppos_permissions` VALUES ('boxes', 183);
INSERT INTO `phppos_permissions` VALUES ('boxes', 294);
INSERT INTO `phppos_permissions` VALUES ('boxes', 298);
INSERT INTO `phppos_permissions` VALUES ('boxes', 307);
INSERT INTO `phppos_permissions` VALUES ('boxes', 527);
INSERT INTO `phppos_permissions` VALUES ('boxes', 1088);
INSERT INTO `phppos_permissions` VALUES ('config', 180);
INSERT INTO `phppos_permissions` VALUES ('config', 183);
INSERT INTO `phppos_permissions` VALUES ('config', 294);
INSERT INTO `phppos_permissions` VALUES ('config', 298);
INSERT INTO `phppos_permissions` VALUES ('config', 307);
INSERT INTO `phppos_permissions` VALUES ('config', 1088);
INSERT INTO `phppos_permissions` VALUES ('customers', 180);
INSERT INTO `phppos_permissions` VALUES ('customers', 183);
INSERT INTO `phppos_permissions` VALUES ('customers', 294);
INSERT INTO `phppos_permissions` VALUES ('customers', 298);
INSERT INTO `phppos_permissions` VALUES ('customers', 307);
INSERT INTO `phppos_permissions` VALUES ('customers', 527);
INSERT INTO `phppos_permissions` VALUES ('customers', 1088);
INSERT INTO `phppos_permissions` VALUES ('employees', 180);
INSERT INTO `phppos_permissions` VALUES ('employees', 183);
INSERT INTO `phppos_permissions` VALUES ('employees', 294);
INSERT INTO `phppos_permissions` VALUES ('employees', 298);
INSERT INTO `phppos_permissions` VALUES ('employees', 307);
INSERT INTO `phppos_permissions` VALUES ('employees', 1088);
INSERT INTO `phppos_permissions` VALUES ('items', 180);
INSERT INTO `phppos_permissions` VALUES ('items', 183);
INSERT INTO `phppos_permissions` VALUES ('items', 294);
INSERT INTO `phppos_permissions` VALUES ('items', 298);
INSERT INTO `phppos_permissions` VALUES ('items', 307);
INSERT INTO `phppos_permissions` VALUES ('items', 527);
INSERT INTO `phppos_permissions` VALUES ('items', 1088);
INSERT INTO `phppos_permissions` VALUES ('payments', 180);
INSERT INTO `phppos_permissions` VALUES ('payments', 183);
INSERT INTO `phppos_permissions` VALUES ('payments', 294);
INSERT INTO `phppos_permissions` VALUES ('payments', 298);
INSERT INTO `phppos_permissions` VALUES ('payments', 307);
INSERT INTO `phppos_permissions` VALUES ('payments', 1088);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 180);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 183);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 294);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 298);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 307);
INSERT INTO `phppos_permissions` VALUES ('porpagar', 1088);
INSERT INTO `phppos_permissions` VALUES ('receivings', 180);
INSERT INTO `phppos_permissions` VALUES ('receivings', 183);
INSERT INTO `phppos_permissions` VALUES ('receivings', 294);
INSERT INTO `phppos_permissions` VALUES ('receivings', 298);
INSERT INTO `phppos_permissions` VALUES ('receivings', 307);
INSERT INTO `phppos_permissions` VALUES ('receivings', 1088);
INSERT INTO `phppos_permissions` VALUES ('reports', 180);
INSERT INTO `phppos_permissions` VALUES ('reports', 183);
INSERT INTO `phppos_permissions` VALUES ('reports', 294);
INSERT INTO `phppos_permissions` VALUES ('reports', 298);
INSERT INTO `phppos_permissions` VALUES ('reports', 307);
INSERT INTO `phppos_permissions` VALUES ('reports', 1088);
INSERT INTO `phppos_permissions` VALUES ('sales', 180);
INSERT INTO `phppos_permissions` VALUES ('sales', 183);
INSERT INTO `phppos_permissions` VALUES ('sales', 294);
INSERT INTO `phppos_permissions` VALUES ('sales', 298);
INSERT INTO `phppos_permissions` VALUES ('sales', 307);
INSERT INTO `phppos_permissions` VALUES ('sales', 527);
INSERT INTO `phppos_permissions` VALUES ('sales', 1088);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 180);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 183);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 294);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 298);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 307);
INSERT INTO `phppos_permissions` VALUES ('suppliers', 1088);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_porpagar`
-- 

CREATE TABLE `phppos_porpagar` (
  `porpagar_id` int(10) NOT NULL AUTO_INCREMENT,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `amount` double(15,2) NOT NULL,
  `type` varchar(50) NOT NULL,
  `comment` varchar(200) DEFAULT NULL,
  `payment_id` int(10) NOT NULL,
  `receiving_id` int(10) NOT NULL,
  PRIMARY KEY (`porpagar_id`),
  KEY `fk_recv_in_abono_recv` (`receiving_id`),
  KEY `fk_payment_in_abono_recv` (`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `phppos_porpagar`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_receivings`
-- 

CREATE TABLE `phppos_receivings` (
  `receiving_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `supplier_id` int(10) DEFAULT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `receiving_id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_type` varchar(400) DEFAULT NULL,
  PRIMARY KEY (`receiving_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- 
-- Dumping data for table `phppos_receivings`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_receivings_items`
-- 

CREATE TABLE `phppos_receivings_items` (
  `receiving_id` int(10) NOT NULL DEFAULT '0',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `description` varchar(250) DEFAULT NULL,
  `serialnumber` varchar(30) DEFAULT NULL,
  `line` int(3) NOT NULL,
  `quantity_purchased` int(10) NOT NULL DEFAULT '0',
  `item_cost_price` decimal(15,2) NOT NULL,
  `item_unit_price` double(15,2) NOT NULL,
  `discount_percent` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`receiving_id`,`item_id`,`line`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_receivings_items`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_receivings_items_temp`
-- 

CREATE TABLE `phppos_receivings_items_temp` (
  `receiving_date` date DEFAULT NULL,
  `receiving_id` int(10) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `payment_type` varchar(400) DEFAULT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `supplier_id` int(10) DEFAULT NULL,
  `quantity_purchased` int(10) NOT NULL DEFAULT '0',
  `item_cost_price` decimal(15,2) NOT NULL,
  `item_unit_price` double(15,2) NOT NULL,
  `discount_percent` int(11) NOT NULL DEFAULT '0',
  `subtotal` double(23,6) DEFAULT NULL,
  `line` int(3) NOT NULL,
  `serialnumber` varchar(30) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `total` double(19,2) DEFAULT NULL,
  `profit` double(23,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_receivings_items_temp`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_receivings_payments`
-- 

CREATE TABLE `phppos_receivings_payments` (
  `receiving_id` int(10) NOT NULL,
  `payment_id` int(10) NOT NULL,
  `payment_amount` double(15,2) NOT NULL,
  PRIMARY KEY (`receiving_id`,`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_receivings_payments`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales`
-- 

CREATE TABLE `phppos_sales` (
  `sale_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` int(10) DEFAULT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `sale_id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_type` varchar(400) DEFAULT NULL,
  `almacen_id` int(10) NOT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  KEY `fk_almacen_en_sale` (`almacen_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

-- 
-- Dumping data for table `phppos_sales`
-- 

INSERT INTO `phppos_sales` VALUES ('2016-11-16 12:05:49', 1089, 180, '', 1, 'Efectivo: $28.50<br>', 23);
INSERT INTO `phppos_sales` VALUES ('2017-01-11 18:47:43', 1093, 298, '', 2, 'Cuentas por pagar: $94.62<br>', 23);
INSERT INTO `phppos_sales` VALUES ('2017-01-14 17:52:57', NULL, 298, '', 3, 'Efectivo: $310.00<br>', 23);
INSERT INTO `phppos_sales` VALUES ('2017-01-14 18:18:44', 1093, 298, '', 4, 'Efectivo: $25.08<br>', 23);
INSERT INTO `phppos_sales` VALUES ('2017-01-15 10:37:18', NULL, 180, '', 5, 'Acumulativo: $90.06<br>', 23);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_items`
-- 

CREATE TABLE `phppos_sales_items` (
  `sale_id` int(10) NOT NULL DEFAULT '0',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `description` varchar(250) DEFAULT NULL,
  `serialnumber` varchar(30) DEFAULT NULL,
  `line` int(3) NOT NULL DEFAULT '0',
  `quantity_purchased` double(15,2) NOT NULL DEFAULT '0.00',
  `item_cost_price` decimal(15,2) NOT NULL,
  `item_unit_price` double(15,2) NOT NULL,
  `discount_percent` double(15,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`sale_id`,`item_id`,`line`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_items`
-- 

INSERT INTO `phppos_sales_items` VALUES (1, 2, '', '', 1, 1.00, 16.00, 25.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (2, 30, '', '', 1, 1.00, 20.18, 53.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (2, 31, '', '', 2, 1.00, 13.95, 30.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (3, 32, 'MAGNOLIA', '0', 1, 1.00, 50.00, 88.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (3, 33, 'MAGNOLIA', '', 2, 1.00, 50.00, 88.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (3, 34, 'MAGNOLIA', '0', 3, 1.00, 50.00, 88.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (4, 24, '', '0', 1, 1.00, 16.00, 22.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (5, 4, '', '', 1, 1.00, 16.75, 26.00, 0.000);
INSERT INTO `phppos_sales_items` VALUES (5, 25, '', '', 2, 1.00, 20.18, 53.00, 0.000);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_items_taxes`
-- 

CREATE TABLE `phppos_sales_items_taxes` (
  `sale_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `line` int(3) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `percent` double(15,2) NOT NULL,
  PRIMARY KEY (`sale_id`,`item_id`,`line`,`name`,`percent`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_items_taxes`
-- 

INSERT INTO `phppos_sales_items_taxes` VALUES (1, 2, 1, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (2, 30, 1, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (2, 31, 2, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (3, 32, 1, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (3, 33, 2, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (3, 34, 3, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (4, 24, 1, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (5, 4, 1, 'IVA', 14.00);
INSERT INTO `phppos_sales_items_taxes` VALUES (5, 25, 2, 'IVA', 14.00);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_items_temp`
-- 

CREATE TABLE `phppos_sales_items_temp` (
  `sale_date` date DEFAULT NULL,
  `sale_id` int(10) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `payment_type` varchar(400) DEFAULT NULL,
  `customer_id` int(10) DEFAULT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `supplier_id` int(11) DEFAULT NULL,
  `quantity_purchased` double(15,2) NOT NULL DEFAULT '0.00',
  `item_cost_price` decimal(15,2) NOT NULL,
  `item_unit_price` double(15,2) NOT NULL,
  `item_tax_percent` double(19,2) DEFAULT NULL,
  `discount_percent` double(15,3) NOT NULL DEFAULT '0.000',
  `subtotal` double(24,7) DEFAULT NULL,
  `line` int(3) NOT NULL DEFAULT '0',
  `serialnumber` varchar(30) DEFAULT NULL,
  `description` varchar(250) DEFAULT NULL,
  `total` double(19,2) DEFAULT NULL,
  `tax` double(19,2) DEFAULT NULL,
  `profit` double(24,7) DEFAULT NULL,
  `almacen` varchar(255) DEFAULT NULL,
  `almacen_id` int(10) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_items_temp`
-- 

INSERT INTO `phppos_sales_items_temp` VALUES ('2016-11-16', 1, '', 'Efectivo: $28.50<br>', 1089, 180, 2, 1090, 1.00, 16.00, 25.00, 14.00, 0.000, 25.0000000, 1, '', '', 28.50, 3.50, 9.0000000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-11', 2, '', 'Cuentas por pagar: $94.62<br>', 1093, 298, 30, 1092, 1.00, 20.18, 53.00, 14.00, 0.000, 53.0000000, 1, '', '', 60.42, 7.42, 32.8200000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-11', 2, '', 'Cuentas por pagar: $94.62<br>', 1093, 298, 31, 1090, 1.00, 13.95, 30.00, 14.00, 0.000, 30.0000000, 2, '', '', 34.20, 4.20, 16.0500000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-14', 3, '', 'Efectivo: $310.00<br>', NULL, 298, 32, 1092, 1.00, 50.00, 88.00, 14.00, 0.000, 88.0000000, 1, '0', 'MAGNOLIA', 100.32, 12.32, 38.0000000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-14', 3, '', 'Efectivo: $310.00<br>', NULL, 298, 33, 1092, 1.00, 50.00, 88.00, 14.00, 0.000, 88.0000000, 2, '', 'MAGNOLIA', 100.32, 12.32, 38.0000000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-14', 3, '', 'Efectivo: $310.00<br>', NULL, 298, 34, 1092, 1.00, 50.00, 88.00, 14.00, 0.000, 88.0000000, 3, '0', 'MAGNOLIA', 100.32, 12.32, 38.0000000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-14', 4, '', 'Efectivo: $25.08<br>', 1093, 298, 24, 1090, 1.00, 16.00, 22.00, 14.00, 0.000, 22.0000000, 1, '0', '', 25.08, 3.08, 6.0000000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-15', 5, '', 'Acumulativo: $90.06<br>', NULL, 180, 4, 1090, 1.00, 16.75, 26.00, 14.00, 0.000, 26.0000000, 1, '', '', 29.64, 3.64, 9.2500000, 'Principal', 23);
INSERT INTO `phppos_sales_items_temp` VALUES ('2017-01-15', 5, '', 'Acumulativo: $90.06<br>', NULL, 180, 25, 1092, 1.00, 20.18, 53.00, 14.00, 0.000, 53.0000000, 2, '', '', 60.42, 7.42, 32.8200000, 'Principal', 23);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_payments`
-- 

CREATE TABLE `phppos_sales_payments` (
  `sale_id` int(10) NOT NULL,
  `payment_id` int(10) NOT NULL,
  `payment_amount` double(15,2) NOT NULL,
  PRIMARY KEY (`sale_id`,`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_payments`
-- 

INSERT INTO `phppos_sales_payments` VALUES (1, 2, 28.50);
INSERT INTO `phppos_sales_payments` VALUES (2, 21, 94.62);
INSERT INTO `phppos_sales_payments` VALUES (3, 2, 310.00);
INSERT INTO `phppos_sales_payments` VALUES (4, 2, 25.08);
INSERT INTO `phppos_sales_payments` VALUES (5, 23, 90.06);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_suspended`
-- 

CREATE TABLE `phppos_sales_suspended` (
  `sale_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` int(10) DEFAULT NULL,
  `employee_id` int(10) NOT NULL DEFAULT '0',
  `comment` text NOT NULL,
  `sale_id` int(10) NOT NULL AUTO_INCREMENT,
  `payment_type` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

-- 
-- Dumping data for table `phppos_sales_suspended`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_suspended_items`
-- 

CREATE TABLE `phppos_sales_suspended_items` (
  `sale_id` int(10) NOT NULL DEFAULT '0',
  `item_id` int(10) NOT NULL DEFAULT '0',
  `description` varchar(30) DEFAULT NULL,
  `serialnumber` varchar(30) DEFAULT NULL,
  `line` int(3) NOT NULL DEFAULT '0',
  `quantity_purchased` double(15,2) NOT NULL DEFAULT '0.00',
  `item_cost_price` decimal(15,2) NOT NULL,
  `item_unit_price` double(15,2) NOT NULL,
  `discount_percent` double(15,3) NOT NULL DEFAULT '0.000',
  PRIMARY KEY (`sale_id`,`item_id`,`line`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_suspended_items`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_suspended_items_taxes`
-- 

CREATE TABLE `phppos_sales_suspended_items_taxes` (
  `sale_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `line` int(3) NOT NULL DEFAULT '0',
  `name` varchar(255) NOT NULL,
  `percent` double(15,2) NOT NULL,
  PRIMARY KEY (`sale_id`,`item_id`,`line`,`name`,`percent`),
  KEY `item_id` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_suspended_items_taxes`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sales_suspended_payments`
-- 

CREATE TABLE `phppos_sales_suspended_payments` (
  `sale_id` int(10) NOT NULL,
  `payment_id` int(10) NOT NULL,
  `payment_amount` decimal(15,2) NOT NULL,
  PRIMARY KEY (`sale_id`,`payment_id`),
  KEY `phppos_sales_suspended_payments_ibfk_2` (`payment_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sales_suspended_payments`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_sessions`
-- 

CREATE TABLE `phppos_sessions` (
  `session_id` varchar(40) NOT NULL DEFAULT '0',
  `ip_address` varchar(16) NOT NULL DEFAULT '0',
  `user_agent` varchar(100) DEFAULT NULL,
  `last_activity` int(10) unsigned NOT NULL DEFAULT '0',
  `user_data` text,
  PRIMARY KEY (`session_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_sessions`
-- 

INSERT INTO `phppos_sessions` VALUES ('7fbf7d1c53e1da24a1f67ae9e104e42e', '0.0.0.0', 'Mozilla/5.0 (compatible; Uptimebot/1.0; +http://www.uptime.com/uptimebot)', 1488091858, '');
INSERT INTO `phppos_sessions` VALUES ('01697cd07ba5012c175459baf20d0b38', '0.0.0.0', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:51.0) Gecko/20100101 Firefox/51.0', 1488056311, '');

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_stock_almacenes`
-- 

CREATE TABLE `phppos_stock_almacenes` (
  `almacen_id` int(10) NOT NULL,
  `item_id` int(10) NOT NULL,
  `cantidad` double DEFAULT NULL,
  `fecha_actualiza` datetime DEFAULT NULL,
  PRIMARY KEY (`almacen_id`,`item_id`),
  KEY `fk_item_stock` (`item_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_stock_almacenes`
-- 

INSERT INTO `phppos_stock_almacenes` VALUES (23, 1, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 2, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 3, 18, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 4, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 5, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 6, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 7, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 8, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 9, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 10, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 11, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 12, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 13, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 14, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 15, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 16, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 17, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 18, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 19, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 20, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 21, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 22, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 23, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 24, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 25, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 26, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 27, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 28, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 29, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 30, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 31, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 32, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 33, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 34, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 35, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 36, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 37, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 38, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 39, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 40, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 41, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 42, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 43, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 44, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 45, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 46, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 47, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 48, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 49, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 50, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 51, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 52, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 53, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 54, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 55, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 56, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 57, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 58, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 59, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 60, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 61, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 62, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 63, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 64, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 65, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 66, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 67, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 68, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 69, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 70, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 71, 5, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 72, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 73, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 74, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 75, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 76, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 77, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 78, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 79, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 80, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 81, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 82, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 83, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 84, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 85, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 86, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 87, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 88, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 89, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 90, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 91, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 92, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 93, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 94, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 95, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 96, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 97, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 98, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 99, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 100, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 101, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 102, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 103, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 104, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 105, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 106, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 107, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 108, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 109, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 110, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 111, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 112, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 113, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 114, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 115, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 116, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 117, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 118, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 119, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 120, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 121, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 122, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 123, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 124, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 125, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 126, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 127, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 128, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 129, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 130, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 131, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 132, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 133, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 134, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 135, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 136, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 137, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 138, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 139, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 140, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 141, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 142, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 143, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 144, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 145, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 146, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 147, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 148, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 149, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 150, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 151, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 152, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 153, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 154, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 155, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 156, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 157, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 158, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 159, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 160, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 161, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 162, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 163, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 164, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 165, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 166, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 167, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 168, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 169, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 170, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 171, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 172, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 173, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 174, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 175, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 176, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 177, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 178, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 179, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 180, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 181, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 182, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 183, 5, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 184, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 185, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 186, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 187, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 188, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 189, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 190, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 191, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 192, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 193, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 194, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 195, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 196, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 197, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 198, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 199, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 200, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 201, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 202, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 203, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 204, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 205, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 206, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 207, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 208, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 209, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 210, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 211, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 212, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 213, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 214, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 215, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 216, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 217, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 218, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 219, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 220, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 221, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 222, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 223, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 224, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 225, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 226, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 227, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 228, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 229, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 230, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 231, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 232, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 233, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 234, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 235, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 236, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 237, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 238, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 239, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 240, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 241, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 242, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 243, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 244, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 245, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 246, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 247, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 248, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 249, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 250, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 251, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 252, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 253, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 254, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 255, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 256, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 257, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 258, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 259, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 260, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 261, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 262, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 263, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 264, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 265, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 266, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 267, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 268, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 269, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 270, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 271, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 272, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 273, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 274, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 275, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 276, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 277, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 278, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 279, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 280, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 281, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 282, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 283, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 284, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 285, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 286, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 287, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 288, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 289, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 290, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 291, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 292, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 293, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 294, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 295, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 296, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 297, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 298, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 299, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 300, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 301, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 302, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 303, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 304, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 305, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 306, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 307, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 308, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 309, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 310, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 311, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 312, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 313, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 314, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 315, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 316, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 317, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 318, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 319, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 320, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 321, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 322, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 323, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 324, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 325, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 326, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 327, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 328, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 329, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 330, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 331, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 332, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 333, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 334, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 335, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 336, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 337, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 338, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 339, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 340, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 341, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 342, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 343, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 344, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 345, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 346, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 347, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 348, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 349, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 350, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 351, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 352, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 353, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 354, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 355, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 356, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 357, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 358, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 359, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 360, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 361, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 362, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 363, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 364, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 365, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 366, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 367, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 368, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 369, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 370, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 371, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 372, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 373, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 374, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 375, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 376, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 377, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 378, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 379, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 380, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 381, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 382, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 383, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 384, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 385, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 386, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 387, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 388, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 389, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 390, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 391, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 392, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 393, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 394, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 395, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 396, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 397, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 398, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 399, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 400, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 401, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 402, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 403, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 404, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 405, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 406, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 407, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 408, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 409, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 410, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 411, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 412, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 413, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 414, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 415, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 416, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 417, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 418, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 419, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 420, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 421, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 422, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 423, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 424, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 425, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 426, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 427, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 428, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 429, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 430, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 431, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 432, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 433, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 434, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 435, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 436, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 437, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 438, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 439, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 440, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 441, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 442, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 443, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 444, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 445, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 446, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 447, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 448, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 449, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 450, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 451, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 452, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 453, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 454, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 455, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 456, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 457, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 458, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 459, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 460, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 461, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 462, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 463, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 464, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 465, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 466, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 467, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 468, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 469, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 470, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 471, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 472, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 473, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 474, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 475, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 476, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 477, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 478, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 479, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 480, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 481, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 482, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 483, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 484, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 485, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 486, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 487, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 488, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 489, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 490, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 491, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 492, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 493, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 494, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 495, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 496, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 497, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 498, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 499, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 500, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 501, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 502, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 503, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 504, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 505, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 506, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 507, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 508, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 509, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 510, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 511, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 512, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 513, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 514, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 515, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 516, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 517, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 518, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 519, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 520, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 521, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 522, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 523, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 524, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 525, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 526, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 527, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 528, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 529, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 530, 5, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 531, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 532, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 533, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 534, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 535, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 536, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 537, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 538, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 539, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 540, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 541, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 542, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 543, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 544, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 545, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 546, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 547, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 548, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 549, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 550, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 551, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 552, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 553, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 554, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 555, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 556, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 557, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 558, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 559, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 560, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 561, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 562, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 563, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 564, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 565, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 566, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 567, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 568, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 569, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 570, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 571, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 572, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 573, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 574, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 575, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 576, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 577, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 578, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 579, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 580, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 581, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 582, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 583, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 584, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 585, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 586, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 587, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 588, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 589, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 590, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 591, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 592, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 593, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 594, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 595, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 596, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 597, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 598, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 599, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 600, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 601, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 602, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 603, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 604, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 605, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 606, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 607, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 608, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 609, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 610, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 611, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 612, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 613, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 614, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 615, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 616, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 617, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 618, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 619, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 620, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 621, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 622, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 623, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 624, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 625, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 626, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 627, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 628, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 629, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 630, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 631, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 632, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 633, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 634, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 635, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 636, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 637, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 638, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 639, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 640, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 641, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 642, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 643, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 644, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 645, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 646, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 647, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 648, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 649, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 650, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 651, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 652, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 653, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 654, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 655, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 656, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 657, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 658, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 659, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 660, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 661, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 662, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 663, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 664, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 665, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 666, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 667, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 668, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 669, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 670, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 671, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 672, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 673, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 674, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 675, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 676, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 677, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 678, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 679, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 680, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 681, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 682, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 683, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 684, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 685, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 686, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 687, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 688, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 689, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 690, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 691, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 692, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 693, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 694, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 695, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 696, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 697, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 698, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 699, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 700, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 701, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 702, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 703, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 704, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 705, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 706, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 707, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 708, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 709, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 710, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 711, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 712, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 713, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 714, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 715, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 716, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 717, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 718, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 719, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 720, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 721, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 722, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 723, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 724, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 725, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 726, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 727, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 728, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 729, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 730, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 731, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 732, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 733, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 734, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 735, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 736, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 737, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 738, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 739, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 740, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 741, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 742, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 743, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 744, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 745, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 746, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 747, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 748, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 749, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 750, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 751, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 752, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 753, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 754, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 755, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 756, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 757, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 758, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 759, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 760, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 761, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 762, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 763, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 764, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 765, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 766, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 767, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 768, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 769, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 770, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 771, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 772, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 773, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 774, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 775, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 776, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 777, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 778, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 779, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 780, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 781, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 782, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 783, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 784, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 785, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 786, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 787, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 788, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 789, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 790, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 791, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 792, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 793, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 794, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 795, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 796, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 797, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 798, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 799, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 800, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 801, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 802, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 803, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 804, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 805, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 806, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 807, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 808, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 809, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 810, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 811, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 812, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 813, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 814, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 815, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 816, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 817, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 818, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 819, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 820, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 821, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 822, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 823, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 824, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 825, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 826, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 827, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 828, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 829, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 830, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 831, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 832, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 833, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 834, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 835, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 836, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 837, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 838, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 839, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 840, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 841, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 842, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 843, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 844, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 845, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 846, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 847, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 848, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 849, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 850, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 851, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 852, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 853, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 854, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 855, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 856, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 857, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 858, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 859, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 860, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 861, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 862, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 863, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 864, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 865, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 866, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 867, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 868, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 869, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 870, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 871, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 872, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 873, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 874, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 875, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 876, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 877, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 878, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 879, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 880, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 881, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 882, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 883, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 884, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 885, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 886, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 887, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 888, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 889, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 890, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 891, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 892, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 893, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 894, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 895, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 896, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 897, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 898, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 899, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 900, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 901, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 902, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 903, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 904, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 905, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 906, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 907, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 908, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 909, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 910, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 911, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 912, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 913, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 914, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 915, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 916, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 917, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 918, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 919, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 920, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 921, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 922, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 923, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 924, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 925, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 926, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 927, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 928, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 929, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 930, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 931, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 932, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 933, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 934, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 935, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 936, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 937, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 938, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 939, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 940, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 941, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 942, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 943, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 944, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 945, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 946, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 947, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 948, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 949, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 950, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 951, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 952, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 953, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 954, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 955, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 956, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 957, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 958, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 959, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 960, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 961, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 962, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 963, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 964, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 965, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 966, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 967, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 968, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 969, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 970, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 971, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 972, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 973, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 974, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 975, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 976, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 977, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 978, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 979, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 980, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 981, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 982, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 983, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 984, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 985, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 986, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 987, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 988, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 989, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 990, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 991, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 992, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 993, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 994, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 995, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 996, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 997, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 998, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 999, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1000, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1001, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1002, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1003, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1004, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1005, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1006, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1007, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1008, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1009, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1010, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1011, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1012, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1013, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1014, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1015, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1016, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1017, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1018, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1019, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1020, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1021, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1022, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1023, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1024, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1025, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1026, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1027, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1028, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1029, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1030, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1031, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1032, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1033, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1034, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1035, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1036, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1037, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1038, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1039, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1040, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1041, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1042, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1043, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1044, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1045, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1046, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1047, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1048, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1049, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1050, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1051, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1052, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1053, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1054, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1055, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1056, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1057, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1058, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1059, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1060, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1061, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1062, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1063, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1064, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1065, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1066, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1067, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1068, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1069, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1070, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1071, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1072, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1073, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1074, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1075, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1076, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1077, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1078, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1079, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1080, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1081, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1082, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1083, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1084, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1085, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1086, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1087, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1088, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1089, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1090, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1091, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1092, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1093, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1094, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1095, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1096, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1097, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1098, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1099, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1100, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1101, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1102, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1103, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1104, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1105, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1106, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1107, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1108, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1109, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1110, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1111, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1112, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1113, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1114, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1115, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1116, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1117, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1118, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1119, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1120, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1121, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1122, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1123, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1124, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1125, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1126, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1127, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1128, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1129, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1130, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1131, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1132, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1133, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1134, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1135, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1136, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1137, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1138, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1139, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1140, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1141, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1142, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1143, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1144, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1145, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1146, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1147, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1148, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1149, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1150, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1151, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1152, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1153, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1154, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1155, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1156, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1157, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1158, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1159, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1160, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1161, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1162, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1163, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1164, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1165, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1166, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1167, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1168, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1169, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1170, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1171, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1172, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1173, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1174, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1175, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1176, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1177, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1178, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1179, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1180, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1181, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1182, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1183, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1184, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1185, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1186, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1187, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1188, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1189, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1190, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1191, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1192, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1193, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1194, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1195, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1196, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1197, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1198, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1199, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1200, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1201, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1202, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1203, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1204, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1205, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1206, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1207, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1208, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1209, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1210, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1211, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1212, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1213, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1214, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1215, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1216, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1217, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1218, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1219, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1220, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1221, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1222, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1223, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1224, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1225, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1226, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1227, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1228, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1229, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1230, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1231, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1232, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1233, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1234, 5, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1235, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1236, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1237, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1238, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1239, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1240, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1241, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1242, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1243, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1244, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1245, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1246, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1247, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1248, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1249, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1250, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1251, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1252, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1253, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1254, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1255, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1256, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1257, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1258, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1259, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1260, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1261, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1262, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1263, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1264, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1265, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1266, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1267, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1268, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1269, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1270, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1271, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1272, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1273, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1274, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1275, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1276, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1277, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1278, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1279, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1280, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1281, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1282, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1283, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1284, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1285, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1286, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1287, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1288, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1289, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1290, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1291, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1292, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1293, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1294, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1295, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1296, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1297, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1298, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1299, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1300, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1301, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1302, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1303, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1304, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1305, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1306, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1307, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1308, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1309, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1310, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1311, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1312, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1313, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1314, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1315, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1316, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1317, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1318, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1319, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1320, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1321, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1322, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1323, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1324, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1325, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1326, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1327, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1328, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1329, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1330, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1331, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1332, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1333, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1334, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1335, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1336, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1337, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1338, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1339, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1340, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1341, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1342, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1343, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1344, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1345, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1346, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1347, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1348, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1349, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1350, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1351, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1352, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1353, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1354, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1355, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1356, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1357, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1358, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1359, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1360, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1361, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1362, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1363, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1364, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1365, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1366, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1367, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1368, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1369, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1370, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1371, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1372, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1373, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1374, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1375, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1376, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1377, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1378, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1379, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1380, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1381, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1382, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1383, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1384, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1385, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1386, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1387, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1388, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1389, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1390, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1391, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1392, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1393, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1394, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1395, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1396, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1397, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1398, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1399, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1400, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1401, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1402, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1403, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1404, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1405, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1406, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1407, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1408, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1409, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1410, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1411, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1412, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1413, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1414, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1415, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1416, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1417, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1418, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1419, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1420, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1421, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1422, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1423, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1424, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1425, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1426, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1427, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1428, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1429, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1430, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1431, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1432, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1433, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1434, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1435, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1436, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1437, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1438, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1439, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1440, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1441, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1442, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1443, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1444, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1445, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1446, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1447, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1448, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1449, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1450, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1451, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1452, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1453, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1454, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1455, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1456, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1457, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1458, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1459, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1460, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1461, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1462, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1463, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1464, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1465, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1466, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1467, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1468, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1469, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1470, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1471, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1472, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1473, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1474, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1475, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1476, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1477, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1478, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1479, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1480, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1481, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1482, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1483, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1484, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1485, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1486, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1487, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1488, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1489, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1490, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1491, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1492, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1493, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1494, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1495, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1496, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1497, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1498, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1499, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1500, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1501, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1502, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1503, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1504, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1505, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1506, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1507, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1508, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1509, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1510, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1511, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1512, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1513, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1514, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1515, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1516, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1517, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1518, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1519, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1520, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1521, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1522, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1523, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1524, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1525, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1526, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1527, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1528, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1529, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1530, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1531, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1532, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1533, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1534, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1535, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1536, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1537, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1538, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1539, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1540, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1541, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1542, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1543, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1544, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1545, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1546, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1547, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1548, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1549, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1550, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1551, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1552, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1553, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1554, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1555, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1556, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1557, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1558, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1559, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1560, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1561, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1562, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1563, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1564, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1565, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1566, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1567, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1568, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1569, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1570, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1571, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1572, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1573, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1574, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1575, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1576, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1577, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1578, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1579, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1580, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1581, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1582, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1583, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1584, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1585, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1586, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1587, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1588, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1589, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1590, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1591, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1592, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1593, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1594, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1595, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1596, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1597, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1598, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1599, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1600, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1601, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1602, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1603, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1604, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1605, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1606, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1607, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1608, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1609, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1610, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1611, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1612, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1613, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1614, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1615, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1616, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1617, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1618, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1619, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1620, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1621, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1622, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1623, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1624, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1625, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1626, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1627, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1628, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1629, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1630, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1631, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1632, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1633, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1634, 0, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1635, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1636, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1637, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1638, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1639, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1640, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1641, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1642, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1643, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1644, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1645, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1646, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1647, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1648, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1649, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1650, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1651, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1652, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1653, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1654, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1655, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1656, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1657, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1658, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1659, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1660, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1661, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1662, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1663, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1664, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1665, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1666, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1667, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1668, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1669, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1670, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1671, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1672, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1673, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1674, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1675, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1676, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1677, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1678, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1679, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1680, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1681, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1682, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1683, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1684, 5, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1685, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1686, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1687, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1688, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1689, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1690, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1691, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1692, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1693, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1694, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1695, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1696, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1697, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1698, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1699, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1700, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1701, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1702, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1703, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1704, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1705, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1706, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1707, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1708, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1709, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1710, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1711, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1712, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1713, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1714, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1715, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1716, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1717, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1718, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1719, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1720, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1721, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1722, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1723, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1724, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1725, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1726, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1727, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1728, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1729, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1730, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1731, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1732, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1733, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1734, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1735, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1736, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1737, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1738, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1739, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1740, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1741, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1742, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1743, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1744, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1745, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1746, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1747, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1748, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1749, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1750, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1751, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1752, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1753, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1754, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1755, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1756, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1757, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1758, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1759, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1760, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1761, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1762, 4, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1763, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1764, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1765, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1766, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1767, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1768, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1769, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1770, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1771, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1772, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1773, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1774, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1775, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1776, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1777, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1778, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1779, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1780, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1781, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1782, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1783, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1784, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1785, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1786, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1787, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1788, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1789, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1790, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1791, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1792, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1793, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1794, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1795, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1796, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1797, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1798, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1799, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1800, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1801, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1802, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1803, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1804, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1805, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1806, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1807, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1808, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1809, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1810, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1811, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1812, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1813, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1814, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1815, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1816, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1817, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1818, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1819, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1820, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1821, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1822, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1823, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1824, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1825, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1826, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1827, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1828, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1829, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1830, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1831, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1832, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1833, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1834, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1835, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1836, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1837, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1838, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1839, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1840, 3, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1841, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1842, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1843, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1844, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1845, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1846, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1847, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1848, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1849, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1850, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1851, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1852, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1853, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1854, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1855, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1856, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1857, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1858, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1859, 1, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1860, 2, '2015-05-24 11:26:29');
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1861, 5, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (23, 1862, 10, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 3, 10, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 24, 1, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 35, 1, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 36, 2, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 37, 1, NULL);
INSERT INTO `phppos_stock_almacenes` VALUES (31, 38, 1, NULL);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_suppliers`
-- 

CREATE TABLE `phppos_suppliers` (
  `person_id` int(10) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `deleted` int(1) NOT NULL DEFAULT '0',
  UNIQUE KEY `account_number` (`account_number`),
  KEY `person_id` (`person_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `phppos_suppliers`
-- 

INSERT INTO `phppos_suppliers` VALUES (1090, 'INDUCALZA', NULL, 0);
INSERT INTO `phppos_suppliers` VALUES (1091, 'BUESTAN', NULL, 0);
INSERT INTO `phppos_suppliers` VALUES (1092, 'DINGROUP', NULL, 0);
INSERT INTO `phppos_suppliers` VALUES (1095, 'SHOES&SHOES', NULL, 0);
INSERT INTO `phppos_suppliers` VALUES (1096, 'IMBRACAL', NULL, 0);
INSERT INTO `phppos_suppliers` VALUES (1097, 'LUZCASPORT', NULL, 0);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_webusers`
-- 

CREATE TABLE `phppos_webusers` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `customer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

-- 
-- Dumping data for table `phppos_webusers`
-- 

INSERT INTO `phppos_webusers` VALUES (1, 'test', 'test', 'test@test.com', '25d55ad283aa400af464c76d713c07ad', '2015-03-24 15:44:55', NULL);
INSERT INTO `phppos_webusers` VALUES (2, 'Mario', 'Torres', 'mariofertc@mixmail.com', '552d1156a9b3071181ed713ad028be73', '2015-04-07 12:14:28', NULL);
INSERT INTO `phppos_webusers` VALUES (3, 'tester', 'tester', 'testing@test.com', '25d55ad283aa400af464c76d713c07ad', '2015-04-07 19:36:14', NULL);

-- --------------------------------------------------------

-- 
-- Table structure for table `phppos_wishlist`
-- 

CREATE TABLE `phppos_wishlist` (
  `wlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `fecha_agregado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wlist_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

-- 
-- Dumping data for table `phppos_wishlist`
-- 

INSERT INTO `phppos_wishlist` VALUES (2, 3, 2, '2015-04-08 18:15:08');
