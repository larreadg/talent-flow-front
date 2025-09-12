import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Comentario } from '../../../../../interfaces/comentario.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentariosService } from '../../../../../services/comentarios.service';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { HttpErrorResponse } from '@angular/common/http';

// Primeng
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-vacantes-comments',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    AvatarModule,
    PanelModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './vacantes-comments.component.html',
  styleUrl: './vacantes-comments.component.scss'
})
export class VacantesCommentsComponent implements OnInit {

  private fb = inject(FormBuilder)
  private api = inject(ComentariosService) 
  private toast = inject(MessageService)

  @Input() set vacanteEtapaId(id: string | undefined) {
    if(id) this.id = id
  }
  @Input() set vacanteEtapaTotal(total: number | undefined) {
    if(typeof total !== 'undefined') this.total = total 
  }

  id: string = ''
  total: number = 0
  comentarios: Comentario[] = []
  visible: boolean = false
  submitted: boolean = false
  loading: boolean = false
  form = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      [Validators.required]
    ),
    comentario: this.fb.nonNullable.control(
      '',
      [Validators.required]
    )
  })
  env = environment

  ngOnInit(): void {}

  getComentarios(){
    this.loading = true
    this.api.get(this.id).subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.loading = false
        const data: any = resp.data as any
        this.comentarios = data.data as Comentario[]
        this.total = this.comentarios.length
      },
      error: (_e: HttpErrorResponse) => {
        this.loading = false
        this.comentarios = []
      },
    })
  }

  submit(){
    this.submitted = true
    let body = this.form.getRawValue()
    this.api.post(body).subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.submitted = false
        this.form.reset()
        this.form.controls['id'].setValue(this.id)
        this.getComentarios()
      },
      error: (_e: HttpErrorResponse) => {
        this.submitted = false
      },
    })
  }

  openComments() {
    this.getComentarios()
    this.form.controls['id'].setValue(this.id)
    this.visible = true
  }

  deleteComment(id: string) {
    this.api.delete(id).subscribe({
      next: async () => {
        this.toast.add({ key: 'vacante-detail', severity: 'success', summary: this.env.appName, detail: `Comentario eliminado` })
        this.getComentarios()
      },
      error: () => {
        this.toast.add({ key: 'vacante-detail', severity: 'error', summary: this.env.appName, detail: `El comentario no pudo ser eliminado` })
      },
    })
  }

}
