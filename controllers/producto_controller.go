package controllers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)

func ObtenerProductos(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, sku, nombre, precio, categoria_id, proveedor_id  FROM productos")
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
	var productos []models.Producto

	for filas.Next() {
		var prod models.Producto
		err := filas.Scan(&prod.ID, &prod.Sku, &prod.Nombre, &prod.Precio, &prod.CategoriaID, &prod.ProveedorID)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		productos = append(productos, prod)
	}

	err = json.NewEncoder(w).Encode(productos)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearProducto(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevoProducto models.Producto		

	err := json.NewDecoder(r.Body).Decode(&nuevoProducto)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

sqlStatement := `INSERT INTO productos (sku, nombre, precio, categoria_id, proveedor_id) VALUES ($1, $2, $3, $4, $5) RETURNING id`

var idInsertado int
err = database.DB.QueryRow(sqlStatement, nuevoProducto.Sku, nuevoProducto.Nombre, nuevoProducto.Precio, nuevoProducto.CategoriaID, nuevoProducto.ProveedorID).Scan(&idInsertado)
	if err != nil {
		//Prueba para el debugueo de errores en la inserción de productos
		log.Printf("Error de PostgreSQL al insertar producto: %v\n", err)
		
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevoProducto.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevoProducto)
}