import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Reponse } from '../models/reponse.model';
import { Technicien } from '../models/technicien.model';

@Injectable({
  providedIn: 'root'
})
export class TechnicienService {

  private url: string = environment.url

  constructor(private http: HttpClient) { }

  //for the technicien list
  allTechniciens() {
    const headersValue = {'x-auth-token': localStorage.getItem('token')}
    return this.http.get<Reponse>(`${this.url}/technicien`,{headers: headersValue}).pipe(share())
  }

  delete(id: string) {
    const headersValue = {'x-auth-token': localStorage.getItem('token')}
    return this.http.delete(`${this.url}/technicien/${id}`, {headers: headersValue})
  }

  addTechnicien(technicien: Technicien) {
    const headersValue = {'x-auth-token': localStorage.getItem('token')}
    return this.http.post<Reponse>(`${this.url}/technicien`, technicien, {headers: headersValue})
  }

  update(data): Observable<Reponse>{
    const body = data.body
    const id = data.params.id
    
    const headers = new HttpHeaders({
      'x-auth-token': localStorage.getItem('token')
    })
    return this.http.patch<Reponse>(`${this.url}/technicien/${id}`, body, {headers: headers})
  }
}
