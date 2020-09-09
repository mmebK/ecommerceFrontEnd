import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) {
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {

    /**
     * need to implment this to take in consideration the "@categoryId"
     */
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` + `&page=${page}` + `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    /**
     * need to implment this to take in consideration the "@categoryId"
     */
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);

  }

  searchProductListPaginate(page: number, pageSize: number, keyWord: string): Observable<GetResponseProducts> {

    /**
     * need to implment this to take in consideration the "@categoryId"
     */
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyWord}` + `&page=${page}` + `&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(map(data => data._embedded.products));
  }


  getProductCategories(): Observable<ProductCategory[]> {

    const url = 'http://localhost:8080/api/categories';
    return this.httpClient.get<GetResponseProductCategory>(url).pipe(map(data => data._embedded.productCategory));

  }


}



