
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
    nombre varchar(30) ,
    password varchar(128) not null,
    tipo varchar(1),
    fechaIns timestamp default now()
);

insert into usuario(userName, nombre, password, tipo)
values ('admin','Usuario Administrador',
    '$2b$10$q/QsMev5hYthzZ3LLBA8eeWbJM0Cw9xAvXvxO5mZdC5gHQ80Q46SG' , 'A');

drop table ong;

create table ong(
    nombre varchar(1000) primary key,
    direccion varchar(1000),
    telefono varchar(1000) , 
    mail varchar(1000),
    director varchar(1000),
    instagram varchar(1000),
    twitter varchar(1000),
    contacto varchar(1000),
    web varchar(1000),
    fecha_creacion varchar(20)
);

select nombre,direccion,telefono,mail,director,instagram,twitter,contacto,web,fecha_creacion from ong;

drop table investigacion;

create table investigacion(
    id serial,
    ong varchar(1000),
    pregunta varchar(1000),
    respuesta varchar(1000)
);

drop table semaforo;

create table semaforo(
    ong varchar(1000) primary key,
    ideologia varchar(1000),
    publicaciones varchar(1000),
    relacion varchar(1000),
    fuente varchar(1000)
);

select ong,ideologia,publicaciones,relacion,fuente from semaforo;