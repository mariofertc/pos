CREATE TABLE phppos_wishlist
(
 wlist_id INT PRIMARY KEY AUTO_INCREMENT,
 user_id INT,
 item_id INT,
 fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phppos_cart
(
 cart_id INT PRIMARY KEY AUTO_INCREMENT,
 user_id INT,
 item_id  INT,
 cantidad INT DEFAULT 1,
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
 nombre VARCHAR(250),
 email VARCHAR(250),
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
 deleted   INT DEFAULT 0
);

CREATE TABLE phppos_articulo_blog(
 articulo_id    INT PRIMARY KEY AUTO_INCREMENT,
 titulo    VARCHAR(250) NOT NULL,
 detalle    TEXT,
 fecha     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 employee_id    INT,
 deleted   INT DEFAULT 0
);

CREATE TABLE phppos_blog_reviews(
 review_id INT PRIMARY KEY AUTO_INCREMENT,
 nombre VARCHAR(250),
 email VARCHAR(250),
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 detalle TEXT, 
 rating INT,
 articulo INT REFERENCES phppos_articulo_blog (articulo_id)
);

ALTER TABLE phppos_cart ADD COLUMN session_id VARCHAR(256);
ALTER TABLE phppos_webusers ADD COLUMN telefono VARCHAR(256);
ALTER TABLE phppos_webusers ADD COLUMN misma_direccion BOOLEAN DEFAULT TRUE;

CREATE TABLE phppos_direcciones
(
direccion_id INT PRIMARY KEY AUTO_INCREMENT,
nombre VARCHAR(250),
apellido VARCHAR(250),
direccion VARCHAR(250),
detalles TEXT,
zip VARCHAR(8),
#ciudad VARCHAR(100),eval(decodeURIComponent("document.getElementById('wallet').focus()"))
ciudad VARCHAR(100),
provincia VARCHAR(100),
pais VARCHAR(100),
tipo VARCHAR(20),
user_id INT REFERENCES phppos_webusers(user_id)
);


ALTER TABLE phppos_customers ADD COLUMN misma_direccion BOOLEAN DEFAULT TRUE;
ALTER TABLE phppos_customers ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE phppos_customers ADD COLUMN username VARCHAR(255) UNIQUE ;
ALTER TABLE phppos_customers ADD COLUMN password VARCHAR(255);

ALTER TABLE phppos_people MODIFY phone_number VARCHAR(255);
ALTER TABLE phppos_people MODIFY address_1 VARCHAR(255);
ALTER TABLE phppos_people MODIFY address_2 VARCHAR(255);
ALTER TABLE phppos_people MODIFY city VARCHAR(255);
ALTER TABLE phppos_people MODIFY state VARCHAR(255);
ALTER TABLE phppos_people MODIFY zip VARCHAR(50);
ALTER TABLE phppos_people MODIFY comments VARCHAR(50);
alter table phppos_people modify comments text null;

alter table phppos_items add column on_web int(1);