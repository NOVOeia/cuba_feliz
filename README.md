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


## Video y miniaturas — Camina por Cuba (V5.4)

1. Abre la web publicada y selecciona **Ingresar al portal**.
2. En el dashboard abre **Inicio → Camina por Cuba → Tarjetas / elementos**.
3. Elige la tarjeta (Aprende, Conecta, Multiplica, Encuéntrate o Aporta).
4. En **Imagen o video**, selecciona **Video** y pega la URL de YouTube/Vimeo o del archivo MP4/WebM, o sube el video a Supabase Storage.
5. En **Miniatura / portada del video**, pega la URL de una imagen o usa **Subir una miniatura desde tu computadora**. Preferiblemente JPG o WebP de **1280 × 720 píxeles (16:9)**. Para YouTube, si no indicas miniatura se intenta usar la miniatura pública del video.
6. Ajusta **Encuadre de imagen o miniatura** a centro/arriba/abajo según la composición.
7. Pulsa **Publicar cambios** y actualiza la web pública.

Las tarjetas ya no muestran números 01/05, 02/05, etc. La miniatura se mantiene visible hasta que el usuario toca **Reproducir video**; entonces se abre un reproductor amplio en una ventana modal, sin recortar el video. El botón de cerrar detiene la reproducción. Para Vimeo y archivos propios sin miniatura personalizada, se muestra una portada visual morada con icono de reproducción en vez de un fotograma negro.

La miniatura y la URL se almacenan dentro del JSONB `media.poster` / `media.url` de la tarjeta, así que cambios de portada y de video hechos desde el dashboard **no requieren nuevos despliegues**. Los cambios de componentes/CSS sí requieren commit a GitHub y despliegue desde Netlify.

**Nota:** el acceso del dashboard y el guardado real en Supabase deben verificarse con una sesión autorizada; las pruebas automáticas de UI realizadas antes de este commit utilizaron respuestas simuladas de la API.
