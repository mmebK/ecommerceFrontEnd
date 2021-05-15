import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FillUpFormsService} from '../../services/fill-up-forms.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {of} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {CartService} from '../../services/cart.service';
import {CheckoutService} from '../../services/checkout.service';
import {Router} from '@angular/router';
import {OrderItem} from '../../common/order-item';
import {Purchase} from '../../common/purchase';
import {Order} from '../../common/order';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];


  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  checkoutGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private checkoutService: CheckoutService, private router: Router, private formBuilder: FormBuilder, private fillFormService: FillUpFormsService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.checkoutGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [],
        email: []
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        SecurityCode: [],
        expirationMonth: [''],
        expirationYear: [''],
      }),


    });

    this.fillFormService.getCreditCardMonths().subscribe(data => this.creditCardMonths = data);
    this.fillFormService.getCreditCardYears().subscribe(data => this.creditCardYears = data);

    this.fillFormService.getCountries().subscribe(data => this.countries = data);

    this.reviewCartDetails();
  }

  onSubmit() {
    console.log(this.checkoutGroup.get('customer').value);
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    console.log(purchase);
    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          console.log(response);
          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }

  copyShippingToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutGroup.controls.billingAddress.setValue(this.checkoutGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
      of(1, 2, 3).pipe(map(a => a * 2), take(2));
    }
  }


  /**
   * to do later
   */

  /*handleMonthsAndYears() {

    let creditCardFromGroup = this.checkoutGroup.get('creditCard');
    let currentYear:number=new Date().getFullYear();
    let selectedYear:number=Number(creditCardFromGroup.value.expirationYear);

    let startMonth:number;

    if(currentYear===selectedYear)
      startMonth=new Date().getMonth()+1;

    else
      startMonth=1;




  }*/
  getStates(formGroupName: string) {

    let formGroup = this.checkoutGroup.get(formGroupName);

    let countryCode = formGroup.value.country.code;
    let countryName = formGroup.value.country.name;
    console.log(countryName);
    this.fillFormService.getState(countryCode).subscribe(data => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      formGroup.get('state').setValue(data[0]);
    });
  }

  private reviewCartDetails() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  private resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutGroup.reset();

    this.router.navigateByUrl('/products');
  }
}
