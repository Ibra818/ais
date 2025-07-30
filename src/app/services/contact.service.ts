import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  timestamp: string;
  source: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  
  // Remplacez par votre vraie URL d'API
  private apiUrl = '';
  
  constructor(private http: HttpClient) { }

  /**
   * Envoie les données du formulaire de contact à l'API
   * @param formData - Données du formulaire
   * @returns Observable de la réponse API
   */
  submitContactForm(formData: ContactFormData): Observable<ContactResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.post<ContactResponse>(this.apiUrl, formData, { headers });
  }

  /**
   * Pour tester sans API réelle - simule un appel API
   * @param formData - Données du formulaire
   * @returns Observable simulé
   */
  submitContactFormMock(formData: ContactFormData): Observable<ContactResponse> {
    return new Observable(observer => {
      // Simule un délai d'API
      setTimeout(() => {
        // Simule une réponse réussie
        const response: ContactResponse = {
          success: true,
          message: 'Message envoyé avec succès!',
          id: 'mock-' + Date.now()
        };
        
        console.log('Mock API - Données reçues:', formData);
        observer.next(response);
        observer.complete();
      }, 1500); // Délai de 1.5 secondes
    });
  }
}
