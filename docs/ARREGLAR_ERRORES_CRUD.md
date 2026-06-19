# 🔧 SOLUCIÓN RÁPIDA - Arreglar Errores CRUD

## 🚨 El Problema

Todos los errores 400 ocurren porque:
```
❌ "Could not find the 'user_id' column of 'tareas' in the schema cache"
```

**Las columnas `user_id` NO EXISTEN en tus tablas de Supabase.**

---

## ✅ Solución: Ejecutar SQL en Supabase (5 minutos)

### **PASO 1: Abre Supabase Dashboard**

1. Ve a https://app.supabase.com/project/[TU-PROYECTO]
2. Click en **"SQL Editor"** (lado izquierdo)

### **PASO 2: Copia el SQL**

Abre este archivo en tu proyecto:
```
docs/QUICK_FIX.sql
```

O copia directamente:

```sql
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
```

### **PASO 3: Ejecuta en Supabase**

1. En SQL Editor, pega TODO el código arriba
2. Presiona **Ctrl + Enter** (o click en ▶️ Run)
3. Espera 5-10 segundos
4. Deberías ver ✅ Sin errores

### **PASO 4: Verifica que Funcionó**

Si ves algo como esto, ¡FUNCIONÓ! ✅

```
QUERY RESULT
0 rows

SELECT * FROM pg_policies WHERE tablename IN ('proyectos', 'tareas');
8 rows

CREATE POLICY ...
CREATE POLICY ...
...
```

---

## 🧪 Prueba Después

1. Recarga la app: **F5**
2. **Crea un proyecto** ✅
3. **Crea una tarea** ✅
4. **Ver dashboard** ✅

Los errores 400 deberían desaparecer.

---

## 📋 Qué Hace el SQL

| Comando | Qué Hace | Por Qué |
|---------|----------|---------|
| `ALTER TABLE ... ADD COLUMN user_id UUID` | Agrega columna `user_id` | Para asociar datos al usuario |
| `ENABLE ROW LEVEL SECURITY` | Activa seguridad por filas | Cada usuario ve solo sus datos |
| `CREATE POLICY` | Define quién puede ver/crear/editar | Protege datos |
| `SELECT * FROM pg_policies` | Verifica políticas | Asegurar que se crearon |

---

## 🆘 Si Falla

### Error: "Column already exists"
**Significa:** Ya existe `user_id` (corriste el script dos veces)
**Solución:** Continúa, no hay problema

### Error: "Syntax error"
**Significa:** Copiaste mal el código
**Solución:** Abre `docs/QUICK_FIX.sql` y copia de nuevo

### Error: "Permission denied"
**Significa:** No tienes permisos en Supabase
**Solución:** Asegúrate de estar logueado como owner del proyecto

### Sigue viendo errores 400
**Significa:** El SQL no se ejecutó correctamente
**Solución:** Verifica que llegó el mensaje ✅ en Supabase

---

## ✅ Checklist Final

- [ ] Abrí Supabase Dashboard
- [ ] Copié el SQL de `docs/QUICK_FIX.sql`
- [ ] Ejecuté en SQL Editor
- [ ] Vi ✅ Sin errores
- [ ] Recargué la app (F5)
- [ ] Creé un proyecto - ✅ funciona
- [ ] Creé una tarea - ✅ funciona
- [ ] Vi dashboard - ✅ funciona

Si todo ✅ → **Los errores están ARREGLADOS!** 🎉

---

## 📞 Si Algo Anda Mal

1. **Verifica que las tablas existen:**
   ```sql
   SELECT * FROM proyectos LIMIT 1;
   SELECT * FROM tareas LIMIT 1;
   ```

2. **Verifica que user_id existe:**
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name='proyectos';
   ```

3. **Verifica que RLS está habilitado:**
   ```sql
   SELECT * FROM pg_tables 
   WHERE tablename IN ('proyectos', 'tareas');
   ```

Si necesitas ayuda, toma screenshot del error y comparte.

---

**Tiempo estimado:** 5 minutos  
**Dificultad:** Muy fácil (solo copiar/pegar)  
**Resultado:** CRUD funcional al 100% ✅
