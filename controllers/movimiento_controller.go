package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/ErickFrancis-22/inventario-api/database"
	"github.com/ErickFrancis-22/inventario-api/models"
)	

func ObtenerMovimientos(w http.ResponseWriter, r *http.Request) {
	//Cabecera que respoden al json
	w.Header().Set("Content-Type", "application/json")

	//Consulta sql 
	filas, err := database.DB.Query("SELECT id, producto_id, usuario_id, tipo, cantidad, fecha_creacion FROM movimiento_inventario")
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
	var movimientos []models.Movimiento

	for filas.Next() {
		var mov models.Movimiento
		err := filas.Scan(&mov.ID, &mov.ProductoID, &mov.UsuarioID, &mov.Tipo, &mov.Cantidad, &mov.FechaCreacion)
		if err != nil {
			log.Println("Error al leer una fila", err)
			continue
		}

		//Agregar la categoría a la fila 
		movimientos = append(movimientos, mov)
	}

	err = json.NewEncoder(w).Encode(movimientos)
	if err != nil {
		http.Error(w, "Error al formatear el JSON", http.StatusInternalServerError)
	}

}

func CrearMovimiento(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var nuevoMovimiento models.Movimiento		

	err := json.NewDecoder(r.Body).Decode(&nuevoMovimiento)
	if err != nil {
		http.Error(w, "Datos inválidos", http.StatusBadRequest)
		return
	}

	// 1. Go captura la hora exacta y se la asigna a nuestro objeto
	nuevoMovimiento.FechaCreacion = time.Now()

	// 2. Modificamos el SQL para enviar esa 5ta variable (fecha_creacion)
	sqlStatement := `INSERT INTO movimiento_inventario (producto_id, usuario_id, tipo, cantidad, fecha_creacion) VALUES ($1, $2, $3, $4, $5) RETURNING id`

	var idInsertado int
	// 3. Pasamos nuevoMovimiento.FechaCreacion como el 5to parámetro ($5)
	err = database.DB.QueryRow(sqlStatement, nuevoMovimiento.ProductoID, nuevoMovimiento.UsuarioID, nuevoMovimiento.Tipo, nuevoMovimiento.Cantidad, nuevoMovimiento.FechaCreacion).Scan(&idInsertado)
	if err != nil {
		log.Printf("Error al insertar movimiento: %v\n", err)
		http.Error(w, "Error al guardar en la base de datos", http.StatusInternalServerError)
		return
	}

	//Asignamos el ID nuevo a nuestro objeto y respondemos con éxito
	nuevoMovimiento.ID = idInsertado
	
	w.WriteHeader(http.StatusCreated) //Enviamos un código 201 (Creado)
	json.NewEncoder(w).Encode(nuevoMovimiento)
}

// ObtenerStock calcula la cantidad real de un producto basado en sus movimientos
func ObtenerStock(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// 1. Extraemos el ID del producto desde la URL (ejemplo: /stock?id=1)
	productoID := r.URL.Query().Get("id")
	if productoID == "" {
		http.Error(w, "Falta el ID del producto en la URL", http.StatusBadRequest)
		return
	}

	// 2. La consulta matemática estrella
	// Si es entrada, suma. Si es salida, resta. COALESCE asegura que devuelva 0 si no hay nada.
	sqlStatement := `
		SELECT COALESCE(SUM(
			CASE 
				WHEN tipo = 'entrada' THEN cantidad 
				WHEN tipo = 'salida' THEN -cantidad 
				ELSE 0 
			END
		), 0) AS stock_total 
		FROM movimiento_inventario 
		WHERE producto_id = $1`

	var stockTotal int

	// 3. Ejecutamos la consulta y guardamos el resultado matemático en la variable
	err := database.DB.QueryRow(sqlStatement, productoID).Scan(&stockTotal)
	if err != nil {
		log.Printf("Error al calcular el stock: %v\n", err)
		http.Error(w, "Error al consultar la base de datos", http.StatusInternalServerError)
		return
	}

	// 4. Armamos un JSON rápido "al vuelo" para responderle al Frontend
	respuesta := map[string]interface{}{
		"producto_id": productoID,
		"stock_real":  stockTotal,
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(respuesta)
}