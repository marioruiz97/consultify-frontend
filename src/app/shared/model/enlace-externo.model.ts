import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface EnlaceExterno {
  faIcon: IconProp;
  nombre: string;
  caption?: string;
  url: string;
  target: "_blank" | "_self";
}
