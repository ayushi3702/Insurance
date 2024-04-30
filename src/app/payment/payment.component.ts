import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Payment } from '../type';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit, OnChanges {
  private paymentAPIUrl = 'https://localhost:7223/api/Payment';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // this.paymentForm = this.fb.group({
    //   cardHolderName: [
    //     '',
    //     [Validators.required, Validators.pattern(/^[A-Z ]+$/)],
    //   ],
    //   cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    //   cardExpiryDate: [
    //     '',
    //     [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)],
    //   ],
    //   cvv: ['', Validators.required],
    // });
  }
  payment: any = [];
  jPay: Payment[] = [];
  paymentData: any = [];
  paymentAddData: any = {
    paymentId: 0,
    empId: 0,
    bankName: '',
    cardHolderName: '',
    cardNumber: '',
    cardExpiryDate: '',
    cvv: 0,
  };
  isEditing: boolean = false;
  // paymentForm!:  FormGroup;
  employeeId: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    const userIdChange = changes['employeeId'];
    if (userIdChange && !userIdChange.firstChange) {
      const userId = userIdChange.currentValue;
      if (userId) {
        const id = parseInt(userId, 10);
        this.GetPaymentData(id);
      }
    }
  }

  ngOnInit() {
    const userId = sessionStorage.getItem('employeeId');
    console.log(userId);
    if (userId) {
      const id = parseInt(userId, 10);
      this.GetPaymentData(id); // Call GetPaymentData here to fetch payment details
    } else {
      console.error('User ID not found in session storage');
      this.toastr.error('User ID not found in session storage', 'Error');
    }
  }

  GetPaymentData(id: number) {
    this.paymentData = [];
    this.http.get<Payment[]>(`${this.paymentAPIUrl}/${id}`).subscribe(
      (data: Payment[]) => {
        this.jPay = data;
        this.paymentData.push(data);
        console.log('zz' + data);
        console.log(this.paymentData);
      },
      (error) => {
        console.error('Error fetching payment data:', error);
        this.toastr.error('Error fetching payment data', 'Error');
      }
    );
  }

  addPayment(): void {
    const userId = sessionStorage.getItem('employeeId');
    if (!userId) {
      console.error('User ID not found in session storage');
      this.toastr.error('User ID not found in session storage', 'Error');
      return;
    }

    const id = parseInt(userId, 10);

    // Set the empId field in paymentAddData
    this.paymentAddData.empId = id;

    // Make the HTTP POST request to add payment details
    this.http
      .post<Payment[]>(`${this.paymentAPIUrl}`, this.paymentAddData)
      .subscribe(
        () => {
          alert('Payment added successfully');
          this.GetPaymentData(id);
          console.log(this.paymentAddData);
        },
        (error) => {
          console.error('Error adding payment data:', error);
          this.toastr.error('Error adding payment data', 'Error');
        }
      );
  }

  addOrUpdatePayment(): void {
    const userId = Number(sessionStorage.getItem('employeeId'));
    if (
      this.paymentAddData.cardHolderName &&
      this.paymentAddData.cardNumber &&
      this.paymentAddData.cardExpiryDate &&
      this.paymentAddData.cvv
    ) {
      console.log('valid');
      if (this.isEditing) {
        this.updatePayment();
      } else {
        console.log(sessionStorage.getItem('employeeId'));
        const userId = Number(sessionStorage.getItem('employeeId'));
        this.addPayment();
        console.log('added');
      }
      this.clearForm();
    } else {
      // Mark fields as touched to trigger validation messages
      this.markFieldsAsTouched();
    }
  }

  markFieldsAsTouched(): void {
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.paymentAddData).forEach((key) => {
      this.paymentAddData[key] = true;
    });
  }

  updatePayment(): void {
    this.http.put(this.paymentAPIUrl, this.paymentAddData).subscribe(() => {
      alert('Payment updated successfully');
      const empId = Number(sessionStorage.getItem('employeeId'));
      this.GetPaymentData(empId);
    });
  }

  confirmDeletePayment(id: number): void {
    if (confirm('Are you sure you want to delete the payment?')) {
      this.deletePayment(id);
    }
  }

  deletePayment(id: number): void {
    console.log(id);
    const deleteUrl = `${this.paymentAPIUrl}/${id}`; // Use backticks for string interpolation
    this.http.delete(deleteUrl).subscribe(() => {
      const userId = Number(sessionStorage.getItem('employeeId'));
      this.GetPaymentData(userId);
      alert('Payment deleted successfully');
      console.log(this.paymentData);
    });
  }

  editPayment(payment: any): void {
    this.isEditing = true;
    this.paymentAddData = payment;
  }
  clearForm(): void {
    this.paymentData = {};
    this.isEditing = false;
    this.paymentAddData.bankName = '';
    this.paymentAddData.cardHolderName = '';
    this.paymentAddData.cardNumber = '';
    this.paymentAddData.cardExpiryDate = '';
    this.paymentAddData.cvv = 0;
  }
}
