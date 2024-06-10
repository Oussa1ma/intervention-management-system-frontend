import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Reponse } from '../models/reponse.model';
import { Technicien } from '../models/technicien.model'


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url = environment.url

  constructor(private http: HttpClient, private navigation: Router) { }

  login(technicien: Technicien){
    let headersValue = new HttpHeaders({"email": technicien.email, "password": technicien.password})
      return this.http.get<Reponse>(`${this.url}/login`, {headers: headersValue})
  }

  getTechnicienById(id: string){
    let headersValue = new HttpHeaders({"x-auth-token": localStorage.getItem("token")})
    return this.http.get<Reponse>(`${this.url}/technicien/${id}`, {headers: headersValue})
  }

  //for Guards
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    const url = ["/login"]
    this.navigation.navigate(url)
  }

  isLogged() {
    return !!localStorage.getItem('token');
  }
}
