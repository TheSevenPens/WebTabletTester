export class NumericSmoother {
  amount!: number;
  oldSmoothed: number | null = null;

  constructor(amount: number) {
    this.resetSettings();
    this.resetState();
    this.setSmoothingAmount(amount);
  }


  setSmoothingAmount(value: number): void
  {
    this.amount = value;
  }

  resetSettings(): void
  {
    this.setSmoothingAmount(0.0);
  }

  resetState(): void 
  {
    this.oldSmoothed = null;
  }

  apply(input: number): number
  {
    var output = input;
    if (this.oldSmoothed != null )
    {
        if (this.amount>0.0)
        {
            const alpha = 1.0-this.amount;
            output = ( alpha * input ) + ((1.0 - alpha) * this.oldSmoothed);
        }
    }
    this.oldSmoothed = output;
    return output;
  }

}

