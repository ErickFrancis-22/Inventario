package models

type Producto struct {
	ID          int     `json:"id" db:"id"`
	Sku         string  `json:"sku" db:"sku"`
	Nombre      string  `json:"nombre" db:"nombre"`
	Precio      float64 `json:"precio" db:"precio"`
	CategoriaID int     `json:"categoria_id" db:"categoria_id"`
	ProveedorID int     `json:"proveedor_id" db:"proveedor_id"`
}