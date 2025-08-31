import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { UsuariosService } from '../../../../services/usuarios.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { nonEmpty } from '../../../../utils/utils';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { Rol } from '../../../../interfaces/rol.interface';

// Primeng
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-usuarios-add',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: './usuarios-add.component.html',
  styleUrl: './usuarios-add.component.scss'
})
export class UsuariosAddComponent implements OnInit {
  private toast = inject(MessageService)
  private api = inject(UsuariosService)
  private fb   = inject(FormBuilder)
  submitted = false
  env = environment
  @Output() changed = new EventEmitter<boolean>()
  form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control(
      '',
      [Validators.required, Validators.email, nonEmpty]
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
  });
  roles: Rol[] = []

  get f() { return this.form.controls }

  ngOnInit(): void {
    this.getRoles()
  }

  submit() {
    this.submitted = true
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const body = this.form.getRawValue()
    this.api.post(body).subscribe({
      next: async(resp) => {
        this.submitted = false
        this.toast.add({ key: 'usuarios', severity: 'success', summary: this.env.appName, detail: `El usuario fue creado. Para activar la cuenta, se ha enviado un correo a ${body.email}`, life: 6000 })
        this.form.reset()
        this.changed.emit(true)
      },
      error: (e) => {
        this.toast.add({ key: 'usuarios', severity: 'error', summary: this.env.appName, detail: 'Error al crear usuario' })
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
