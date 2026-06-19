# 🔐 Cambios de Seguridad Implementados

## Resumen de Cambios

Se han implementado **cambios críticos de seguridad** para que tu aplicación use **Supabase Auth en lugar de autenticación local**, y se implementó **Row Level Security (RLS)** para proteger datos.

---

## ✅ Cambios Realizados

### 1️⃣ **AuthService - Reescrito con Supabase Auth**

**Antes:** 
- ❌ Auth local sin validación
- ❌ IDs generados con `Math.random()`
- ❌ Solo almacenaba en localStorage

**Ahora:**
- ✅ Usa `Supabase Auth` real
- ✅ Valida email y contraseña en Supabase
- ✅ Genera UUIDs seguros (servidor)
- ✅ Usa `BehaviorSubject` para observables
- ✅ Mejor manejo de sesiones

**Archivo:** [src/app/services/auth.ts](../../src/app/services/auth.ts)

```typescript
// ANTES
const user = {
  id: Math.random().toString(36).substr(2, 9), // ❌ Débil
  email: email
};
localStorage.setItem('current_user', JSON.stringify(user));

// AHORA
const { data, error } = await this.supabase.signIn(email, password);
// ✅ Valida en Supabase
// ✅ Retorna sesión con JWT
// ✅ Genera UUID servidor
```

---

### 2️⃣ **SupabaseService - Métodos Mejorados**

**Cambios:**
- ✅ `getProyectos()` ahora recibe `userId` y filtra por user_id
- ✅ `getTareas()` ahora recibe `userId` y filtra por user_id
- ✅ Agregado método `getSession()` para verificar sesión
- ✅ Tipos mejorados con interfaces

**Archivo:** [src/app/services/supabase.ts](../../src/app/services/supabase.ts)

```typescript
// ANTES
getProyectos() {
  return this.supabase.from('proyectos').select('*'); // ❌ Ve TODOS
}

// AHORA
getProyectos(userId: string) {
  return this.supabase
    .from('proyectos')
    .select('*')
    .eq('user_id', userId) // ✅ Solo del usuario
    .order('created_at', { ascending: false });
}
```

---

### 3️⃣ **ProyectosComponent - Usa AuthService + user_id**

**Cambios:**
- ✅ Se suscribe al `currentUser$` del AuthService
- ✅ Pasa `user_id` al crear/editar proyectos
- ✅ Implementa `OnDestroy` para limpiar suscripciones
- ✅ Tipos mejorados con interfaz `Proyecto`

**Archivo:** [src/app/pages/proyectos/proyectos.ts](../../src/app/pages/proyectos/proyectos.ts)

```typescript
// ANTES
async crearProyecto() {
  const proyecto = { ...this.newProyecto }; // ❌ Sin user_id
  const { error } = await this.supabase.createProyecto(proyecto);
}

// AHORA
async crearProyecto() {
  const proyecto: Proyecto = {
    titulo: this.newProyecto.titulo,
    user_id: this.currentUser.id, // ✅ Con user_id
  };
  const { error } = await this.supabase.createProyecto(proyecto);
}
```

---

### 4️⃣ **TareasComponent - Usa AuthService + user_id**

**Cambios:**
- ✅ Se suscribe al `currentUser$` del AuthService
- ✅ Pasa `user_id` al crear/editar tareas
- ✅ Implementa `OnDestroy` para limpiar suscripciones
- ✅ Tipos mejorados con interfaz `Tarea`

**Archivo:** [src/app/pages/tareas/tareas.ts](../../src/app/pages/tareas/tareas.ts)

---

### 5️⃣ **NavbarComponent - Actualización Reactiva**

**Cambios:**
- ✅ Se suscribe a `currentUser$` del AuthService
- ✅ **Se actualiza automáticamente** cuando el usuario hace login/logout
- ✅ No solo carga una vez en `ngOnInit`

**Archivo:** [src/app/components/navbar.ts](../../src/app/components/navbar.ts)

```typescript
// ANTES
ngOnInit() {
  this.currentUser = this.auth.getCurrentUser(); // Carga solo una vez ❌
}

// AHORA
ngOnInit() {
  this.auth.getCurrentUser$()
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      this.currentUser = user; // Se actualiza automáticamente ✅
    });
}
```

---

### 6️⃣ **AuthGuard - Validación Asincrónica**

**Cambios:**
- ✅ Espera a que se complete `waitForAuthCheck()`
- ✅ Más robusto para SSR y timing issues
- ✅ Implementa `CanActivate` correctamente

**Archivo:** [src/app/guards/auth.guard.ts](../../src/app/guards/auth.guard.ts)

---

### 7️⃣ **Tipos TypeScript - Interfaces Compartidas**

**Nuevo archivo:** [src/app/types/index.ts](../../src/app/types/index.ts)

```typescript
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Proyecto {
  id?: number;
  titulo: string;
  descripcion: string;
  user_id: string;
  created_at?: string;
}

export interface Tarea {
  id?: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en progreso' | 'completada';
  user_id: string;
  created_at?: string;
}
```

---

### 8️⃣ **Migraciones SQL - Agregar user_id y RLS**

**Archivo:** [docs/DATABASE_MIGRATIONS.sql](../DATABASE_MIGRATIONS.sql)

Este archivo contiene todos los comandos SQL para:
1. ✅ Agregar columna `user_id` a `proyectos`
2. ✅ Agregar columna `user_id` a `tareas`
3. ✅ Habilitar Row Level Security
4. ✅ Crear políticas de seguridad
5. ✅ Crear índices para performance

---

## 🚀 Próximos Pasos - **OBLIGATORIOS**

### 1. Regenerar Credenciales de Supabase

Si compartiste el código con las credenciales visibles, regenera las keys:

1. Ve a https://app.supabase.com/project/[TU-PROYECTO]
2. Settings → API → Regenerate anon key
3. Actualiza `.env.local`

```bash
NG_APP_SUPABASE_URL=https://[TU-PROYECTO].supabase.co
NG_APP_SUPABASE_KEY=sb_publishable_[NUEVA_KEY]
```

### 2. Ejecutar Migraciones SQL en Supabase

**En Supabase Dashboard:**
1. Ve a SQL Editor
2. Abre [docs/DATABASE_MIGRATIONS.sql](../DATABASE_MIGRATIONS.sql)
3. Copia cada bloque y ejecuta en orden:
   - Agregar user_id a proyectos
   - Agregar user_id a tareas
   - Habilitar RLS
   - Crear políticas
   - Verificar

**O simplemente copia todo el archivo y ejecuta (recomendado):**

```bash
# Abre esta URL y copia/pega el SQL
docs/DATABASE_MIGRATIONS.sql
```

### 3. Probar la Aplicación

```bash
npm install  # Si es primera vez
npm start

# Pruebaen http://localhost:4200
```

**Flujo a probar:**
1. ✅ Ir a login
2. ✅ Crear nueva cuenta
3. ✅ Verificar que se crea usuario en Supabase Auth
4. ✅ Crear un proyecto
5. ✅ Verificar que proyecto tiene user_id
6. ✅ Logout
7. ✅ Login con otro correo
8. ✅ Verificar que NO ve proyectos del usuario anterior (RLS)

---

## 📊 Comparación: Antes vs. Después

| Aspecto | Antes ❌ | Después ✅ |
|---------|---------|---------|
| **Autenticación** | Local, sin validación | Supabase Auth con JWT |
| **IDs de Usuario** | Math.random() | UUID (Supabase) |
| **Almacenamiento** | Solo localStorage | localStorage + Supabase |
| **Proyectos almacenan user_id** | NO | SÍ |
| **Tareas almacenan user_id** | NO | SÍ |
| **Aislamiento de datos** | NINGUNO (todos ven todo) | RLS (solo ves tus datos) |
| **Seguridad** | 🔴 BAJA | 🟢 ALTA |
| **Sesión persiste** | NO | SÍ |
| **Navbar se actualiza** | NO | SÍ |
| **Frontend typado** | Poco (many `any`) | Completo (interfaces) |

---

## 🔐 Cómo Funciona Ahora

```
┌─────────────────────────────────────────────────────┐
│ FLUJO DE LOGIN SEGURO                               │
└─────────────────────────────────────────────────────┘

1. Usuario: pepe@gmail.com + pass1234
                          ↓
2. AuthService.login()
     ↓
3. Supabase.signInWithPassword() ← Valida en servidor
     ↓
4. Supabase retorna: { user, session, token }
     ↓
5. AuthService guarda sesión
     ↓
6. BehaviorSubject emite evento
     ↓
7. NavbarComponent se actualiza
     ↓
8. Usuario redirigido a /dashboard

┌─────────────────────────────────────────────────────┐
│ CREAR PROYECTO SEGURO                               │
└─────────────────────────────────────────────────────┘

1. Usuario hace clic en "Crear Proyecto"
                          ↓
2. ProyectosComponent obtiene user_id:
   const userId = this.currentUser.id;
                          ↓
3. Envía al servidor:
   {
     titulo: "Mi proyecto",
     user_id: "550e8400-e29b-41d4-a716-446655440000" ← Su ID
   }
                          ↓
4. Supabase valida con JWT token
                          ↓
5. Supabase verifica user_id del token = user_id de data
                          ↓
6. Si todo OK → Guarda proyecto
                          ↓
7. Proyecto está protegido por RLS

┌─────────────────────────────────────────────────────┐
│ VER PROYECTOS - RLS EN ACCIÓN                       │
└─────────────────────────────────────────────────────┘

Usuario A (id: abc123) solicita sus proyectos
                          ↓
ProyectosComponent.cargarProyectos(abc123)
                          ↓
Supabase SQL:
  SELECT * FROM proyectos
  WHERE user_id = 'abc123'  ← RLS lo hace automático
                          ↓
Solo ve sus 3 proyectos ✅

Usuario B (id: xyz789) nunca verá proyectos de Usuario A
aunque intente hacer queries directas (RLS lo bloquea)
```

---

## 🧪 Verificación

### Cómo verificar que RLS está funcionando:

```bash
# En Supabase Dashboard → SQL Editor

-- Ver proyectos del usuario autenticado
SELECT * FROM proyectos; -- Solo ve los suyos (RLS)

-- Ver todas (como admin, SIN RLS)
SELECT * FROM proyectos; -- Ve todos (solo con anon key falla)

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename IN ('proyectos', 'tareas');
```

---

## ⚠️ Notas Importantes

### Datos Antiguos

Si tienes proyectos/tareas sin `user_id` creados antes:

```sql
-- Asignar user_id a datos antiguos
UPDATE proyectos 
SET user_id = 'UUID_DEL_USUARIO' 
WHERE user_id IS NULL;

-- O eliminarlos
DELETE FROM proyectos WHERE user_id IS NULL;
```

### SSR (Server-Side Rendering)

La aplicación ya tiene SSR configurado. RLS + JWT funcionan correctamente en SSR porque:
- ✅ El token se envía en headers
- ✅ Supabase valida el token en servidor
- ✅ RLS se aplica en la base de datos

---

## 📝 Checklist de Verificación

- [ ] Regeneré credenciales de Supabase
- [ ] Ejecuté migraciones SQL (todo el archivo)
- [ ] Pruebé register con nuevo usuario
- [ ] Pruebé login
- [ ] Creé un proyecto
- [ ] Verifiqué que tiene `user_id` en BD
- [ ] Hice logout
- [ ] Login con otro usuario
- [ ] Verifiqué que NO ve proyectos del usuario anterior
- [ ] NavBar se actualiza al hacer logout

Si todo ✅ → ¡Tu app es segura! 🎉

---

## 🆘 Troubleshooting

### "Error: Permission denied"

**Causa:** RLS bloqueó acceso sin token válido
**Solución:** Verifica que el usuario esté logueado y token sea válido

### "user_id is NULL"

**Causa:** Datos sin user_id (creados antes de las migraciones)
**Solución:** Ejecuta `UPDATE proyectos SET user_id = ...`

### "No veo mis proyectos después de hacer login"

**Causa:** Proyectos no tienen user_id asignado
**Solución:** Asigna user_id a datos existentes o crea nuevos

### NavBar no se actualiza

**Causa:** Actualización anticuada (antes de estos cambios)
**Solución:** Limpiar caché, hacer rebuild: `npm build`

---

## 📚 Recursos

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Policies Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/database/overview)

---

**Versión:** 1.0  
**Fecha:** 2024  
**Autor:** GitHub Copilot  
**Estado:** ✅ Implementado
