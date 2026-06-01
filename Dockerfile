#Imagen oficial de Golang en su versión 1.22 basada en Alpine Linux
FROM golang:1.25-alpine
#Carpeta de trabajo dentro del contenedor
WORKDIR /app
#Copiamos el archivo go.mod al contenedor para gestionar las dependencias del proyecto
COPY go.mod ./
#Archivo go.sum para asegurar la integridad de las dependencias
COPY go.sum ./
#Descargamos las dependencias del proyecto
RUN go mod download
#Copiamos el resto de los archivos del proyecto al contenedor
COPY . .
#Compilamos la aplicación Go y generamos un ejecutable llamado "app"
RUN go build -o api-inventario main.go
#Exponemos el puerto 8080 para que la aplicación sea accesible desde fuera del contenedor
EXPOSE 8080 
#Comando para ejecutar la aplicación cuando el contenedor se inicie
CMD ["./api-inventario"]

