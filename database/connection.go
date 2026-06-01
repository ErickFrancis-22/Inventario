package database

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq" //_ ->Importa el diver par que GO lo registre en memoria, pero no se llaman sus funciones directamente
)

var DB *sql.DB //Variable global que guradará el Pool "conexiones"

func ConnectDB() {
	//Ocultar esto en las variables de entorno
	//Datos de conexión don la DB
	dsn := "host=db port=5432 user=postgres password=fran21$23 dbname=inventario sslmode=disable"

	//Establecer la conexión
	var err error
	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Error al abrir la base de datos: %v\n", err)
	}

	//Verificar que hay conexión con el servidor
	err = DB.Ping()
	if err != nil {
		log.Fatalf("La base de datos no responde: %v\n", err)
	}

	DB.SetMaxOpenConns(25) //Máximo de 25 peticiones simultáneas con la base de datos
	DB.SetMaxIdleConns(25) //Mantener las 25 conexiones en segundo plano
	DB.SetConnMaxLifetime(5 * time.Minute) //Renueva las conexiones cada 5 minutos

	fmt.Println("¡Conexión a la base de datos establecida con éxito!")
}

func CrearTablas() {
	query := `
	CREATE TABLE IF NOT EXISTS roles (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(50) NOT NULL
	);

	CREATE TABLE IF NOT EXISTS categorias (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		descripcion TEXT
	);

	CREATE TABLE IF NOT EXISTS proveedores (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		contacto VARCHAR(100),
		telefono VARCHAR(20)
	);

	CREATE TABLE IF NOT EXISTS usuarios (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(100) NOT NULL,
		email VARCHAR(100) UNIQUE NOT NULL,
		password_hash VARCHAR(255) NOT NULL,
		rol_id INT REFERENCES roles(id)

	);

	CREATE TABLE IF NOT EXISTS productos (
		id SERIAL PRIMARY KEY,
		sku VARCHAR(100) UNIQUE NOT NULL,
		nombre VARCHAR(100) NOT NULL,
		precio DECIMAL(10,2) NOT NULL,
		categoria_id INT REFERENCES categorias(id),
		proveedor_id INT REFERENCES proveedores(id)
	);

	CREATE TABLE IF NOT EXISTS movimiento_inventario (
		id SERIAL PRIMARY KEY,
		producto_id INT REFERENCES productos(id),
		usuario_id INT REFERENCES usuarios(id),
		tipo VARCHAR(100) NOT NULL,
		cantidad INT NOT NULL,
		fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := DB.Exec(query)
	if err != nil {
		log.Fatalf("Error creando las tablas: %v\n", err)
	}

	fmt.Println("Tablas verificadas/creadas correctamente en la base de datos.")
}

