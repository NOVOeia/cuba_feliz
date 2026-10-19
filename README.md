# Cuba Feliz — V5.2

Sitio público y portal administrativo en un solo `index.html`, con contenidos alojados en Supabase.

## Arquitectura
- GitHub: código del frontend
- Netlify: alojamiento del frontend
- Supabase: Auth, datos, Storage y políticas de seguridad (RLS)
- Administración: botón **Ingresar al portal**, ruta `/#portal`

## Despliegue de este repositorio
Este es un sitio estático sin proceso de compilación. En Netlify, conecta el repositorio `NOVOeia/cuba_feliz`, rama `main`, **Build command: vacío**, **Publish directory: .** (raíz del repositorio).

**Importante:** vincula el repositorio al sitio Netlify que ya existe, en lugar de crear otro sitio con una URL distinta.

## Actualizaciones
Los cambios de textos y tarjetas se guardan en Supabase y aparecen al recargar el sitio sin reconstruir el HTML. Cambios de código o estilos requieren un commit y despliegue en Netlify.

La clave `sb_publishable_` es pública por diseño. **Nunca** guardes la contraseña de Postgres, cadenas de conexión ni claves `service_role` o `sb_secret_` en este repositorio.

## Pendientes antes de producción final
- Validar inicio de sesión y edición/publicación desde Netlify.
- Añadir los videos y archivos aprobados de Camina por Cuba.
- Configurar un checkout real antes de aceptar aportaciones; los montos actuales no realizan cobros.
- Revisar imágenes, accesibilidad y permisos con el cliente.
