export class ValidationMessage{
  constructor(property: string, value: any) {
    this.property = property;
    this.value = value;
  }
  property: string;
  value: any;
}