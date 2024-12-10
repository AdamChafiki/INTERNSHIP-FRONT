import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private readonly BASE_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCv(userId: any) {
    return this.http.get(`${this.BASE_URL}/upload/${userId}/resume`, {
      responseType: 'blob',
    });
  }
  updateCv(file: File, userId: any) {
    console.log(file, userId);
    
    const formData = new FormData();
    formData.append('file', file); // Attach the file
    formData.append('userId', userId.toString()); // Attach the user ID as a string

    console.log(formData);
    
    

    return this.http.post(`${this.BASE_URL}/upload`, formData, {
      responseType: 'text',
    });
  }
}
