// Entidad de dominio: describe un proveedor/modelo de IA sin saber cómo se conecta.
export interface AIProvider {
  id: string;     // identificador único, ej: "gemini-flash"
  name: string;   // nombre para mostrar, ej: "Gemini Flash"
  model: string;  // modelo concreto, ej: "gemini-3-flash-preview"
}
