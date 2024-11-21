import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definir la URL base de la API de Node.js
const API_URL = 'http://backend:5002';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Método para hacer el login
  login(correo: string, contrasena: string): Observable<any> {
    const body = { correo, contrasena };  // Cuerpo de la solicitud
    return this.http.post<any>(`${API_URL}/login`, body);  // Cambié la ruta aquí
  }

  // Método para obtener el nombre del usuario
  getUserDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/user/${userId}`);  // Cambié la ruta aquí
  }

  // Método para obtener las infracciones
  getInfracciones(): Observable<any> {
    return this.http.get<any>(`${API_URL}/infracciones`);  // Ruta al endpoint que obtiene las infracciones
  }

  // Método para obtener los totales de infracciones
  getInfraccionesTotal(): Observable<any> {
    return this.http.get<any>(`${API_URL}/infracciones/total`);
  }

  // Método para obtener las infracciones dentro del rango de fechas
  obtenerInfraccionesPorFecha(fechaDesde: string, fechaHasta: string): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/infracciones/por-fecha?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
  }

}
