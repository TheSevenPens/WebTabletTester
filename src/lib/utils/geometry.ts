/////////////////////////////////////////////////////////////////////////
// 2D position
//
export class Position
{
    x: number;
    y: number;

    constructor(x: number, y: number) 
    {
        this.x = x;
        this.y = y;
    }
}

/////////////////////////////////////////////////////////////////////////
// 2D size
//
export class Size
{
    width: number;
    height: number;

    constructor(w: number, h: number) 
    {
        this.width = w;
        this.height = h;
    }
}