export interface DiaNoLaboral {
    id: string;
    nombre: string;
    tipo: 'nacional' | 'empresa';
    fecha: string;
    empresaId: string;
    activo: boolean;
}