import { Component, OnInit, HostListener } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accidentes',
  templateUrl: './accidentes.component.html',
  styleUrls: ['./accidentes.component.css']
})
export class AccidentesComponent implements OnInit {

  menuVisible = false;
  
  userName: string | undefined;

  totalCasco: number = 0;
  totalChaleco: number = 0;
  totalZapatos: number = 0;
  totalGuantes: number = 0;


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


  constructor(private authService: AuthService, // Usamos el servicio para obtener los detalles
    private route: ActivatedRoute) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {

    this.cargarTotalesInfracciones();

    // Obtener el id del usuario desde el almacenamiento local
    const userId = parseInt(localStorage.getItem('user_id')!, 10);
    console.log("ID de usuario obtenido:", userId);  // Imprime el ID para verificar

    if (userId) {
      // Hacer la solicitud para obtener los detalles del usuario
      this.authService.getUserDetails(userId).subscribe(
        (data) => {
          console.log("Detalles del usuario recibidos:", data);  // Imprimir los detalles recibidos
          this.userName = data.nombre;  // Asignar el nombre del usuario
        },
        (error) => {
          console.error('Error al obtener los detalles del usuario', error);
        }
      );
    } else {
      console.error("No se encontró user_id en localStorage");
    }
  }

  cargarTotalesInfracciones(): void {
    this.authService.getInfraccionesTotal().subscribe((data) => {
      this.totalCasco = data.total_casco;
      this.totalChaleco = data.total_chaleco;
      this.totalZapatos = data.total_zapatos;
      this.totalGuantes = data.total_guantes;
    }, error => {
      console.error('Error al obtener los totales de infracciones', error);
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('historialInfracciones') as HTMLCanvasElement;
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [
          '1/10', '3/10', '5/10', '7/10', '9/10', '11/10', '13/10', '15/10',
          '17/10', '19/10', '21/10', '23/10', '25/10', '27/10', '29/10'
        ],
        datasets: [
          {
            label: 'Sin casco',
            data: [70, 50, 60, 80, 70, 65, 60, 55, 75, 70, 65, 60, 55, 50, 45],
            borderColor: '#b6a656',
            fill: false,
          },
          {
            label: 'Sin chaleco',
            data: [60, 55, 70, 65, 60, 58, 56, 60, 62, 64, 66, 68, 70, 72, 74],
            borderColor: '#b48d4c',
            fill: false,
          },
          {
            label: 'Sin zapatos',
            data: [40, 30, 45, 50, 35, 40, 38, 35, 37, 39, 41, 43, 45, 47, 49],
            borderColor: '#3d3d3d',
            fill: false,
          },
          {
            label: 'Sin guantes',
            data: [20, 25, 30, 35, 30, 25, 28, 32, 34, 36, 32, 34, 36, 38, 40],
            borderColor: '#e57373',
            borderDash: [5, 5],
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          }
        }
      }
    };

    new Chart(ctx, config);
  }
  
}
