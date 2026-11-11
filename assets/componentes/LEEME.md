# Componentes Piki (exportados de Figma)

Cada carpeta es un componente: `nombre.html` (ejemplo con todas sus variantes) y `nombre.css` (sus estilos).
`index.html` muestra el catálogo completo. `base.css` carga la fuente Poppins y un reseteo mínimo.

## Cómo usar uno en tu página
1. En el <head> enlazá `base.css` y el CSS del componente:
   <link rel="stylesheet" href="componentes/base.css">
   <link rel="stylesheet" href="componentes/component-4/component-4.css">
2. Copiá desde `component-4.html` el bloque de la variante que quieras (cada una arranca con un comentario <!-- Propiedad 1=... -->).
3. Para cambiar de estado, cambiá la clase modificadora del elemento raíz, por ejemplo
   `component-4--predeterminado` → `component-4--variante-2` (y su contenido, que puede variar entre variantes).

Las medidas están en px exactos de Figma (posicionamiento absoluto dentro de cada componente), así que se ven igual que en la app.
Los íconos, músculos y anillos de progreso van como SVG dentro del HTML; los textos son texto real y editable.
