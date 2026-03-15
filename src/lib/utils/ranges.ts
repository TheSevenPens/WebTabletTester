/////////////////////////////////////////////////////////////////////////
// for ranges that have a lower and upper value
//
export class OrderedRange
{
    Min: number;
    Max: number;

    constructor(min: number, max: number)
    {
        this.Min = min;
        this.Max = max;
    }
}

/////////////////////////////////////////////////////////////////////////
// clamp 
//
export function clamp(v: number, lower: number, upper: number): number 
{
    return Math.min(Math.max(v, lower), upper);
}

/////////////////////////////////////////////////////////////////////////
// clamp to range
//
export function clampToRange(v: number, r: OrderedRange): number 
{
    return clamp(v, r.Min, r.Max);
}

