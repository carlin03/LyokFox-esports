# LyokFox — Supabase + GitHub + Vercel

Guía paso a paso para poner en marcha **inicio de sesión**, **perfil en la nube**, **Studio CMS** y la web pública.

---

## Resumen rápido

| Pieza | Para qué |
|-------|----------|
| **Supabase** | Login email/contraseña, tabla `profiles`, KP en la nube |
| **GitHub** | Código del proyecto y deploy automático |
| **Vercel** | Hosting de la web estática + variables de entorno |
| **LyokFox Studio** | Editar la web (PIN `lyokfox`) — sigue en localStorage del navegador |

---

## 1. Crear proyecto Supabase

1. Entra en [https://supabase.com](https://supabase.com) → **New project**.
2. Elige organización, nombre (`lyokfox`), contraseña de base de datos (guárdala).
3. Región: **West EU (Frankfurt)** o la más cercana a España.
4. Espera ~2 min a que el proyecto esté listo.

### Ejecutar las migraciones SQL

1. En el panel Supabase: **SQL Editor** → **New query**.
2. Pega y ejecuta **en orden**:
   - `supabase/migrations/20250622120000_camada_profiles.sql`
   - `supabase/migrations/20250622130000_auth_profiles_sync.sql`
   - `supabase/migrations/20250622140000_site_cms.sql`
3. Comprueba en **Table Editor** que existen `profiles`, `twitter_posts`, `kp_claims`.

### Auth (email)

1. **Authentication** → **Providers** → **Email** → activado.
2. Para pruebas rápidas: **Authentication** → **Settings** → desactiva *Confirm email* (opcional en desarrollo).
3. En producción: deja confirmación activada y configura plantillas de email.

### URLs de redirección (recuperar contraseña)

1. **Authentication** → **URL Configuration**.
2. **Site URL**: `https://lyokfox.vercel.app` (o tu dominio).
3. **Redirect URLs** (añade todas las que uses):
   - `http://localhost:3000/login.html`
   - `https://lyokfox.vercel.app/login.html`
   - `https://tu-proyecto.vercel.app/login.html`

### Obtener claves API

1. **Project Settings** → **API**.
2. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`  
   ⚠️ **Nunca** subas la clave `service_role` al frontend ni a GitHub.

### Configurar la web localmente

Copia el ejemplo y rellena:

```bash
copy js\supabase-config.example.js js\supabase-config.js
```

Edita `js/supabase-config.js`:

```javascript
window.SUPABASE_CONFIG = {
  url: 'https://xxxxx.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  enabled: true
};
```

Prueba:

```bash
npm run dev
```

- `http://localhost:3000/login.html` — crear cuenta / entrar  
- `http://localhost:3000/cuenta.html` — editar perfil completo  
- `http://localhost:3000/comunidad.html` — KP (sincroniza si hay sesión)

---

## 2. Subir el proyecto a GitHub

### Si aún no tienes repositorio

```bash
cd C:\Users\usuario\Desktop\LyokFox
git init
git add .
git commit -m "LyokFox: web + Studio + auth Supabase"
```

Crea repo en GitHub (vacío, sin README) y:

```bash
git remote add origin https://github.com/TU_USUARIO/lyokfox.git
git branch -M main
git push -u origin main
```

### Qué NO subir

Ya está en `.gitignore`:

- `.vercel`, `node_modules`
- Opcional: mantén `js/supabase-config.js` con claves vacías en el repo y usa solo variables en Vercel (recomendado).

---

## 3. Desplegar en Vercel

### Opción A — Conectar GitHub (recomendado)

1. [https://vercel.com](https://vercel.com) → **Add New** → **Project**.
2. Importa el repo `lyokfox`.
3. **Framework**: Other (sitio estático).
4. **Build Command**: `node scripts/write-supabase-config.js`
5. **Output Directory**: `.` (raíz del proyecto).
6. **Environment Variables** (Production + Preview):

| Variable | Valor |
|----------|--------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | tu anon key |

7. Deploy.

### Opción B — CLI (como ahora)

```bash
set SUPABASE_URL=https://xxxxx.supabase.co
set SUPABASE_ANON_KEY=eyJ...
node scripts/write-supabase-config.js
npm run deploy
```

En Vercel dashboard añade las mismas variables para futuros deploys automáticos.

### URLs en Vercel

El proyecto ya incluye `vercel.json` con redirects:

- `/login` → `login.html`
- `/cuenta` → `cuenta.html`
- etc.

---

## 4. Flujo de usuario final

1. **Invitado** — entra en Comunidad, elige apodo, KP en `localStorage`.
2. **Registro** — `login.html` → Crear cuenta → email + apodo.
3. **Sincronización** — al iniciar sesión, `camada-sync.js` sube/baja KP y perfil desde `profiles`.
4. **Mi cuenta** — `cuenta.html`: perfil, redes, KP, exportar datos, cerrar sesión.
5. **Cabecera** — enlace **Entrar** / **Mi cuenta** según sesión.

---

## 5. LyokFox Studio (CMS)

- Botón **✦ Studio** en cualquier página (PIN por defecto: `lyokfox`).
- Al abrir el Studio se cargan **todos los datos** (noticias, jugadores, historia, sponsor…) aunque estés en otra página.
- Los editores muestran el **texto real** de la web (archivos JS + lo guardado).
- **Local:** cambios en `localStorage` del navegador.
- **Nube (Supabase):** si configuras Supabase y ejecutas la migración `20250622140000_site_cms.sql`:
  1. Todos los visitantes **leen** el CMS desde la tabla `site_cms`.
  2. Al **Guardar todo** en el Studio, si hay **sesión iniciada** (`login.html`), se publica para todos.
  3. Sin sesión: guarda solo en tu navegador (mensaje al guardar).

### Migración CMS en Supabase

En **SQL Editor**, ejecuta también:

- `supabase/migrations/20250622140000_site_cms.sql`

### Publicar cambios para todos

1. Crea cuenta admin en `login.html`.
2. Edita en Studio → **Guardar todo**.
3. Verás *«Guardado y publicado en la nube»* si la sesión está activa.

---

## 6. Comprobaciones post-deploy

- [ ] `login.html` — registro y login sin errores en consola  
- [ ] `cuenta.html` — banner verde “Sesión: email@…”  
- [ ] Supabase **Authentication** → Users — aparece el usuario  
- [ ] Supabase **Table Editor** → `profiles` — fila con nickname y KP  
- [ ] Cambiar apodo en cuenta → **Guardar** → refrescar → persiste  
- [ ] Studio → Guardar cambios → recarga web  

---

## 7. Solución de problemas

| Problema | Solución |
|----------|----------|
| “Supabase no configurado” | Rellena `supabase-config.js` o variables Vercel + rebuild |
| Email no llega | Revisa spam; desactiva confirm email en dev |
| Error RLS al guardar perfil | Ejecuta migración `20250622130000_auth_profiles_sync.sql` |
| CORS / redirect password | Añade URL exacta en Supabase → URL Configuration |
| KP no sincroniza | Pulsa **Sincronizar ahora** en cuenta; comprueba sesión activa |

---

## 8. Comandos útiles

```bash
npm run dev          # Local http://localhost:3000
npm run deploy       # Vercel producción (ambos proyectos)
node scripts/write-supabase-config.js   # Regenerar config desde env
```

---

## Archivos clave del auth

| Archivo | Función |
|---------|---------|
| `login.html` | Entrar / registrar / recuperar contraseña |
| `cuenta.html` | Perfil completo + sync |
| `js/supabase-config.js` | URL y anon key |
| `js/auth.js` | Cliente Supabase Auth |
| `js/camada-sync.js` | Sincronía KP local ↔ nube |
| `js/account-app.js` | Formularios cuenta y panel perfil |

¿Dudas? Revisa la consola del navegador (F12) y los logs de **Supabase** → **Logs** → **Auth**.
