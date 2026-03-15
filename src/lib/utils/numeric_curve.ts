export class NumericCurve {
  amount!: number;

  constructor(initialValue: number = 0.0) {
    this.setCurveAmount(initialValue);
  }


  setCurveAmount(value: number): void {
    this.amount = value;
  }

  resetSettings(): void {
    this.setCurveAmount(0.0);
  }

  resetState(): void {
    // do nothing
  }

  apply(input: number): number {
    var output = input;
    const z = -1.0 * this.amount;
    if (z === 0.0) {
      output = input;
    }
    else if (z > 0.0) {
      output = Math.pow(input, 1.0 - z);
    }
    else if (z < 0.0) {
      output = Math.pow(input, 1.0 / (1.0 + z));
    }

    return output;
  }

}
