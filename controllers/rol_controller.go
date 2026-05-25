package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)

func ObtenerRoles(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, nombre FROM roles")
	if err != nil {
		//Debugueo de errores en la consulta de productos
		log.Printf("Error real de PostgreSQL al hacer SELECT: %v\n", err)
		//Erro 503 en el frontend si falla la DB
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	//Defer es ara asegurarse que la conexión se cerró al terminar la función
	defer filas.Close()

	//Preparar una slice
	var roles []models.Rol

	for filas.Next() {
		var rol models.Rol
		err := filas.Scan(&rol.ID, &rol.Nombre)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		roles = append(roles, rol)
	}

	err = json.NewEncoder(w).Encode(roles)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearRol(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevoRol models.Rol			

	err := json.NewDecoder(r.Body).Decode(&nuevoRol)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

sqlStatement := `INSERT INTO roles (nombre) VALUES ($1) RETURNING id`

var idInsertado int
err = database.DB.QueryRow(sqlStatement, nuevoRol.Nombre).Scan(&idInsertado)
	if err != nil {
		//Prueba para el debugueo de errores en la inserción de roles
		log.Printf("Error de PostgreSQL al insertar rol: %v\n", err)
		
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevoRol.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevoRol)
}