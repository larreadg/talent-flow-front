import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const nonEmpty: ValidatorFn = (c: AbstractControl): ValidationErrors | null => {
    return typeof c.value === 'string' && c.value.trim().length === 0 ? { empty: true } : null;
};

export const passwordRulesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const v: string = control.value ?? '';

  const checks = {
    length: v.length >= 8,
    lower : /[a-z]/.test(v),
    upper : /[A-Z]/.test(v),
    digit : /\d/.test(v),
    symbol: /[^\w\s]/.test(v), // cualquier símbolo (no letra/dígito/espacio)
  };

  // si falta alguno, devolvemos errores; si todos pasan, null
  const allOk = Object.values(checks).every(Boolean);
  return allOk ? null : { passwordRules: checks };
};

export const tiposDnl = [
  {
    descripcion: 'Evento de la empresa',
    tipo: 'empresa'
  },
  {
    descripcion: 'Feriado nacional',
    tipo: 'nacional'
  }
]

// export const vacantesEstados = ['abierta', 'cerrada', 'pausada', 'cancelada']

export const vacantesEstados = [
  {label: 'Abierta',   value: 'abierta'},
  {label: 'Pausada',   value: 'pausada'},
  {label: 'Finalizada',   value: 'finalizada'},
  {label: 'Cancelada', value: 'cancelada'},
];

export const vacantesEstadosEditable = [
  {label: 'Abierta',   value: 'abierta'},
  {label: 'Pausada',   value: 'pausada'},
  {label: 'Cancelada', value: 'cancelada'},
];

export const vacantesResultados = [
  {label: 'Promoción Interna',   value: 'promocion_interna'},
  {label: 'Traslado',   value: 'traslado'},
  {label: 'Contratación Externa', value: 'contratacion_externa'},
];

export function pickVar(css: CSSStyleDeclaration, fallback: string, names: string[]) {
  for (const n of names) {
    const v = css.getPropertyValue(n)?.trim();
    if (v) return v;
  }
  return fallback;
}