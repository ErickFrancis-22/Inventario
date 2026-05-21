package models

type Usuario struct {
	ID           int    `json:"id" db:"id"`
	Nombre       string `json:"nombre" db:"nombre"`
	Email        string `json:"email" db:"email "`
	PasswordHash string `json:"-" db:"password_hash"`
	RolID        int    `json:"rol_id" db:"rol_id"`
}