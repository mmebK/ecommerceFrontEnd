import {Injectable} from '@angular/core';
import {CartItem} from '../common/cart-item';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);


  constructor() {
  }

  addToCart(cartItem: CartItem) {
    //check if we already have an item in our cart
    let alreadyExistsInCart: boolean;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {

      existingCartItem = this.cartItems.find(tempItem => tempItem.id == cartItem.id);
      alreadyExistsInCart = (existingCartItem != undefined);

    }
    if (alreadyExistsInCart) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotal();

  }

  logCartData(totalQualityValue: number, totalPriceValue: number) {
    // console.log('totalQuantity: ' + totalQualityValue + ' totalPrice: ' + totalPriceValue);
  }

  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentItem of this.cartItems) {
      totalPriceValue += currentItem.quantity * currentItem.unitPrice;
      totalQuantityValue += currentItem.quantity;
    }

    //publish the new values, .next send the events;
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);


    // this.logCartData(totalQuantityValue, totalPriceValue);
  }


  /**
   *
   * this method deletes the item completely
   * @param item
   */
  removeFromCart(item: CartItem) {
    this.cartItems.splice(this.cartItems.indexOf(item), 1);

    this.computeCartTotal();
  }

  decrementQuantity(item: CartItem) {
    item.quantity--;
    if (item.quantity === 0) {
      this.removeFromCart(item);
    } else {
      this.computeCartTotal()
    }

  }
}
