export enum TipoDocumento {

  CC,
  CE,
  PA,
  NIT,
  TI,

}

export const TipoDocumentoMap = new Map([
  ["CC", "Cédula de Ciudadanía"],
  ["CE", "Cédula de extranjería"],
  ["PA", "Pasaporte"],
  ["NIT", "NIT"],
  ["TI", "Tarjeta de identidad"]
]);
