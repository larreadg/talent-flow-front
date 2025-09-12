import { VacanteEtapa } from './vacante.interface';

export interface Comentario {
  id: string;
  vacanteEtapaId: string;
  comentario: string;
  uc: string;
  fc: string;
  fcLabel: string;
  um: string;
  fm: string;
  vacanteEtapa?: VacanteEtapa;
  autor: { id: string, email: string, nombre: string, apellido: string, iniciales: string }
}
