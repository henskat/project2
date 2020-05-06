DROP DATABASE IF EXISTS pictures;
DROP USER IF EXISTS pictures_admin@localhost;

CREATE DATABASE pictures CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER pictures_admin@localhost IDENTIFIED BY 'fly87m4dDY&Ta3s*ng!';
GRANT ALL PRIVILEGES ON pictures.* TO pictures_admin@localhost; 

