import { Component, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';

// Primeng
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { BehaviorSubject, EMPTY, interval, map, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    BlockUIModule,
    ProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  env = environment
  // inputs
  private baseText$ = new BehaviorSubject<string>('Cargando');
  readonly visible$  = new BehaviorSubject<boolean>(false);

  @Input() set visible(v: boolean) { this.visible$.next(v); }
  @Input() set text(t: string | undefined) {
    this.baseText$.next((t ?? 'Cargando').replace(/\.*$/, ''));
  }

  // "Cargando.", "..", "..." (cíclico)
  displayText$ = this.visible$.pipe(
    switchMap(v => v ? interval(400) : EMPTY),
    map(i => '.'.repeat((i % 3) + 1)),
    switchMap(dots => this.baseText$.pipe(map(txt => `${txt}${dots}`)))
  );

  info = 'Cargando';
}
