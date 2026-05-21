package models

type Categoria struct {
	ID          int    `json:"id" db:"id"`
	Nombre      string `json:"nombre" db:"nombre"`
	Descripcion string `json:"descripcion" db:"descripcion"`
}