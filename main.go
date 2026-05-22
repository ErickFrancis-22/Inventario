package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/controllers"
	"github.com/ErickFrancis-22/inventario-api/database" //Enlace del repositorio del GitHub
)

func main() {
	fmt.Println("Iniciando la API de Inventario...")

	// Conexión y preparación de base de datos
	database.ConnectDB()
	database.CrearTablas()

	//Endpoints
	// Delegamos la ruta "/categorias" a nuestro controlador
	http.HandleFunc("/categorias", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerCategorias(w, r)
		case http.MethodPost:
			controllers.CrearCategoria(w, r)
		default:
			// Si intentan usar un método raro (PUT, DELETE) que aún no configuramos:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	})

	//para manetner encendido el servidor
	fmt.Println("El servidor está escuchando en: http://localhost:8080")
	
	// ¡Esta es la línea vital que mantiene el programa vivo!
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Error al iniciar el servidor: %v\n", err)
	}
}
