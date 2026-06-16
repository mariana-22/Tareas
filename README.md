# 🚀 Orbit - Gestor de Proyectos y Tareas

Un gestor CRUD moderno y escalable para gestionar proyectos y tareas en equipos de trabajo, desarrollado con **Angular 21**, **Supabase** y desplegado en la nube.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Funcionalidades](#funcionalidades)
- [Despliegue](#despliegue)

---

## 📝 Descripción General

**Orbit** es una aplicación web de gestión colaborativa que permite a los equipos de trabajo:
- Crear y gestionar proyectos
- Crear y asignar tareas a proyectos
- Rastrear el estado de tareas (Pendiente, En Progreso, Completada)
- Autenticarse de forma segura
- Ver estadísticas y métricas en un dashboard

### Objetivo Educativo
Este proyecto implementa los conceptos principales de desarrollo web **Full-Stack**:
- **Frontend**: Aplicación SPA con Angular 21 con componentes standalone
- **Backend**: Integración con Supabase (BaaS)
- **Base de Datos**: PostgreSQL en la nube
- **Control de Versiones**: Git y GitHub
- **Despliegue**: Vercel

---

## ✨ Características

### Gestión de Proyectos
- ✅ Crear nuevos proyectos
- ✅ Ver listado de proyectos
- ✅ Editar información del proyecto
- ✅ Eliminar proyectos
- ✅ Búsqueda y filtros

### Gestión de Tareas
- ✅ Crear tareas dentro de proyectos
- ✅ Asignar estado (Pendiente, En Progreso, Completada)
- ✅ Editar tareas
- ✅ Eliminar tareas
- ✅ Visualizar tareas por estado

### Autenticación
- ✅ Sistema de registro e inicio de sesión
- ✅ Validación de formularios
- ✅ Gestión de sesiones
- ✅ Protección de rutas

### Dashboard
- ✅ Estadísticas globales
- ✅ Conteo de proyectos y tareas
- ✅ Tareas por estado
- ✅ Estado de conexión a BD

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 21.2.0** - Framework SPA moderno
- **TypeScript 5.9** - Lenguaje tipado
- **SCSS** - Preprocesador CSS
- **RxJS 7.8** - Programación reactiva
- **FormsModule** - Formularios reactivos y template-driven

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Base de datos relacional
- **Node.js Express** - SSR (Server-Side Rendering)

### DevOps & Herramientas
- **Angular CLI 21.2.14** - Generador y build tool
- **Vite** - Test runner (vitest)
- **npm 10.9.2** - Gestor de paquetes

---

## 📦 Requisitos

- **Node.js**: v18+ 
- **npm**: v9+
- **Git**: Última versión
- **Navegador moderno**: Chrome, Firefox, Safari, Edge

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/orbit-gestor-proyectos.git
cd orbit-gestor-proyectos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

---

## ⚙️ Configuración

### Conectar con Supabase

1. Crear cuenta en [supabase.com](https://supabase.com)
2. Crear nuevo proyecto
3. Crear tablas:

#### Tabla: `proyectos`
```sql
CREATE TABLE proyectos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  usuario_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabla: `tareas`
```sql
CREATE TABLE tareas (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  proyecto_id BIGINT REFERENCES proyectos(id) ON DELETE CASCADE,
  usuario_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. Configurar archivo `src/environments/environment.ts`

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── pages/
│   │   ├── dashboard/        # Dashboard con estadísticas
│   │   ├── login/            # Autenticación
│   │   ├── proyectos/        # Gestión de proyectos
│   │   └── tareas/           # Gestión de tareas
│   ├── services/
│   │   ├── auth.ts           # Autenticación
│   │   └── supabase.ts       # Supabase
│   ├── components/
│   │   └── navbar.ts         # Navegación
│   ├── app.ts                # Componente raíz
│   ├── app.routes.ts         # Rutas
│   └── app.scss              # Estilos globales
└── environments/             # Configuración
```

---

## 💾 Base de Datos

### Modelo de Datos

```
Proyectos (1) ──→ (N) Tareas
```

### Estados de Tareas
- **pendiente** - Sin iniciar
- **en progreso** - En desarrollo
- **completada** - Finalizada

---

## 📊 Requisitos de Complejidad

Implementa **más de 3 de los requisitos solicitados**:

1. ✅ **Sistema de autenticación** - Login/Registro
2. ✅ **Relaciones entre entidades** - Proyectos y Tareas
3. ✅ **Dashboard con estadísticas** - Métricas en tiempo real
4. ✅ **Filtros y búsqueda** - Búsqueda avanzada
5. ✅ **Validaciones avanzadas** - Formularios seguros

---

## 📝 Scripts

```bash
npm start              # Desarrollo
npm run build          # Build producción
npm test               # Tests
npm run serve:ssr      # SSR
```

---

## 🔒 Seguridad

- ✅ Validación en cliente y servidor
- ✅ Sanitización de datos
- ✅ Variables de entorno protegidas
- ✅ Consultas paramétrizadas

---

## 🚢 Despliegue en Vercel

1. Conectar repositorio GitHub
2. Configurar variables de entorno
3. Deploy automático en cada push

---

**Desarrollado con ❤️ usando Angular 21 y Supabase**
