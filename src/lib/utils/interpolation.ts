/////////////////////////////////////////////////////////////////////////
// Linear interpolate between two values
//
export function lerp(a: number, b: number, t: number): number
{
    const c = (a * t) + (b * (1-t));
    return c;
}

/////////////////////////////////////////////////////////////////////////
// Linear interpolate between two points
//
export function lerpPoint(a: { x: number, y: number }, b: { x: number, y: number }, t: number): { x: number, y: number }
{
    const p =
    {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };

    return p;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
