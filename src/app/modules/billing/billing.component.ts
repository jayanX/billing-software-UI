import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { saveAs } from 'file-saver';
import { PDFDocument, rgb } from 'pdf-lib';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class BillingComponent implements OnInit {
  ngOnInit(): void {}

  products = [
    { name: 'Product 1', id: 1, pricePerUnit: 50 },
    { name: 'Product 2', id: 2, pricePerUnit: 100 },
    { name: 'Product 3', id: 3, pricePerUnit: 150 }
  ];

  orderItems: any[] = [];
  selectedProduct: any = null;
  quantity: number = 1;

  displayedColumns: string[] = ['product', 'quantity', 'pricePerUnit', 'totalCost', 'actions'];

  addItem() {
    if (this.selectedProduct && this.quantity > 0) {
      const totalCost = this.selectedProduct.pricePerUnit * this.quantity;
      this.orderItems = [
        ...this.orderItems,
        { product: this.selectedProduct, quantity: this.quantity, totalCost }
      ];
      console.log("Added item:", this.orderItems);
      this.selectedProduct = null;
      this.quantity = 1;
    }
  }

  deleteItem(item: any) {
    this.orderItems = this.orderItems.filter(i => i !== item);
  }

  getTotalAmount() {
    return this.orderItems.reduce((total, item) => total + item.totalCost, 0);
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
