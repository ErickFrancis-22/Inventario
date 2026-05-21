package models

type Proveedor struct {
	ID       int    `json:"id" db:"id"`
	Nombre   string `json:"nombre" db:"nombre"`
	Contacto string `json:"contacto" db:"contacto"`
	Telefono string `json:"telefono" db:"telefono"`
}