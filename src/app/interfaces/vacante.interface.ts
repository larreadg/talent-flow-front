import { Departamento } from "./departamento.interface";
import { DiaNoLaboral } from "./dia-no-laboral.interface";
import { Proceso, ProcesoEtapa } from "./proceso.interface";
import { Sede } from "./sede.interface";

export interface VacanteEtapa {
    id: string;
    vacanteId: string;
    procesoEtapaId: string;
    fechaInicio: string;
    fechaFinalizacion: string;
    fechaCumplimiento: string;
    comentarios?:string;
    recursos?:string;
    procesoEtapa?: ProcesoEtapa;
    fechaInicioLabel?: string;
    fechaFinalizacionLabel?: string;
    fechaCumplimientoLabel?: string;
    estado: 'abierta' | 'pendiente' | 'finalizada';
    _count?: { comentarios?:number }
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
    sede?: Sede;
    etapasVacante?: Array<VacanteEtapa>;
    diasNoLaborales?: Array<DiaNoLaboral>;
    progress?: number;
    disabledDates?: string[]
}