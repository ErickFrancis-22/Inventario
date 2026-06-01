package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt" // <-- ¡Librería vital para imprimir en la consola!
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var miLlaveSecreta = []byte("clave_maestra_super_secreta_desksv_2026")

type SolicitudLogin struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type ClaimsUsuario struct {
	UsuarioID int    `json:"usuario_id"`
	Rol       string `json:"rol"`
	jwt.RegisteredClaims
}

func Login(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Método no permitido", http.StatusMethodNotAllowed)
			return
		}

		var creds SolicitudLogin
		err := json.NewDecoder(r.Body).Decode(&creds)
		if err != nil {
			http.Error(w, "Formato de datos inválido", http.StatusBadRequest)
			return
		}

		// 1. Buscar al usuario en PostgreSQL por su email
		var idDB int
		var passwordHashDB string
		var rolID_DB int // Tu tabla usa un INT para el rol

		// Usamos tus nombres de columnas exactos
		query := "SELECT id, password_hash, rol_id FROM usuarios WHERE email = $1"
		err = db.QueryRow(query, creds.Email).Scan(&idDB, &passwordHashDB, &rolID_DB)

		if err != nil {
			if err == sql.ErrNoRows {
				http.Error(w, "Credenciales incorrectas", http.StatusUnauthorized)
			} else {
				fmt.Println("🚨 ERROR SQL EN LOGIN:", err)
				http.Error(w, "Error interno del servidor", http.StatusInternalServerError)
			}
			return
		}

		// 2. Comparar la contraseña en texto plano con el hash seguro
		err = bcrypt.CompareHashAndPassword([]byte(passwordHashDB), []byte(creds.Password))
		if err != nil {
			fmt.Println("🚨 ERROR BCRYPT EN LOGIN:", err)
			http.Error(w, "Credenciales incorrectas", http.StatusUnauthorized)
			return
		}

		// 3. Preparamos el Pase VIP
		tiempoExpiracion := time.Now().Add(2 * time.Hour)
		claims := &ClaimsUsuario{
			UsuarioID: idDB,
			Rol:       fmt.Sprintf("%d", rolID_DB), // Convertimos el ID del rol a texto para el Token
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(tiempoExpiracion),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(miLlaveSecreta)
		if err != nil {
			fmt.Println("🚨 ERROR JWT EN LOGIN:", err)
			http.Error(w, "Error al generar el acceso", http.StatusInternalServerError)
			return
		}

		// 4. Respondemos al Frontend
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"token": tokenString,
			"rol":   fmt.Sprintf("%d", rolID_DB),
		})
	}
}