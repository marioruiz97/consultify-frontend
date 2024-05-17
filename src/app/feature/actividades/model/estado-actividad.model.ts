export enum EstadoActividad {
  POR_HACER,
  EN_PROGRESO,
  EN_REVISION,
  COMPLETADA,

}

export const EstadoActividadMap = new Map([
  ["POR_HACER", "Por hacer"],
  ["EN_PROGRESO", "En progreso"],
  ["EN_REVISION", "En revisión"],
  ["COMPLETADA", "Completada"]
]);
