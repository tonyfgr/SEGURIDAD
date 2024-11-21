import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.component.html',
  styleUrls: ['./camara.component.css']
})
export class CamaraComponent implements OnInit {

  accidentes: any = {
    casco: '',
    chaleco: '',
    zapatos: '',
    guantes: ''
  };

  menuVisible = false;
  
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-container')) {
      this.menuVisible = false;
    }
  }

  goToConfig() {
    console.log('Configuración seleccionada');
    this.menuVisible = false;
  }

  logout() {
    console.log('Salir seleccionado');
    this.menuVisible = false;
  }

  videoUrl: string = 'http://localhost:5000/video_feed';
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getInfracciones().subscribe(data => {
      this.accidentes = data;
    });
    this.checkEppStatus();
  }

  checkEppStatus() {
    setInterval(() => {
      this.http.get('http://localhost:5000/epp_status').subscribe((status: any) => {
        if (!status.casco) this.logInfraccion('casco');
        if (!status.chaleco) this.logInfraccion('chaleco');
        if (!status.zapatos) this.logInfraccion('zapatos');
        if (!status.guantes) this.logInfraccion('guantes');
      });
    }, 5000); // Llama cada 5 segundos
  }

  logInfraccion(tipo: string) {
    this.http.post(`http://localhost:5002/log_infraccion`, { tipo }).subscribe(
      response => console.log(`Infracción de ${tipo} registrada`, response),
      error => console.error(`Error registrando infracción de ${tipo}`, error)
    );
  }
}
