export class Hero {
  id: number;
  name: string;
  age: number;
  power: string;

  constructor(data?: any) {
    this.id = data?.id ?? 0;
    this.name = data?.name ?? 'Spiderman';
    this.age = data?.age ?? 0;
    this.power = data?.power ?? '';
  }}

