export interface Usuario {
    activo?: boolean;
    apellido?: string;
    departamentoId?: number;
    email?: string;
    empresaId?: number;
    fc?: string;
    fm?: string;
    id?: string;
    nombre?: string;
    sedeId?: number;
    telefono?: string;
    username?: string;
    empresa?: { nombre: string };
}