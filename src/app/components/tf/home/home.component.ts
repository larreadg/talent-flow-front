import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { VacantesService } from '../../../services/vacantes.service';
import { CommonModule } from '@angular/common';

// Primeng
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardModule,
    BadgeModule,
    ButtonModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  private apiVacantes = inject(VacantesService)
  private router = inject(Router)
  
  env = environment
  vacantesEstadosLoading: boolean = false
  vacantesEstados: any[] = []

  ngOnInit(): void {
    this.getResumenPorEstado()
  }

  getResumenPorEstado() {
    this.vacantesEstadosLoading = true
    this.apiVacantes.getResumenPorEstado().subscribe({
      next: async(resp) => {
        this.vacantesEstados = <any[]> resp.data
        this.vacantesEstadosLoading = false
      },
      error: (e) => {
        this.vacantesEstados = []
        this.vacantesEstadosLoading = false
      }
    })
  }

  addVacanteOpen = () => {
    this.router.navigate(['/tf/reclutamiento/vacantes'], { queryParams: { modal: 'add' } })
  }
}
