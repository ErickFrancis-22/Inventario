package models

import "time"

type Movimiento struct {
	ID 			  int `json:"id" db:"id"`
	ProductoID 	  int `json:"producto_id" db:"producto_id"`
	UsuarioID     int `json:"usuario_id" db:"usuario_id"`
	Tipo          string `json:"tipo" db:"tipo"`
	Cantidad 	  int `json:"cantidad" db:"cantidad"`
	FechaCreacion time.Time `json:"fecha_creacion" id:"fecha_creacion"`
}
