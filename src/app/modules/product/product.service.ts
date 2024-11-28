import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Product {
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
export class ProductService {

  private apiUrl = 'http://localhost:8080/products'; // Base URL for your product API

  constructor(private http: HttpClient) { }

  // Method to fetch products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/list`);
  }

  // Method to add a product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, product);
  }
}
