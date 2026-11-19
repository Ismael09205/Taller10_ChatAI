/**
 * Convierte una respuesta en Markdown a texto plano legible.
 * Se aplica en la capa de datos para que la UI reciba texto limpio.
 */
export function cleanMarkdown(text: string): string {
  return text
    // Bloques de código ```lang ... ``` -> solo el contenido
    .replace(/```[\w-]*\n?([\s\S]*?)```/g, '$1')
    // Código en línea `x` -> x
    .replace(/`([^`]+)`/g, '$1')
    // Imágenes ![alt](url) -> alt
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Enlaces [texto](url) -> texto
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Etiquetas HTML <tag> o </tag>
    .replace(/<\/?[a-zA-Z][^>]*>/g, '')
    // Títulos ### Título -> Título
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    // Citas > texto -> texto
    .replace(/^\s*>\s?/gm, '')
    // Líneas separadoras --- *** ___
    .replace(/^\s*([-*_])(\s*\1){2,}\s*$/gm, '')
    // Viñetas * item / - item / + item -> • item
    .replace(/^(\s*)[*+-]\s+/gm, '$1• ')
    // Negrita y cursiva: ***x***, **x**, __x__, *x*, _x_
    .replace(/(\*\*\*|___)(.+?)\1/g, '$2')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])\*(?!\s)(.+?)\*(?!\w)/g, '$1$2')
    .replace(/(^|[^\w])_(?!\s)(.+?)_(?!\w)/g, '$1$2')
    // Tachado ~~x~~
    .replace(/~~(.+?)~~/g, '$1')
    // Asteriscos sueltos que hayan quedado
    .replace(/\*+/g, '')
    // Espacios al final de línea y saltos de línea repetidos
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
