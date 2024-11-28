import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';


export interface Product {
  productName: string;
  barcode: string;
  quantity: number | null;
  unit: string;
  price: number | null;
  gst: number | null;
  count: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private apiUrl = 'http://localhost:8080/billing'; // Base URL for your backend service

  constructor(private http: HttpClient) { }

  // Method to fetch products
  checkBarcode(barcode: string): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/barcode/${barcode}`).pipe(
      map((response: any) => {
        // If the response is a single product, wrap it in an array
        return Array.isArray(response) ? response : [response];
      })
      // catchError((error: HttpErrorResponse) => {
      //   // this.message = 'Product not found';
      //   console.error('Error fetching products:', error);
      //   return throwError(() => new Error('Error fetching products'));
      // })
    );
  }


  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching all products:', error);
        return throwError(() => new Error('Error fetching all products'));
      })
    );
  }

  getProduct(itemDetails: any){
  
    return this.http.put(`${this.apiUrl}/product`,itemDetails)
  }


}
