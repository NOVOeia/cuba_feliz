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


## V5.5 — Contenido sincronizado y galería circular

**Fuente principal de contenido:** Supabase `public.cf_sections`. Las páginas leen la misma sección por ID mediante claves de `settings`: `shared_items_from`, `shared_fields_from`, `shared_item_keys` o `shared_amounts_from`. Los elementos de una tarjeta también pueden tener `shared_from_section`.

| Editar UNA SOLA VEZ en el dashboard | También se muestra en |
| --- | --- |
| Inicio → Camina por Cuba → Tarjetas | Camina por Cuba → galería circular de cinco tarjetas |
| Inicio → Camina por Cuba → título, subtítulo, texto | Cabecera de Camina por Cuba |
| Inicio → Iniciativas → tarjetas | Página Otras iniciativas, solo las cuatro iniciativas comunes |
| Inicio → Casa Luz → textos e imagen | Página Casa Luz y su tarjeta de iniciativas |
| Inicio → Plétora → textos e imagen | Página Plétora y su tarjeta de iniciativas |
| Inicio → Cierre / Gotas → montos sugeridos | Página Gotas de Felicidad |

La página de detalle conserva su diseño y puede tener encabezados, botones y textos introductorios exclusivos que NO se sincronizan si responden a otro propósito editorial.

**Editar una tarjeta sincronizada:** Entra a `/#portal`, abre Camina por Cuba (o la página vinculada), pestaña «Tarjetas / elementos», y usa «Abrir tarjetas originales». El dashboard te llevará a la sección fuente en Inicio. Edítala y pulsa «Publicar cambios». Refresca las páginas afectadas. No hace falta nuevo commit ni nueva carga de HTML para actualizar las imágenes, videos, textos y miniaturas.

**Animación de galería:** En Camina por Cuba las tarjetas aparecen en un carrusel horizontal con imágenes circulares, navegación mediante flechas/teclado y desplazamiento táctil. Al pulsar se muestra una ficha ampliada; los videos tienen portadas y un reproductor independiente. El Home conserva su distribución original.

**Importante:** los `items` antiguos de las secciones enlazadas pueden permanecer como respaldo en la base de datos, pero la V5.5 los ignora para renderizar: el origen es siempre la sección maestra publicada. Si la fuente deja de estar publicada, no se renderiza una copia obsoleta.

**Pruebas de validación:** JavaScript comprobado con Node y referencias de contenido verificadas con pruebas unitarias usando datos simulados; el navegador Chromium del entorno de edición denegó navegación automatizada, así que el despliegue y la apertura de modales deben comprobarse en el sitio publicado.
