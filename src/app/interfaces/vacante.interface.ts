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
    estado: 'abierta' | 'pendiente' | 'finalizada';
    comentarios?:string;
    recursos?:string;
    procesoEtapa?: ProcesoEtapa;
    fechaInicioLabel?: string;
    fechaFinalizacionLabel?: string;
    fechaCumplimientoLabel?: string;
    _count: { comentarios:number }
    totalRetrasoDias?:number;
    totalDias?:number;
}

export interface Vacante {
    id: string;
    nombre: string;
    empresaId: string;
    procesoId: string;
    departamentoId: string;
    sedeId: string;
    aumentoDotacion:boolean;
    resultado: 'promocion_interna' | 'traslado' | 'contratacion_externa' | null;
    fechaInicio: string;
    estado: 'abierta' | 'finalizada' | 'pausada' | 'cancelada';
    activo: boolean;
    proceso?: Proceso;
    departamento?: Departamento;
    sede?: Sede;
    etapasVacante?: Array<VacanteEtapa>;
    diasNoLaborales?: Array<DiaNoLaboral>;
    progress?: number;
    disabledDates?: string[]
}