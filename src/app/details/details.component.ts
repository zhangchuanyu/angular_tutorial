import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HousingService } from '../housing.service';
import { HousingLocation } from '../housingLocation';
import { Validators } from '@angular/forms';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <article>
      <img
        class="listing-photo"
        [src]="housingLocation?.photo"
        alt="Exterior photo of {{ housingLocation?.name }}"
        crossorigin
      />
      <section class="listing-description">
        <h2 class="listing-heading">{{ housingLocation?.name }}</h2>
        <p class="listing-location">{{ housingLocation?.city }}, {{ housingLocation?.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this housing location</h2>
        <ul>
          <li>Units available: {{ housingLocation?.availableUnits }}</li>
          <li>Does this location have wifi: {{ housingLocation?.wifi }}</li>
          <li>Does this location have laundry: {{ housingLocation?.laundry }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Apply now to live here</h2>
        <form [formGroup]="applyForm" (submit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />
          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />
          <label for="full-name">Full Name</label>
          <input id="full-name" type="text" formControlName="fullName"/>
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          <div class="error" *ngIf="applyForm.get('email')?.invalid && applyForm.get('email')?.touched">
          <div *ngIf="applyForm.get('email')?.errors?.['required']">Email is required.</div>
          <div *ngIf="applyForm.get('email')?.errors?.['email']">Please enter a valid email address.</div>
        </div>
          <button type="submit" class="primary" [disabled]="applyForm.invalid">Apply now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  housingService = inject(HousingService);
  housingLocation: HousingLocation | undefined;
  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl({ value: '', disabled: true }),
  });
  constructor() {
    const housingLocationId = Number(this.route.snapshot.params['id']);
    this.housingService.getHousingLocationById(housingLocationId).then((housingLocation) => {
      this.housingLocation = housingLocation;
    });
    this.applyForm.get('firstName')!.valueChanges.subscribe(() => this.updateFullName());
    this.applyForm.get('lastName')!.valueChanges.subscribe(() => this.updateFullName());
  }
  submitApplication() {
    this.housingService.submitApplication(
      this.applyForm.value.firstName ?? '',
      this.applyForm.value.lastName ?? '',
      this.applyForm.value.email ?? '',
    );
  }
  updateFullName() {
    const firstName = this.applyForm.get('firstName')?.value ?? '';
    const lastName = this.applyForm.get('lastName')?.value ?? '';
    const fullName = `${firstName} ${lastName}`.trim();
    this.applyForm.get('fullName')?.setValue(fullName, { emitEvent: false });
  }
}
