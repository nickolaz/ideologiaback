
CREATE ROLE ideologica WITH
	LOGIN
	SUPERUSER
	CREATEDB
	CREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD 'md5b7bb3651856794531aa0582ed2f58db9';
	
CREATE DATABASE db_ideologica
    WITH 
    OWNER = ideologica
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

drop  table  usuario;
	
create table usuario(
    userName varchar(20) primary key ,
    nombre varchar(30) not null ,
    password varchar(128) not null,
    fechaIns timestamp default now() not null
);

insert into usuario(userName, nombre, password)
values ('admin','Usuario Administrador',
    '$2b$10$q/QsMev5hYthzZ3LLBA8eeWbJM0Cw9xAvXvxO5mZdC5gHQ80Q46SG');

drop table ong;

create table ong(
    nombre varchar(50) primary key,
    direccion varchar(100),
    telefono varchar(20) , 
    mail varchar(100),
    director varchar(100),
    instagram varchar(100),
    twitter varchar(100),
    contacto varchar(100),
    web varchar(100),
    fecha_creacion varchar(20)
);

select nombre,direccion,telefono,mail,director,instagram,twitter,contacto,web,fecha_creacion from ong;

drop table investigacion;

create table investigacion(
    id serial,
    ong varchar(50),
    pregunta varchar(50),
    respuesta varchar(50)
);

drop table semaforo;

create table semaforo(
    ong varchar(50) primary key,
    ideologia varchar(100),
    publicaciones varchar(200),
    relacion varchar(100),
    fuente varchar(200)
);

select ong,ideologia,publicaciones,relacion,fuente from semaforo;