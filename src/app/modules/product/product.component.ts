import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { ProductService } from './product.service';

interface Product { 
  productName: string;
  barcode: string;           // Barcode for each product
  quantity: number | null;    // Quantity of the product
  unit: string;               // Unit for the quantity, e.g., g, kg, L
  price: number | null;       // Price of the product
  gst: number | null;         // GST percentage for the product
  count: number | null; // New field
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  newProduct: Product = {
    productName: '',
    barcode: '',
    quantity: 0,              // Default quantity
    unit: '',                 // Default unit
    price: 0,                 // Default price
    gst: 0 ,                // Default GST
    count: 0 // Default count
  };

  products: Product[] = [];

  displayedColumns: string[] = ['name', 'barcode', 'quantity', 'unit', 'price', 'gst', 'actions'];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService,public dialog: MatDialog) { } // Inject MatDialog

  ngOnInit() {
    this.fetchProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchProducts() {
    this.productService.getProducts().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error fetching product data:', error);
      }
    );
  }
  
  addProduct() {
    if (this.newProduct.productName && this.newProduct.barcode && this.newProduct.quantity !== null &&
        this.newProduct.unit && this.newProduct.price !== null && this.newProduct.gst !== null &&
        this.newProduct.count !== null) {
      
      // Call backend API to add product
      this.productService.createProduct(this.newProduct).subscribe(
        (response: Product) => {
          console.log('Product added successfully:', response);
          this.products.push(response);
          this.updateDataSource();
          this.clearForm();
        },
        (error: any) => {
          console.error('Error adding product:', error);
        }
      );
    } else {
      console.log('Invalid product data:', this.newProduct);
    }
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(EditProductComponent, {
      width: '400px',
      data: { ...product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.products.findIndex(p => p.productName === product.productName);
        if (index >= 0) {
          this.products[index] = result;
          this.updateDataSource();
        }
      }
    });
  }

  confirmDelete(product: Product) {
    const confirmed = window.confirm(`Are you sure you want to delete the product: ${product.productName}?`);
    if (confirmed) {
      this.deleteProduct(product);
      console.log('Product deleted:', product);
    } else {
      console.log('Deletion cancelled for product:', product);
    }
  }

  deleteProduct(product: Product) {
    const index = this.products.indexOf(product);
    if (index >= 0) {
      this.products.splice(index, 1);
      this.dataSource.data = this.products; // Update the data source
      this.updateDataSource();
    }
  }



  updateDataSource() {
    this.dataSource.data = this.products;
    this.dataSource.paginator = this.paginator;
    this.dataSource._updateChangeSubscription();
  }
  clearForm() {
    this.newProduct = {
      productName: '',
      barcode: '',
      quantity: 0,
      unit: '',
      price: 0,
      gst: 0,
      count: 0
    };
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  // product.component.ts
isValidBarcode(barcode: string): boolean {
  return /^[0-9]{12,15}$/.test(barcode);
}

}
