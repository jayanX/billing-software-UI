import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { BillingComponent } from './billing/billing.component';
import { HistoryComponent } from './history/history.component';
import { ProductComponent } from './product/product.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { DemoMaterialModule } from '../demo-material-module';
import { EditProductComponent } from './edit-product/edit-product.component';



@NgModule({
  declarations: [

    BillingComponent,
    HistoryComponent,
    ProductComponent,
    EditProductComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatIconModule,
    DemoMaterialModule ,ReactiveFormsModule,
    

  
  ]
})
export class ModulesModule { }
