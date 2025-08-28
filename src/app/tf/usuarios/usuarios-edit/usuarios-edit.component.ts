import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario.interface';
import { MessageService } from 'primeng/api';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { nonEmpty } from '../../../utils/utils';
import { CommonModule } from '@angular/common';
import { Rol } from '../../../interfaces/rol.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-usuarios-edit',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './usuarios-edit.component.html',
  styleUrl: './usuarios-edit.component.scss'
})
export class UsuariosEditComponent implements OnInit {
  @Input() set usuario(u:Usuario | undefined) {
    if(u) {
      this.setInfo(u)
    }
  }
  private toast = inject(MessageService)
  private api = inject(UsuariosService)
  private fb   = inject(FormBuilder)
  @Output() changed = new EventEmitter<boolean>()
  submitted = false
  env = environment
  form = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
      ]
    ),
    nombre: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        nonEmpty,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)
      ]
    ),
    apellido: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        nonEmpty,
        Validators.minLength(2),
        Validators.maxLength(60),
        Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/)
      ]
    ),
    telefono: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern(/^595\d{9}$/) // 595 + 9 dígitos
      ]
    ),
    rolId: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
      ]
    ),
    activo: this.fb.nonNullable.control(
      false,
      [
        Validators.required,
      ]
    ),
  })
  roles: Rol[] = []

  ngOnInit(): void {
    this.getRoles()
  }

  setInfo(u: Usuario) {
    console.log(u)
    this.form.controls['nombre'].setValue(u.nombre)
    this.form.controls['apellido'].setValue(u.apellido)
    this.form.controls['telefono'].setValue(u.telefono)
    this.form.controls['id'].setValue(u.id)
    this.form.controls['rolId'].setValue(u.rolId)
    this.form.controls['activo'].setValue(u.activo)
  }

  get f() { return this.form.controls }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const body = this.form.getRawValue()
    this.api.patch(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'usuarios', severity: 'success', summary: this.env.appName, detail: `El usuario fue actualizado` })
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'usuarios', severity: 'error', summary: this.env.appName, detail: 'Error al actualizar usuario' })
        this.submitted = false
      }
    })
  }

  getRoles = () => {
    this.api.getRoles().subscribe({
      next: async(resp) => {
        this.roles = <Rol[]> resp.data
      },
      error: (e) => {
        this.roles = []
      }
    })
  }
}
