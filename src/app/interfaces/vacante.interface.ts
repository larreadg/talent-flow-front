import { Departamento } from "./departamento.interface";
import { DiaNoLaboral } from "./dia-no-laboral.interface";
import { Proceso } from "./proceso.interface";

export interface VacanteEtapa {
    id: string;
    vacanteId: string;
    procesoEtapaId: string;
    fechaInicio: string;
    fechaFinalizacion: string;
    fechaCumplimiento: string;
    comentarios?:string;
    recursos?:string;
}

export interface Vacante {
    id: string;
    nombre: string;
    empresaId: string;
    procesoId: string;
    departamentoId: string;
    sedeId: string;
    fechaInicio: string;
    estado: 'abierta' | 'cerrada' | 'pausada' | 'cancelada';
    activo: boolean;
    proceso?: Proceso;
    departamento?: Departamento;
    etapasVacante?: Array<VacanteEtapa>;
    diasNoLaborales?: Array<DiaNoLaboral>;
}