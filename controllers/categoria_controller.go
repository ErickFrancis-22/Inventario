package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)

func ObtenerCategorias(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, nombre, descripcion FROM categorias")
	if err != nil {
		//Erro 503 en el frontend si falla la DB
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}
	//Defer es ara asegurarse que la conexión se cerró al terminar la función
	defer filas.Close()

	//Preparar una slice
	var categorias []models.Categoria

	for filas.Next() {
		var cat models.Categoria
		err := filas.Scan(&cat.ID, &cat.Nombre, &cat.Descripcion)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		categorias = append(categorias, cat)
	}

	err = json.NewEncoder(w).Encode(categorias)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearCategoria(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevaCategoria models.Categoria

	err := json.NewDecoder(r.Body).Decode(&nuevaCategoria)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

sqlStatement := `INSERT INTO categorias (nombre, descripcion) VALUES ($1, $2) RETURNING id`

var idInsertado int
err = database.DB.QueryRow(sqlStatement, nuevaCategoria.Nombre, nuevaCategoria.Descripcion).Scan(&idInsertado)
	if err != nil {
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevaCategoria.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevaCategoria)
}