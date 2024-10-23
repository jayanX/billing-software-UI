import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditProductComponent } from '../edit-product/edit-product.component';

interface Product {
  name: string;
  quantity: number | null; // Allow null
  price: number | null;    // Allow null
  gst: number | null;      // Allow null
  volume: string;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  newProduct: Product = {
    name: '',
    quantity: 0, // Default to 0
    price: 0,    // Default to 0
    gst: 0,      // Default to 0
    volume: ''
  };

  products: Product[] = [
    { name: 'Milk - 15L', quantity: 7, price: 50, gst: 5, volume: '15L' },
    { name: 'Milk - 30L', quantity: 10, price: 90, gst: 5, volume: '30L' },
    { name: 'Egg - Dozen', quantity: 12, price: 6, gst: 5, volume: 'N/A' },
    { name: 'Egg - Two Dozen', quantity: 24, price: 11, gst: 5, volume: 'N/A' }
  ];

  displayedColumns: string[] = ['name', 'quantity', 'price', 'gst', 'volume', 'actions'];

  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) { } // Inject MatDialog

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Product>(this.products);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  addProduct() {
    if (this.newProduct.name && this.newProduct.quantity !== null && this.newProduct.price !== null) {
      this.products.push({ ...this.newProduct });
      console.log('Product added:', this.newProduct);
      console.log('Updated products array:', this.products);
      this.updateDataSource();
      this.clearForm();
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
        const index = this.products.findIndex(p => p.name === product.name);
        if (index >= 0) {
          this.products[index] = result;
          this.updateDataSource();
        }
      }
    });
  }

  confirmDelete(product: Product) {
    const confirmed = window.confirm(`Are you sure you want to delete the product: ${product.name}?`);
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
      name: '',
      quantity: 0, // Default to 0
      price: 0,    // Default to 0
      gst: 0,      // Default to 0
      volume: ''
    };
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
