#  Mi Portfolio Personal

**URL del proyecto front hospedado:** [https://portfolio-frontend-e62z.onrender.com/](https://portfolio-frontend-e62z.onrender.com/)
**URL del proyecto back hospedado:** [https://backendwil.onrender.com](https://backendwil.onrender.com)


##  Descripción

Portfolio personal interactivo desarrollado como proyecto final del curso de Desarrollo Web. Incluye secciones de presentación personal, blog organizado por categorías, estudios académicos, red de contactos y un sistema de mensajería con backend completo. El diseño es 100% responsive con tema claro/oscuro y efectos visuales modernos implementados con tecnologías web puras.

##  Tecnologías Utilizadas

- **HTML5** - Estructura semántica del sitio
- **CSS3** - Diseño responsive con Flexbox/Grid, animaciones y efectos visuales
- **JavaScript (Vanilla)** - Interactividad del frontend (tema oscuro, carrusel, smooth scroll)
- **Python 3** - Backend con Flask para API REST
- **SQL (SQLite)** - Base de datos para almacenar mensajes de contacto

##  Características Principales

### Frontend
- ✅ Diseño responsive adaptable a móviles, tablets y desktop
- ✅ Tema oscuro/claro con persistencia en localStorage
- ✅ Navegación fija con efecto blur
- ✅ Carrusel automático de proyectos (3 segundos)
- ✅ Video de perfil en loop
- ✅ Blog con categorías (Juegos, Universidad, Desarrollo, Lifestyle)
- ✅ Grid de cards con efectos hover
- ✅ Smooth scroll en navegación
- ✅ Iconos SVG personalizados

### Backend
- ✅ API REST con Flask
- ✅ Base de datos SQLite para mensajes
- ✅ Sistema CRUD completo (Create, Read, Delete)
- ✅ Validación de datos del formulario
- ✅ CORS habilitado para frontend/backend separados
- ✅ Timestamps automáticos

##  Estructura del Proyecto

```
portfolio/
├── index.html           # Página principal con hero y carrusel
├── blog.html            # Blog con categorías
├── estudios.html        # Formación académica
├── Amigos.html          # Red de contactos
├── contact.html         # Formulario de contacto
├── Styles/
│   └── style.css        # Estilos globales
├── Jscript/
│   └── script.js        # Lógica del frontend
├── icons/               # Iconos SVG
├── Imagenes/            # Recursos visuales
├── backend/
│   ├── app.py          # API Flask
│   ├── database.py     # Configuración SQL
│   └── requirements.txt # Dependencias Python
└── README.md
```

##  Esquema de Base de Datos

### Tabla: `contact_messages`

| Campo       | Tipo      | Descripción                    |
|-------------|-----------|--------------------------------|
| id          | INTEGER   | Primary Key (autoincremental)  |
| name        | TEXT      | Nombre del remitente           |
| email       | TEXT      | Email de contacto              |
| subject     | TEXT      | Asunto del mensaje (opcional)  |
| message     | TEXT      | Contenido del mensaje          |
| created_at  | TIMESTAMP | Fecha de creación              |
| read        | BOOLEAN   | Estado de lectura (0/1)        |

## Instalación Local

### Prerequisitos
- Python 3.8 o superior
- Navegador web moderno

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/tu-portfolio.git
cd tu-portfolio
```

2. **Instalar dependencias del backend**
```bash
cd backend
pip install -r requirements.txt
```

3. **Inicializar base de datos**
```bash
python database.py
```

4. **Iniciar servidor Flask**
```bash
python app.py
```
El backend estará en `http://localhost:5000`

5. **Abrir el frontend**
- Abre `index.html` en tu navegador
- O usa Live Server en VS Code

##  Deployment en Render

### Backend (Web Service)
1. Conecta tu repositorio de GitHub
2. Configura:
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn app:app`
3. Deploy automático

### Frontend (Static Site)
1. Crea nuevo Static Site
2. Configura:
   - **Build Command:** (vacío)
   - **Publish Directory:** `.`
3. Actualiza `API_URL` en `contact.html` con la URL del backend

##  Endpoints de la API

### `POST /api/contact`
Envía un mensaje de contacto
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "subject": "Consulta sobre proyecto",
  "message": "Hola, me interesa tu trabajo..."
}
```

### `GET /api/messages`
Obtiene todos los mensajes
```json
{
  "success": true,
  "count": 5,
  "messages": [...]
}
```

### `DELETE /api/messages/:id`
Elimina un mensaje por ID

##  Paleta de Colores

- **Claro:** Blanco (#fff), Negro (#000), Grises (#888, #aaa)
- **Oscuro:** Negro (#1a1a1a), Blanco (#fff)
- **Acentos:** Gradientes dinámicos

## Autor

**Axowill**
- GitHub: [@AxoWil](https://github.com/Axowil)
- Email: welfordwillian@gmail.com
