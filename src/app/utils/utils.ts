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