import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {SearchComponent} from './components/search/search.component';
import {RouterModule, Routes} from '@angular/router';
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {CartDetailsComponent} from './components/cart-details/cart-details.component';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ProductService} from './services/product.service';


const routes: Routes = [
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    CartStatusComponent,
    SearchComponent,
    ProductCategoryMenuComponent,
    ProductListComponent,
    ProductDetailsComponent,
    CheckoutComponent,
    CartDetailsComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule

  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
