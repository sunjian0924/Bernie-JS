create database Bernie;

use Bernie;

create table academics (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        courseID varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );

create table admins (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        password varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );

create table clientcourses (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        courseID varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );

create table clienttimes (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        time varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );

create table tutortimes (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        time varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );

create table hiredtutors (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        expertise varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );


create table appointments (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        MUid varchar(255) NOT NULL,
        courseID varchar(255) NOT NULL,
        time varchar(255) NOT NULL,
        customer varchar(255) NOT NULL,
        updated_at varchar(255) NOT NULL
        );







