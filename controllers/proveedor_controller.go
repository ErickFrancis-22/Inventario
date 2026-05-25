package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)

func ObtenerProveedores(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, nombre, contacto, telefono FROM proveedores")
	if err != nil {
		//Erro 503 en el frontend si falla la DB
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	//Defer es ara asegurarse que la conexión se cerró al terminar la función
	defer filas.Close()

	//Preparar una slice
	var proveedores []models.Proveedor

	for filas.Next() {
		var cat models.Proveedor
		err := filas.Scan(&cat.ID, &cat.Nombre, &cat.Contacto, &cat.Telefono)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		proveedores = append(proveedores, cat)
	}

	err = json.NewEncoder(w).Encode(proveedores)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearProveedor(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevoProveedor models.Proveedor

	err := json.NewDecoder(r.Body).Decode(&nuevoProveedor)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

sqlStatement := `INSERT INTO proveedores (nombre, contacto, telefono) VALUES ($1, $2, $3) RETURNING id`

var idInsertado int
err = database.DB.QueryRow(sqlStatement, nuevoProveedor.Nombre, nuevoProveedor.Contacto, nuevoProveedor.Telefono).Scan(&idInsertado)
	if err != nil {
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevoProveedor.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevoProveedor)
}
