import { Component, OnInit, SimpleChanges } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BillingService } from './billing.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Product } from './billing.service'; // Import the existing Product interfac

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class BillingComponent implements OnInit{

  selectedDevice: MediaDeviceInfo | undefined;
  orderItems: any[] = [];
  selectedProduct: any = null;
  quantity: number = 1;
  message: string = '';
  barcodeFound: boolean = false;
  products: Product[] = []; // Changed type to Product[]
  barcode: string = '';  // Variable to store the barcode value
  searchControl = new FormControl(); // For product search
  filteredProducts: Product[] = []; // For filtered products
  isProductFound: boolean | undefined; // Tracks if the product is found or not


  displayedColumns: string[] = ['product', 'totalItems', 'quantity', 'pricePerUnit', 'totalCost', 'actions'];

  constructor(private billingService: BillingService) {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterProducts(value);
      });
  }

  ngOnInit(): void {

    this.loadAllProducts();
  }

  displayFn(product: Product): string {
    return product ? product.productName : '';
  }

  onProductSelected(product: Product): void {
    this.selectedProduct = product;
  }

  loadAllProducts() {
    this.billingService.getAllProducts().subscribe(
      (products: Product[]) => {
        this.products = products;
        this.filteredProducts = products;
      },
      error => {
        console.error('Error loading products:', error);
      }
    );
  }

  filterProducts(value: string): void {
    const filterValue = value ? value.toLowerCase() : '';
    this.filteredProducts = this.products.filter(product =>
      product.productName.toLowerCase().includes(filterValue) // Check if filterValue exists anywhere in productName
    );
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^\d$/.test(keyValue)) {
      event.preventDefault();
    }
  }


  onBarcodeChange() {

    // Validate the barcode input (8-15 digits)
    if (!this.barcode || this.barcode.length < 8 || this.barcode.length > 15) {
      this.isProductFound = false;
      this.message = 'Please enter a valid 8-15 digit number.';
      return;
    }

    this.billingService.checkBarcode(this.barcode).subscribe(
      (products: any) => {
        console.log('Products fetched:', products);

        if (products && products.length > 0) {
          this.isProductFound = true; // Set flag for success
          this.message = 'Product found';
          this.barcode = "";

          const newItems: any[] = [];
          products.forEach((product: any) => {
            // Check if the product already exists in the orderItems array
            const existingProduct = this.orderItems.find(item => item.barcode === product.barcode);

            if (existingProduct) {
              // If the product exists, update its count and totalCost
              existingProduct.count = (existingProduct.count || 1) + 1;
              existingProduct.totalCost += product.price;
            } else {
              // If the product doesn't exist, add it as a new item
              newItems.push({
                id: product.id,
                productName: product.productName,
                barcode: product.barcode,
                price: product.price,
                quantity: product.quantity,
                gst: product.gst,
                unit: product.unit,
                totalCost: product.price, // Initial total cost is the product price
                count: 1 // Initialize count to 1
              });
            }
          });
          this.orderItems = [...this.orderItems, ...newItems];
          console.log('Entered Barcode:', this.orderItems);
        } else {
          // No products found for the barcode

        }
      },
      (error) => {
        this.isProductFound = false; // Set flag for failure
        this.message = 'Product not found';
        console.log('hi')
        console.error('Error fetching products:', error);
      }
    );
  }


  addItem(): void {

    if (this.selectedProduct && this.quantity > 0) {
      const itemDetails = {
        productId: this.selectedProduct.productId,
        productName: this.selectedProduct.productName,
        totalItems: this.quantity
      };

      this.billingService.getProduct(itemDetails).subscribe(
        {
          next: (response: any) => {

            const existingProduct = this.orderItems.find(item => item.id === response.id);

            const newItems: any[] = [];
            if (existingProduct) {

              existingProduct.count = existingProduct.count + response.count;
              existingProduct.totalCost = existingProduct.totalCost + (existingProduct.price * response.count);
            }
            else {
              newItems.push({
                id: response.id,
                productName: response.productName,
                barcode: response.barcode,
                price: response.price,
                quantity: response.quantity,
                gst: response.gst,
                unit: response.unit,
                totalCost: response.price * response.count, // Initial total cost is the product price
                count: response.count// Initialize count to 1
              });

            }
            this.orderItems = [...this.orderItems, ...newItems];
          },
          error: (err) => {
            console.error('Error fetching products:', err);
          }
        }
      )
    } else {
      console.error('Please select a product and enter a valid quantity.');
    }
  }


  getTotalAmount(): number {
    return this.orderItems.reduce((total, item) => total + item.totalCost, 0);
  }

  deleteItem(item: any) {
    this.orderItems = this.orderItems.filter(orderItem => orderItem !== item);
  }

  async generatePDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    page.drawText('Order Details', { x: 50, y: 350, size: 24, color: rgb(0, 0, 0) });
    page.drawText('Product', { x: 50, y: 300, size: 16, color: rgb(0, 0, 0) });
    page.drawText('Quantity', { x: 150, y: 300, size: 16, color: rgb(0, 0, 0) });
    page.drawText('Price/Unit', { x: 250, y: 300, size: 16, color: rgb(0, 0, 0) });
    page.drawText('Total Cost', { x: 350, y: 300, size: 16, color: rgb(0, 0, 0) });

    let yPosition = 280;
    for (const item of this.orderItems) {
      page.drawText(item.product.name, { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });
      page.drawText(item.quantity.toString(), { x: 150, y: yPosition, size: 14, color: rgb(0, 0, 0) });
      page.drawText(item.product.pricePerUnit.toString(), { x: 250, y: yPosition, size: 14, color: rgb(0, 0, 0) });
      page.drawText(item.totalCost.toString(), { x: 350, y: yPosition, size: 14, color: rgb(0, 0, 0) });
      yPosition -= 20;
    }

    const totalAmount = this.getTotalAmount();
    page.drawText(`Total Amount: ${totalAmount}`, { x: 350, y: yPosition - 20, size: 16, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'order-details.pdf');
  }

}
