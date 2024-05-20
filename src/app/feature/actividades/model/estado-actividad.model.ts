export enum EstadoActividad {
  POR_HACER = "POR_HACER",
  EN_PROGRESO = "EN_PROGRESO",
  EN_REVISION = "EN_REVISION",
  COMPLETADA = "COMPLETADA",

}

export const EstadoActividadMap = new Map([
  ["POR_HACER", "Por hacer"],
  ["EN_PROGRESO", "En progreso"],
  ["EN_REVISION", "En revisión"],
  ["COMPLETADA", "Completada"]
]);
