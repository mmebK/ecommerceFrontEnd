import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FillUpFormsService} from '../../services/fill-up-forms.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';
import {of} from 'rxjs';
import {map, take} from 'rxjs/operators';

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

  constructor(private formBuilder: FormBuilder, private fillFormService: FillUpFormsService) {
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


  }

  onSubmit() {
    console.log(this.checkoutGroup.get('customer').value);
  }

  copyShippingToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutGroup.controls.billingAddress.setValue(this.checkoutGroup.controls.shippingAddress.value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutGroup.controls.billingAddress.reset();
      this.billingAddressStates = [];
      of(1,2,3).pipe(map(a=>a*2),take(2))
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
}