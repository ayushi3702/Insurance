export interface Emp {
  empId: number;
  empName: string;
  gender: string;
  dateOfBirth: Date;
  companyName: string;
}

export interface Policy {
  policyId: number;
  empId: number;
  insurer: string;
  tpa: string;
  startDate: Date;
  endDate: Date;
  coverageType: string;
  policyStatus: string;
  beneficiaryName: string;
  beneficiaryRelation: string;
}

export interface Payment {
  paymentId: number;
  empId: number;
  bankName: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpiryDate: string;
  cvv: number;
}

export interface LoginForm {
  email: string;
  password: string;
}
