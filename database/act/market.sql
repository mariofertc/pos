CREATE TABLE phppos_webusers
(
	user_id    INT PRIMARY KEY AUTO_INCREMENT,
	nombre    VARCHAR(255),
	apellido  VARCHAR(255),
	email    VARCHAR(255) UNIQUE,
	password VARCHAR(255),
	fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE phppos_whishlist
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
