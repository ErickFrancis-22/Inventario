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
        {/* Textos que cambian a blanco en la oscuridad */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Panel General</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Resumen de inventario y registro operativo.</p>
      </div>

      {/* Contenedor principal con fondo adaptable (bg-gray-800 en oscuro) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
          <i className='bx bx-package mr-2 text-blue-500 text-xl'></i> Catálogo Rápido
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {productos.map(producto => (
            /* Tarjetas de producto que se oscurecen */
            <div key={producto.id} className="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-100 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group">
              
              <div className="absolute top-2 right-2 bg-blue-600 text-white font-bold px-2.5 py-1 rounded-full text-xs shadow-md flex items-center gap-1 z-10">
                <i className='bx bx-bar-chart-alt-2 text-sm'></i> {stock}
              </div>
              
              <div className="flex justify-between items-center mb-3 mt-1 pr-16">
                <span className="bg-blue-50 dark:bg-gray-800 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">{producto.sku}</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">${producto.precio.toFixed(2)}</span>
              </div>
              
              <h4 className="font-bold text-gray-900 dark:text-white text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {producto.nombre}
              </h4>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario con fondo y campos de texto adaptables */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
          <i className='bx bx-edit mr-2 text-blue-500 text-xl'></i> Registrar Movimiento
        </h3>
        <form onSubmit={registrarMovimiento} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
            <div className="relative">
              <i className='bx bx-transfer-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              {/* Select con dark mode */}
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                <option value="entrada">Entrada (Fabricación/Compra)</option>
                <option value="salida">Salida (Venta/Merma)</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cantidad</label>
            <div className="relative">
              <i className='bx bx-hash absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              {/* Input con dark mode */}
              <input type="number" min="1" required value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2.5 pl-10 pr-3 outline-none focus:ring-2 focus:ring-blue-500 transition-colors"/>
            </div>
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg shadow-md flex items-center justify-center transition-colors">
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
  const [mostrarModal, setMostrarModal] = useState(false)
  const [modo, setModo] = useState('crear')
  const [formProducto, setFormProducto] = useState({ id: null, sku: '', nombre: '', precio: '' })

  const cargarProductos = () => {
    fetch('/api/productos').then(r => r.json()).then(d => setProductos(d)).catch(e => console.error(e))
  }

  useEffect(() => { cargarProductos() }, [])

  const eliminarProducto = (id) => {
    if(window.confirm("¿Estás seguro de que deseas eliminar este escritorio?")) {
      fetch(`/api/productos?id=${id}`, { method: 'DELETE' }).then(r => {
        if(r.ok) cargarProductos()
      })
    }
  }

  const abrirModalCrear = () => {
    setModo('crear'); setFormProducto({ id: null, sku: '', nombre: '', precio: '' }); setMostrarModal(true)
  }

  const abrirModalEditar = (producto) => {
    setModo('editar'); setFormProducto({ id: producto.id, sku: producto.sku, nombre: producto.nombre, precio: producto.precio }); setMostrarModal(true)
  }

  const guardarProducto = (e) => {
    e.preventDefault()
    const metodo = modo === 'crear' ? 'POST' : 'PUT'
    const cuerpo = { sku: formProducto.sku, nombre: formProducto.nombre, precio: parseFloat(formProducto.precio), categoria_id: 1, proveedor_id: 1 }
    if (modo === 'editar') cuerpo.id = formProducto.id

    fetch('/api/productos', {
      method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo)
    }).then(r => {
      if(r.ok) { cargarProductos(); setMostrarModal(false) }
      else alert("Error al procesar")
    })
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Productos</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Administra el catálogo de escritorios.</p>
        </div>
        <button onClick={abrirModalCrear} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-sm transition-colors">
          <i className='bx bx-plus mr-2'></i> Nuevo Producto
        </button>
      </div>
      
      {/* Tabla Adaptada al modo oscuro */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">SKU</th>
              <th className="p-4 font-medium">Nombre</th>
              <th className="p-4 font-medium">Precio</th>
              <th className="p-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {productos.map(producto => (
              <tr key={producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4">
                  <span className="bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 text-xs font-bold px-2.5 py-1 rounded-md">{producto.sku}</span>
                </td>
                <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{producto.nombre}</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold">${producto.precio.toFixed(2)}</td>
                <td className="p-4 flex justify-center gap-3">
                  <button onClick={() => abrirModalEditar(producto)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <i className='bx bx-edit text-xl'></i>
                  </button>
                  <button onClick={() => eliminarProducto(producto.id)} className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    <i className='bx bx-trash text-xl'></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Inteligente Oscuro */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
          {/* Fondo del modal en bg-gray-800 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-[scale-in_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {modo === 'crear' ? 'Agregar Escritorio' : 'Editar Escritorio'}
              </h3>
              <button onClick={() => setMostrarModal(false)} className="text-gray-400 hover:text-red-500 transition-all">
                <i className='bx bx-x text-3xl'></i>
              </button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Código (SKU)</label>
                <input 
                  type="text" required placeholder="Ej. DSK-002" value={formProducto.sku}
                  onChange={e => setFormProducto({...formProducto, sku: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Producto</label>
                <input 
                  type="text" required placeholder="Ej. Escritorio Gamer Básico" value={formProducto.nombre}
                  onChange={e => setFormProducto({...formProducto, nombre: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio ($)</label>
                <input 
                  type="number" step="0.01" required placeholder="Ej. 120.00" value={formProducto.precio}
                  onChange={e => setFormProducto({...formProducto, precio: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
                />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md">
                  {modo === 'crear' ? 'Guardar' : 'Actualizar'}
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
// 3. COMPONENTE: HISTORIAL DE MOVIMIENTOS
// ==========================================
function PantallaMovimientos() {
  const [movimientos, setMovimientos] = useState([])

  useEffect(() => {
    fetch('/api/movimientos')
      .then(respuesta => respuesta.json())
      .then(datos => setMovimientos(datos))
      .catch(error => console.error("Error al traer movimientos:", error))
  }, [])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Historial de Movimientos</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Registro de entradas y salidas de inventario.</p>
      </div>
      
      {/* Contenedor de la tabla adaptado al modo oscuro */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Cabecera oscura */}
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">ID Movimiento</th>
              <th className="p-4 font-medium">Producto (ID)</th>
              <th className="p-4 font-medium">Tipo</th>
              <th className="p-4 font-medium">Cantidad</th>
            </tr>
          </thead>
          {/* dark:divide-gray-700 para las líneas divisorias */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {movimientos.map(mov => (
              <tr key={mov.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="p-4 text-gray-600 dark:text-gray-300 font-medium">#{mov.id}</td>
                <td className="p-4">
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold px-2.5 py-1 rounded-md">
                    Prod: {mov.producto_id}
                  </span>
                </td>
                <td className="p-4">
                  {mov.tipo === 'entrada' ? (
                    <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center w-max">
                      <i className='bx bx-trending-up mr-1'></i> Entrada
                    </span>
                  ) : (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 text-xs font-bold px-2.5 py-1 rounded-md flex items-center w-max">
                      <i className='bx bx-trending-down mr-1'></i> Salida
                    </span>
                  )}
                </td>
                <td className="p-4 font-bold text-gray-800 dark:text-gray-200">{mov.cantidad} uds.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


// ==========================================
// 4. COMPONENTE: LOGIN (INICIO DE SESIÓN)
// ==========================================
function PantallaLogin({ onLogin, temaOscuro, setTemaOscuro }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const manejarAcceso = (e) => {
    e.preventDefault()
    
    // 1. Empaquetamos las credenciales
    const credenciales = {
      email: email,
      password: password
    }

    // 2. Tocamos la puerta del backend en Go
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credenciales)
    })
    .then(respuesta => {
      if (respuesta.ok) {
        return respuesta.json() // Si Go da luz verde, leemos el token
      }
      throw new Error('Credenciales incorrectas')
    })
    .then(datos => {
      // 3. Guardamos el Pase VIP y el Rol en la memoria del navegador
      localStorage.setItem('token', datos.token)
      localStorage.setItem('rol', datos.rol)
      
      // 4. ¡Le avisamos al cadenero que abra la puerta!
      onLogin() 
    })
    .catch(error => {
      // Si Go rechaza el acceso (ej. contraseña equivocada), mostramos error
      alert("Acceso denegado: Verifica tu correo o contraseña.")
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 px-4">
      
      {/* Botón suelto para cambiar tema antes de iniciar sesión */}
      <button 
        onClick={() => setTemaOscuro(!temaOscuro)} 
        className="absolute top-6 right-8 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors"
      >
        <i className={temaOscuro ? 'bx bx-sun text-2xl' : 'bx bx-moon text-2xl'}></i>
      </button>

      <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <i className='bx bx-cube text-4xl text-blue-600 dark:text-blue-400'></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Bienvenido</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Inicia sesión en DeskSV</p>
        </div>

        <form onSubmit={manejarAcceso} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
            <div className="relative">
              <i className='bx bx-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@desksv.com"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contraseña</label>
            <div className="relative">
              <i className='bx bx-lock-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'></i>
              <input 
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2"
          >
            Ingresar al Sistema <i className='bx bx-right-arrow-alt text-xl'></i>
          </button>
        </form>
      </div>
    </div>
  )
}


// ==========================================
// 5. COMPONENTE PRINCIPAL (LAYOUT + RUTAS)
// ==========================================
export default function App() {
  const [temaOscuro, setTemaOscuro] = useState(false)
  
  // MODIFICADO: Ahora el estado inicial revisa si ya existe un token guardado
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(() => {
    const tokenGuardado = localStorage.getItem('token')
    return !!tokenGuardado // Retorna true si hay token, false si está vacío
  })

  useEffect(() => {
    if (temaOscuro) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [temaOscuro])

  if (!usuarioAutenticado) {
    return (
      <PantallaLogin 
        onLogin={() => setUsuarioAutenticado(true)} 
        temaOscuro={temaOscuro} 
        setTemaOscuro={setTemaOscuro} 
      />
    )
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
        
        {/* SIDEBAR */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex transition-colors duration-300">
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <i className='bx bx-cube text-2xl text-blue-600 dark:text-blue-400 mr-2'></i>
            <span className="text-xl font-bold tracking-tight dark:text-white">DeskSV</span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg font-medium transition-colors">
              <i className='bx bx-grid-alt text-xl mr-3'></i> Panel General
            </Link>
            <Link to="/productos" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg font-medium transition-colors">
              <i className='bx bx-box text-xl mr-3'></i> Productos
            </Link>
            <Link to="/movimientos" className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg font-medium transition-colors">
              <i className='bx bx-transfer text-xl mr-3'></i> Movimientos
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {/* MODIFICADO: Al cerrar sesión borramos los datos del localStorage */}
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('rol')
                setUsuarioAutenticado(false)
              }}
              className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg font-medium transition-colors"
            >
              <i className='bx bx-log-out text-xl mr-3'></i> Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* HEADER */}
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 shadow-sm z-10 transition-colors duration-300">
            <div className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer">
              <i className='bx bx-menu text-2xl'></i>
            </div>
            
            <div className="flex items-center gap-5">
              <button onClick={() => setTemaOscuro(!temaOscuro)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-yellow-400 transition-colors relative">
                <i className={temaOscuro ? 'bx bx-sun text-2xl' : 'bx bx-moon text-2xl'}></i>
              </button>

              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors relative">
                <i className='bx bx-bell text-2xl'></i>
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">F</div>
                <span className="font-medium text-sm hidden sm:block dark:text-gray-200">Francis</span>
                <i className='bx bx-chevron-down text-gray-400'></i>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/productos" element={<PantallaProductos />} />
              <Route path="/movimientos" element={<PantallaMovimientos />} /> 
            </Routes>
          </div>

        </main>
      </div>
    </BrowserRouter>
  )
}