package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ErickFrancis-22/inventario-api/controllers"
	"github.com/ErickFrancis-22/inventario-api/database" //Enlace del repositorio del GitHub
	"golang.org/x/crypto/bcrypt"
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
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	})

	// Delegamos la ruta "/proveedores" a nuestro controlador
	http.HandleFunc("/proveedores", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerProveedores(w, r)
		case http.MethodPost:
			controllers.CrearProveedor(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	})		

	// Delegamos la ruta "/productos" a nuestro controlador
	http.HandleFunc("/productos", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerProductos(w, r)
		case http.MethodPost:
			controllers.CrearProducto(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	})	

	// Delegamos la ruta "/roles" a nuestro controlador
	http.HandleFunc("/roles", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend	
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerRoles(w, r)		
		case http.MethodPost:
			controllers.CrearRol(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}	
	})

	// Delegamos la ruta "/usuarios" a nuestro controlador
	http.HandleFunc("/usuarios", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend	
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerUsuarios(w, r)
		case http.MethodPost:	
			controllers.CrearUsuario(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}	
	})

	// Delegamos la ruta "/movimientos" a nuestro controlador
	http.HandleFunc("/movimientos", func(w http.ResponseWriter, r *http.Request) {
		// Evaluamos qué método HTTP está usando el Frontend	
		switch r.Method {
		case http.MethodGet:
			controllers.ObtenerMovimientos(w, r)	
		case http.MethodPost:	
			controllers.CrearMovimiento(w, r)
		default:
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}	
	})

	http.HandleFunc("/stock",func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			controllers.ObtenerStock(w, r)
		} else {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/login", controllers.Login(database.DB))
	

	//Crear un usuario admin por defecto (si no existe) para facilitar el acceso inicial al sistema
	hashSecreto, _ := bcrypt.GenerateFromPassword([]byte("admin123"), 10)
	
	// Columnas de la tabla: nombre, email, password_hash, rol_id
	_, errAdmin := database.DB.Exec(`
		INSERT INTO usuarios (nombre, email, password_hash, rol_id) 
		VALUES ($1, $2, $3, $4) 
		ON CONFLICT (email) DO NOTHING
	`, "Admin Principal", "admin@techsocietysv.com", string(hashSecreto), 1)

	if errAdmin != nil {
		fmt.Println("🚨 Error al crear el admin:", errAdmin)
	} else {
		fmt.Println("✅ Usuario admin verificado en la base de datos.")
	}

	fmt.Println("El servidor está escuchando en: http://localhost:8080")
	
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatalf("Error al iniciar el servidor: %v\n", err)
	}
} 
