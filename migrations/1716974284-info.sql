CREATE TABLE info (
	id INT AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	PRIMARY KEY (id)
);

ALTER TABLE info
ADD COLUMN surname varchar(255) NULL,
ADD COLUMN fiscalcode varchar(255) NULL;