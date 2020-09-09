import {Component, OnInit} from '@angular/core';
import {Product} from '../../common/product';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute} from '@angular/router';
import {CartItem} from '../../common/cart-item';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private cartService: CartService, private productService: ProductService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  addToCart() {
    let cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

  private handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProduct(productId).subscribe(data => this.product = data);
  }
}
