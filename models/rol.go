package models

//Roles de acceso al sistema
type Rol struct {
	ID 		int `json:"id" db:"id"`
	Nombre 	string `json:"nombre" db:"nombre"`
}