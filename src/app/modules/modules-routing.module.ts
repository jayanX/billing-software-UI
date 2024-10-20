import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { HistoryComponent } from './history/history.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  {
    path: 'billing',        // Path for BillingComponent
    component: BillingComponent
  },
  {
    path: 'history',        // Path for HistoryComponent
    component: HistoryComponent
  },
  {
    path: 'product',        // Path for ProductComponent
    component: ProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
