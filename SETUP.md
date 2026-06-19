# 🔧 Configuración de Proyecto - IMPORTANTE

## ⚠️ ACCIÓN INMEDIATA REQUERIDA

### 1. Regenerar Credenciales de Supabase

Tus credenciales de Supabase están actualmente visibles en el código. **DEBES regenerarlas inmediatamente:**

1. Ve a https://app.supabase.com/project
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Haz clic en **Regenerate** junto a la anon key
5. Copia la nueva URL y anon key

### 2. Actualizar .env.local

```bash
# Edita .env.local con tus nuevas credenciales
NG_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
NG_APP_SUPABASE_KEY=sb_publishable_tu_nueva_key
```

**IMPORTANTE**: `.env.local` está en `.gitignore` y NO se sube a GitHub. Es solo para desarrollo local.

---

## 📋 Cambios Realizados

### ✅ Configuración de Variables de Entorno
- ✅ Creado `.env.example` - Plantilla para referencia (SUBE a GitHub)
- ✅ Creado `.env.local` - Tu configuración local (NUNCA sube a GitHub)
- ✅ Actualizado `.gitignore` - `.env.local` ya está ignorado
- ✅ Creado `scripts/setup-env.js` - Script para generar `environment.ts`
- ✅ Actualizado `package.json` - Agrega scripts de setup automático

### ✅ TypeScript Configuration
- ✅ `tsconfig.app.json` - Agregado `rootDir: "./src"`
- ✅ `tsconfig.app.json` - Actualizado `outDir` a `./dist/out-tsc/app`

### ✅ Limpieza de Código
- ✅ Eliminados 6 archivos abandonados (`_old`):
  - `src/app/pages/dashboard/dashboard_old.html`
  - `src/app/pages/dashboard/dashboard_old.scss`
  - `src/app/pages/proyectos/proyectos_old.html`
  - `src/app/pages/proyectos/proyectos_old.scss`
  - `src/app/pages/tareas/tareas_old.html`
  - `src/app/pages/tareas/tareas_old.scss`

---

## 🚀 Cómo Usar

### Primera vez (Setup)

```bash
# 1. Instalar dependencias
npm install

# 2. Actualizar .env.local con tus credenciales
cp .env.example .env.local
# Edita .env.local con tus credenciales

# 3. El setup se ejecuta automáticamente antes de npm start
npm start
```

### Uso normal

```bash
# El script setup se ejecuta automáticamente
npm start          # Ejecuta setup + ng serve
npm build          # Ejecuta setup + ng build
npm run setup      # Ejecutar setup manualmente
```

---

## 📁 Estructura de Archivos

```
proyecto/
├── .env.example        ← Plantilla (sube a GitHub)
├── .env.local          ← Tu config local (IGNORA en .gitignore)
├── scripts/
│   └── setup-env.js    ← Script que genera environment.ts
├── src/
│   └── environments/
│       └── environment.ts ← GENERADO automáticamente
```

---

## 🔐 Seguridad

### Credenciales Públicas - ¿Qué hacer?

Si compartiste el código antes con las credenciales:

1. **Regenera las credenciales en Supabase** (ya mencionado arriba)
2. **Revisa el historial de Git**:
   ```bash
   git log --oneline --all -- src/environments/environment.ts
   git show <commit-hash>:src/environments/environment.ts
   ```
3. **Si está en GitHub**, las credenciales podrían estar en el historial. Considera:
   - Usar `git filter-branch` para remover del historio (avanzado)
   - Ó simplemente regenerar las credenciales (recomendado)

### Variables de Entorno Seguras

✅ **`.env.local`** - Solo local, no sube a GitHub
✅ **`.env.example`** - Plantilla con placeholders, SÍ sube a GitHub
✅ **`scripts/setup-env.js`** - Genera `environment.ts` en build time

---

## 📝 Próximos Pasos

Después de regenerar credenciales:

### Semana 1 (CRÍTICO):
- [ ] Regenerar credenciales de Supabase
- [ ] Actualizar `.env.local`
- [ ] Configurar Row Level Security en Supabase
- [ ] Reemplazar `any` con interfaces tipadas (23 instancias)
- [ ] Usar BehaviorSubject en AuthService (navbar se actualiza)

### Semana 2 (IMPORTANTE):
- [ ] Remover `alert()` y `confirm()` - usar modales
- [ ] Limpiar 30+ `console.log()`
- [ ] Fijar `app.routes.server.ts` - no prerender rutas protegidas
- [ ] Completar tests unitarios

### Semana 3+ (MEJORAS):
- [ ] Implementar lazy loading de rutas
- [ ] Usar logger service
- [ ] Implementar error boundaries

---

## ❓ FAQ

**P: ¿Dónde guardo mis credenciales de Supabase?**
R: En `.env.local`. Este archivo está en `.gitignore` y no se sube a GitHub.

**P: ¿Se regenera `environment.ts` automáticamente?**
R: Sí, cada vez que ejecutas `npm start` o `npm build`, se ejecuta `scripts/setup-env.js`.

**P: ¿Qué pasa si olvido actualizar `.env.local`?**
R: `npm start` fallará con un error claro indicándote que `.env.local` no existe.

**P: ¿Puedo editar `environment.ts` directamente?**
R: No. El archivo dice "GENERATED FROM .env.local - DO NOT EDIT MANUALLY". Edita `.env.local` en su lugar.

**P: ¿Necesito hacer algo especial en Vercel/Producción?**
R: Sí, debes configurar las variables de entorno en Vercel:
- Ve a Project Settings → Environment Variables
- Agrega `NG_APP_SUPABASE_URL` y `NG_APP_SUPABASE_KEY`
- Vercel ejecutará el script setup automáticamente en build time
