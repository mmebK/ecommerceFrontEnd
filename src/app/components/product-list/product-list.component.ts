import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Product} from '../../common/product';
import {ActivatedRoute} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {CartItem} from '../../common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyWord: string = null;
  previousCategoryId: number = 1;

  constructor(private productService: ProductService,private cartService:CartService, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
      this.productsList());
  }


  productsList() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId)
      .subscribe(this.processResult());

    //console.log(this.currentCategoryId+''+this.pageNumber)
    /* this.productService.getProductList(this.currentCategoryId).subscribe(
       data => this.products = data
     );*/
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.productsList();
  }

  addToCart(product: Product) {
    let cartItem=new CartItem(product)
    this.cartService.addToCart(cartItem);
  }

  private handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyWord != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyWord = keyword;

    // this.productService.searchProducts(keyword).subscribe(data => this.products = data);
    this.productService.searchProductListPaginate(this.pageNumber - 1, this.pageSize, keyword).subscribe(this.processResult());

  }

  private processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
}
