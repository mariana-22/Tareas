-- ⚠️ EJECUTA ESTO EN SUPABASE PARA ARREGLAR LOS ERRORES

-- 1. AGREGAR user_id A TABLA PROYECTOS
ALTER TABLE proyectos ADD COLUMN user_id UUID;

-- 2. AGREGAR user_id A TABLA TAREAS  
ALTER TABLE tareas ADD COLUMN user_id UUID;

-- 3. HABILITAR ROW LEVEL SECURITY
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;

-- 4. CREAR POLÍTICAS PARA PROYECTOS
DROP POLICY IF EXISTS "Users can view their own projects" ON proyectos;
CREATE POLICY "Users can view their own projects"
ON proyectos FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own projects" ON proyectos;
CREATE POLICY "Users can create their own projects"
ON proyectos FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects" ON proyectos;
CREATE POLICY "Users can update their own projects"
ON proyectos FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects" ON proyectos;
CREATE POLICY "Users can delete their own projects"
ON proyectos FOR DELETE
USING (auth.uid() = user_id);

-- 5. CREAR POLÍTICAS PARA TAREAS
DROP POLICY IF EXISTS "Users can view their own tasks" ON tareas;
CREATE POLICY "Users can view their own tasks"
ON tareas FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own tasks" ON tareas;
CREATE POLICY "Users can create their own tasks"
ON tareas FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tasks" ON tareas;
CREATE POLICY "Users can update their own tasks"
ON tareas FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON tareas;
CREATE POLICY "Users can delete their own tasks"
ON tareas FOR DELETE
USING (auth.uid() = user_id);

-- 6. VERIFICAR QUE FUNCIONA
SELECT * FROM pg_policies WHERE tablename IN ('proyectos', 'tareas');
SELECT column_name, data_type FROM information_schema.columns WHERE table_name IN ('proyectos', 'tareas');
