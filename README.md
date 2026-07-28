# Valset Academy — Advanced English Dashboard

Sitio estático listo para publicar con GitHub Pages.

## Archivos principales

- `index.html`: interfaz completa de inicio de sesión y dashboard.
- `styles.css`: diseño visual y adaptación para móvil.
- `app.js`: navegación, lecciones, ejercicios, progreso y validación del login.
- `users.js`: lista editable de usuarios y contraseñas.
- `assets/valset-logo.png`: logotipo.
- `assets/course-introduction.mp4`: video de introducción.

## Cómo añadir estudiantes

Abre `users.js` y agrega un objeto dentro de `window.STUDENT_USERS`:

```js
{
  username: "maria2026",
  password: "EnglishC1!",
  displayName: "María López",
  level: "C1",
  group: "Advanced English"
},
```

Reglas:

1. Separa cada usuario con una coma.
2. No repitas el mismo `username`.
3. Conserva las comillas y los nombres de las propiedades.
4. Evita tildes y espacios en `username`.

## Publicar en GitHub Pages

1. Sube todos los archivos, conservando la carpeta `assets`.
2. En el repositorio abre **Settings → Pages**.
3. En **Build and deployment**, selecciona **Deploy from a branch**.
4. Selecciona `main` y `/ (root)`.
5. Guarda y espera a que GitHub publique el sitio.

## Aviso de seguridad

GitHub Pages publica sitios estáticos. Cualquier contraseña almacenada en `users.js` puede ser inspeccionada por una persona con conocimientos técnicos. Este login sirve como control visual o demostración, pero no protege contenido sensible.

Para acceso real y seguro, usa un servicio de autenticación como Firebase Authentication, Supabase Auth, Auth0 o un servidor propio.
