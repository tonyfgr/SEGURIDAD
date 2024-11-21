import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  correo: string = '';
  contrasena: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Método para manejar el inicio de sesión
  onLogin(): void {
    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (response) => {
        console.log('Inicio de sesión exitoso:', response);
        localStorage.setItem('user_id', response.user_id);
        this.router.navigate(['/accidentes']);  // Redirigir a otra página si el login es exitoso
      },
      error: (err) => {
        console.error('Error en el inicio de sesión:', err);
        this.errorMessage = err.error?.error || 'Hubo un problema al iniciar sesión';  // Muestra el error en la UI
      }
    });
  }
  

}
