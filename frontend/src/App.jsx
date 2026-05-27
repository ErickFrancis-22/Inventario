import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

// ==========================================
// 1. COMPONENTE: PANEL GENERAL (DASHBOARD)
// ==========================================
function Dashboard() {
  const [productos, setProductos] = useState([])
  const [stock, setStock] = useState(0) 
  const [cantidad, setCantidad] = useState('')
  const [tipo, setTipo] = useState('entrada')

  const cargarStock = () => {
    fetch('/api/stock?id=1') 
      .then(respuesta => respuesta.json())
      .then(datos => setStock(datos.stock_real))
      .catch(error => console.error("Error al traer el stock:", error))
  }

  useEffect(() => {
    fetch('/api/productos')
      .then(respuesta => respuesta.json())
      .then(datos => setProductos(datos))
      .catch(error => console.error("Error al traer los datos:", error))
    cargarStock()
  }, [])

  const registrarMovimiento = (e) => {
    e.preventDefault()
    const nuevoMovimiento = {
      producto_id: 1, usuario_id: 1, tipo: tipo, cantidad: parseInt(cantidad)
    }

    fetch('/api/movimientos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoMovimiento)
    }).then(respuesta => {
      if(respuesta.ok) {
        cargarStock() 
        setCantidad('') 
      } else alert("Hubo un error al registrar el movimiento")
    }).catch(error => console.error("Error:", error))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Panel General</h2>
        <p className="text-gray-500 text-sm mt-1">Resumen de inventario y registro operativo.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <i className='bx bx-package mr-2 text-blue-500 text-xl'></i> Catálogo Rápido
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map(producto => (
              /* ¡AQUÍ ESTÁ LA MAGIA DE LA ANIMACIÓN! */
              <div key={producto.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group">
                
                <div className="absolute top-0 right-0 bg-blue-600 text-white font-bold px-4 py-1.5 rounded-bl-lg text-sm shadow-md flex items-center">
                  <i className='bx bx-bar-chart-alt-2 mr-1'></i> Stock: {stock}
                </div>
                <div className="flex justify-between items-start mb-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">{producto.sku}</span>
                  <span className="font-bold text-emerald-600 text-lg">${producto.precio.toFixed(2)}</span>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{producto.nombre}</h4>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
          <i className='bx bx-edit mr-2 text-blue-500 text-xl'></i> Registrar Movimiento
        </h3>
        <form onSubmit={registrarMovimiento} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <div className="relative">
              <i className='bx bx-transfer-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 outline-none">
                <option value="entrada">Entrada (Fabricación/Compra)</option>
                <option value="salida">Salida (Venta/Merma)</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <div className="relative">
              <i className='bx bx-hash absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              <input type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="w-full border border-gray-300 rounded-lg py-2.5 pl-10 pr-3 outline-none"/>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md flex items-center justify-center">
            <i className='bx bx-save mr-2'></i> Guardar
          </button>
        </form>
      </div>
    </div>
  )
}

// ==========================================
// 2. COMPONENTE: GESTIÓN DE PRODUCTOS
// ==========================================
function PantallaProductos() {
  const [productos, setProductos] = useState([])
  
  // Variables para controlar el Modal (Ventana flotante) y el formulario
  const [mostrarModal, setMostrarModal] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({
    sku: '', nombre: '', precio: ''
  })

  const cargarProductos = () => {
    fetch('/api/productos')
      .then(respuesta => respuesta.json())
      .then(datos => setProductos(datos))
      .catch(error => console.error("Error al traer productos:", error))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  // Función REAL para eliminar
  const eliminarProducto = (id) => {
    if(window.confirm("¿Estás seguro de que deseas eliminar este escritorio?")) {
      // Mandamos la petición DELETE a Go
      fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
      })
      .then(respuesta => {
        if(respuesta.ok) {
          cargarProductos() // Recargamos la tabla si fue exitoso
        } else {
          alert("Error al eliminar el producto")
        }
      })
      .catch(error => console.error("Error:", error))
    }
  }

 // Función REAL para guardar un nuevo producto
  const guardarProducto = (e) => {
    e.preventDefault()
    
    fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sku: nuevoProducto.sku,
        nombre: nuevoProducto.nombre,
        precio: parseFloat(nuevoProducto.precio),
        categoria_id: 1, // El que agregamos antes
        proveedor_id: 1  // <-- ¡EL NUEVO CULPABLE RESUELTO!
      })
    })
    .then(respuesta => {
      if(respuesta.ok) {
        cargarProductos() 
        setMostrarModal(false) 
        setNuevoProducto({ sku: '', nombre: '', precio: '' }) 
      } else {
        alert("Error al guardar el producto")
      }
    })
    .catch(error => console.error("Error:", error))
  }
  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
          <p className="text-gray-500 text-sm mt-1">Administra el catálogo de escritorios.</p>
        </div>
        {/* Botón que abre el modal */}
        <button 
          onClick={() => setMostrarModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors"
        >
          <i className='bx bx-plus mr-2'></i> Nuevo Producto
        </button>
      </div>
      
      {/* Tabla Premium */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {productos.map(producto => (
              <tr key={producto.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md">{producto.sku}</span>
                </td>
                <td className="p-4 font-medium text-gray-800">{producto.nombre}</td>
                <td className="p-4 text-emerald-600 font-bold">${producto.precio.toFixed(2)}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                    <i className='bx bx-edit text-xl'></i>
                  </button>
                  <button onClick={() => eliminarProducto(producto.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Eliminar">
                    <i className='bx bx-trash text-xl'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VENTANA FLOTANTE (MODAL) ANIMADA */}
      {mostrarModal && (
        // 1. El fondo oscuro ahora usa backdrop-blur para un efecto cristalino
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-[scale-in_0.2s_ease-out]">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Agregar Escritorio</h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-200">
                <i className='bx bx-x text-3xl'></i>
              </button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código (SKU)</label>
                <input 
                  type="text" required placeholder="Ej. DSK-002"
                  value={nuevoProducto.sku}
                  onChange={e => setNuevoProducto({...nuevoProducto, sku: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input 
                  type="text" required placeholder="Ej. Escritorio Gamer Básico"
                  value={nuevoProducto.nombre}
                  onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                <input 
                  type="number" step="0.01" required placeholder="Ej. 120.00"
                  value={nuevoProducto.precio}
                  onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
// ==========================================
// 3. COMPONENTE PRINCIPAL (LAYOUT + RUTAS)
// ==========================================
export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <i className='bx bx-cube text-2xl text-blue-600 mr-2'></i>
            <span className="text-xl font-bold tracking-tight">MyStore</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {/* OJO: Cambiamos las etiquetas <a> por <Link> de React Router */}
            <Link to="/" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors">
              <i className='bx bx-grid-alt text-xl mr-3'></i> Panel General
            </Link>
            <Link to="/productos" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors">
              <i className='bx bx-box text-xl mr-3'></i> Productos
            </Link>
            <Link to="/movimientos" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg font-medium transition-colors">
              <i className='bx bx-transfer text-xl mr-3'></i> Movimientos
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <a href="#" className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
              <i className='bx bx-cog text-xl mr-3'></i> Configuración
            </a>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
            <div className="text-gray-500 hover:text-gray-700 cursor-pointer">
              <i className='bx bx-menu text-2xl'></i>
            </div>
            <div className="flex items-center gap-5">
              <button className="text-gray-500 hover:text-blue-600 transition-colors relative">
                <i className='bx bx-bell text-2xl'></i>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">E</div>
                <span className="font-medium text-sm hidden sm:block">Administrador</span>
                <i className='bx bx-chevron-down text-gray-400'></i>
              </div>
            </div>
          </header>

          {/* EL CORAZÓN DE REACT ROUTER: Aquí se inyectan las pantallas dinámicamente */}
          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/productos" element={<PantallaProductos />} />
              {/* <Route path="/movimientos" element={<PantallaMovimientos />} /> */}
            </Routes>
          </div>

        </main>
      </div>
    </BrowserRouter>
  )
}