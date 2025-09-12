import { Etapa } from "./etapa.interface";

export interface Proceso {
    id: string;
    empresaId: string;
    nombre: string;
    activo: boolean;
}

export interface ProcesoEtapa {
    id: string;
    procesoId: string;
    etapaId: string;
    orden: number;
    proceso?:Proceso;
    etapa?:Etapa;
}