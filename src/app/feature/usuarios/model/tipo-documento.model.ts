export enum TipoDocumento {
  CC = "CC",
  CE = "CE",
  PA = "PA",
  NIT = "NIT",
  TI = "TI",

}

export const TipoDocumentoMap = new Map([
  ["CC", "Cédula de Ciudadanía"],
  ["CE", "Cédula de extranjería"],
  ["PA", "Pasaporte"],
  ["NIT", "NIT"],
  ["TI", "Tarjeta de identidad"]
]);
