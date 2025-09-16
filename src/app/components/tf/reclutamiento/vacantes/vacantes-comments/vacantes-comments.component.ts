import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Comentario } from '../../../../../interfaces/comentario.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentariosService } from '../../../../../services/comentarios.service';
import { TalentFlowResponse } from '../../../../../interfaces/talentflow.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

// Primeng
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarModule } from 'primeng/avatar';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-vacantes-comments',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    AvatarModule,
    PanelModule,
    TagModule,
    CommonModule,
    TooltipModule,
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
    if(id) {
      this.id = id

      if(this.type === 'plain') {
        this.getComentarios()
      }
    }
  }
  @Input() set vacanteEtapaTotal(total: number | undefined) {
    if(typeof total !== 'undefined') this.total = total 
  }
  @Input() type!: 'btn' | 'tag' | 'plain';

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
  @Output() changed = new EventEmitter<number>()

  ngOnInit(): void {}

  getComentarios(){
    this.loading = true
    this.api.get(this.id).subscribe({
      next: async (resp: TalentFlowResponse) => {
        this.loading = false
        const data: any = resp.data as any
        this.comentarios = data.data as Comentario[]
        this.total = this.comentarios.length
        this.changed.emit(this.total)
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
