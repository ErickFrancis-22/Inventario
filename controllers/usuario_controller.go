package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)	

func ObtenerUsuarios(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, nombre, email, password_hash, rol_id FROM usuarios")
	if err != nil {
		//Debugueo de errores en la consulta de usuarios
		log.Printf("Error real de PostgreSQL al hacer SELECT: %v\n", err)
		//Erro 503 en el frontend si falla la DB
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	//Defer es ara asegurarse que la conexión se cerró al terminar la función
	defer filas.Close()

	//Preparar una slice
	var usuarios []models.Usuario

	for filas.Next() {
		var usr models.Usuario
		err := filas.Scan(&usr.ID, &usr.Nombre, &usr.Email, &usr.PasswordHash, &usr.RolID)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		usuarios = append(usuarios, usr)
	}

	err = json.NewEncoder(w).Encode(usuarios)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearUsuario(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevoUsuario models.Usuario			

	err := json.NewDecoder(r.Body).Decode(&nuevoUsuario)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

sqlStatement := `INSERT INTO usuarios (nombre, email, password_hash, rol_id) VALUES ($1, $2, $3, $4) RETURNING id`

var idInsertado int
err = database.DB.QueryRow(sqlStatement, nuevoUsuario.Nombre, nuevoUsuario.Email, nuevoUsuario.PasswordHash, nuevoUsuario.RolID).Scan(&idInsertado)
	if err != nil {
		//Prueba para el debugueo de errores en la inserción de usuarios
		log.Printf("Error de PostgreSQL al insertar usuario: %v\n", err)
		
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevoUsuario.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevoUsuario)
}