CREATE TABLE phppos_webusers
(
	user_id    INT PRIMARY KEY AUTO_INCREMENT,
	nombre    VARCHAR(255),
	apellido  VARCHAR(255),
	email    VARCHAR(255) UNIQUE,
	password VARCHAR(255),
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phppos_wishlist
(
	wlist_id 	INT PRIMARY KEY AUTO_INCREMENT,
	user_id 	INT,
	item_id		INT,
	fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phppos_cart
(
	cart_id INT PRIMARY KEY AUTO_INCREMENT,
	user_id 	INT,
	item_id		INT,
	cantidad	INT DEFAULT 1,
	fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phppos_paypal (
   order_id  int(11) PRIMARY KEY AUTO_INCREMENT,
   user_id  varchar(254) NOT NULL,
   payment_id  varchar(50) DEFAULT NULL,
   estado  varchar(20) DEFAULT NULL,
   valor  varchar(20) DEFAULT NULL,
   descripcion  varchar(40) DEFAULT NULL,
   fecha_creacion  datetime DEFAULT NULL
);

ALTER TABLE phppos_webusers ADD COLUMN customer_id INT;

CREATE TABLE phppos_product_reviews(
 review_id INT PRIMARY KEY AUTO_INCREMENT,
 nombre	VARCHAR(250),
 email	VARCHAR(250),
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 detalle TEXT, 
 rating INT,
 item INT REFERENCES phppos_items (item_id)
);

CREATE TABLE phppos_lanzamientos(
	lanzamiento_id    INT PRIMARY KEY AUTO_INCREMENT,
	titulo    VARCHAR(250) NOT NULL,
	detalle    TEXT,
	fecha     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	item_id    INT,
	activo     INT DEFAULT 1,
	deleted	  INT DEFAULT 0
);
