export interface Usuario {
    activo: boolean;
    apellido: string;
    departamentoId: string;
    email: string;
    empresaId: string;
    rolId: string;
    fc: string;
    fm: string;
    id: string;
    nombre: string;
    sedeId: string;
    telefono: string;
    username: string;
    empresa: { nombre: string };
    rol: { nombre: string };
}