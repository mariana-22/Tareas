-- ====================================================
-- MIGRACIONES Y ROW LEVEL SECURITY (RLS) - SUPABASE
-- ====================================================
-- 
-- Ejecuta estos comandos en Supabase SQL Editor:
-- https://app.supabase.com/project/[TU-PROYECTO]/sql
--
-- PASOS:
-- 1. Abre la consola SQL
-- 2. Copia y pega cada bloque
-- 3. Ejecuta (Ctrl+Enter)
-- 4. Repite para cada sección
--
-- ====================================================

-- ─────────────────────────────────────────────────────
-- 1. AGREGAR COLUMNA user_id A TABLA PROYECTOS
-- ─────────────────────────────────────────────────────

ALTER TABLE proyectos ADD COLUMN user_id UUID;

-- Agregar constraint para vincular con auth.users
ALTER TABLE proyectos 
ADD CONSTRAINT proyectos_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar índice para mejor performance
CREATE INDEX idx_proyectos_user_id ON proyectos(user_id);

-- ─────────────────────────────────────────────────────
-- 2. AGREGAR COLUMNA user_id A TABLA TAREAS
-- ─────────────────────────────────────────────────────

ALTER TABLE tareas ADD COLUMN user_id UUID;

-- Agregar constraint para vincular con auth.users
ALTER TABLE tareas 
ADD CONSTRAINT tareas_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Agregar índice para mejor performance
CREATE INDEX idx_tareas_user_id ON tareas(user_id);

-- ─────────────────────────────────────────────────────
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────

-- Habilitar RLS en tabla proyectos
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en tabla tareas
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────
-- 4. POLÍTICAS DE SEGURIDAD PARA PROYECTOS
-- ─────────────────────────────────────────────────────

-- Política: Usuarios solo ven sus propios proyectos
CREATE POLICY "Users can view their own projects"
ON proyectos FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuarios solo pueden crear proyectos propios
CREATE POLICY "Users can create their own projects"
ON proyectos FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios solo pueden editar sus propios proyectos
CREATE POLICY "Users can update their own projects"
ON proyectos FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios solo pueden eliminar sus propios proyectos
CREATE POLICY "Users can delete their own projects"
ON proyectos FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────
-- 5. POLÍTICAS DE SEGURIDAD PARA TAREAS
-- ─────────────────────────────────────────────────────

-- Política: Usuarios solo ven sus propias tareas
CREATE POLICY "Users can view their own tasks"
ON tareas FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuarios solo pueden crear tareas propias
CREATE POLICY "Users can create their own tasks"
ON tareas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios solo pueden editar sus propias tareas
CREATE POLICY "Users can update their own tasks"
ON tareas FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios solo pueden eliminar sus propias tareas
CREATE POLICY "Users can delete their own tasks"
ON tareas FOR DELETE
USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────
-- 6. VERIFICAR QUE TODO ESTÁ FUNCIONANDO
-- ─────────────────────────────────────────────────────

-- Ver proyectos con sus usuarios
SELECT p.id, p.titulo, p.user_id, u.email 
FROM proyectos p 
LEFT JOIN auth.users u ON p.user_id = u.id;

-- Ver tareas con sus usuarios
SELECT t.id, t.titulo, t.user_id, u.email 
FROM tareas t 
LEFT JOIN auth.users u ON t.user_id = u.id;

-- Ver políticas activas
SELECT * FROM pg_policies;

-- ─────────────────────────────────────────────────────
-- 7. NOTAS IMPORTANTES
-- ─────────────────────────────────────────────────────

/*
✅ CON RLS HABILITADO:
- Cada usuario solo ve SUS proyectos y tareas
- No puede acceder a datos de otros usuarios
- Las políticas se aplican automáticamente
- Más seguro para producción

❌ ANTES DE RLS:
- Cualquiera podía ver todos los proyectos
- No había validación de propiedad
- Datos públicos

🔧 PROBLEMAS CONOCIDOS:
- Si tienes datos antiguos sin user_id, no serán visibles
- Debes migrar datos manuales O usarlos para llenar user_id
- Considera hacer backup antes de aplicar RLS

📊 MIGRATION DE DATOS EXISTENTES:
Si tienes proyectos/tareas sin user_id, puedes asignarlos:

UPDATE proyectos SET user_id = 'UUID_DEL_USUARIO' WHERE user_id IS NULL;
UPDATE tareas SET user_id = 'UUID_DEL_USUARIO' WHERE user_id IS NULL;

Donde UUID_DEL_USUARIO es el ID que te da Supabase Auth
*/

-- ─────────────────────────────────────────────────────
-- 8. ROLLBACK (Por si necesitas deshacer)
-- ─────────────────────────────────────────────────────

/*
-- Deshabilitar RLS (SOLO SI NECESITAS)
ALTER TABLE proyectos DISABLE ROW LEVEL SECURITY;
ALTER TABLE tareas DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas (si quieres empezar de nuevo)
DROP POLICY IF EXISTS "Users can view their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can create their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can update their own projects" ON proyectos;
DROP POLICY IF EXISTS "Users can delete their own projects" ON proyectos;

DROP POLICY IF EXISTS "Users can view their own tasks" ON tareas;
DROP POLICY IF EXISTS "Users can create their own tasks" ON tareas;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tareas;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tareas;

-- Eliminar columna user_id (CUIDADO - se pierden datos)
ALTER TABLE proyectos DROP COLUMN user_id;
ALTER TABLE tareas DROP COLUMN user_id;
*/
