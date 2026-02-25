/////////////////////////////////////////////////////////////////////////
// Linear interpolate between two values
//
export function lerp(a, b, t ) 
{
    const c = (a * t) + (b * (1-t));
    return c;
}

/////////////////////////////////////////////////////////////////////////
// Linear interpolate between two points
//
export function lerpPoint(a, b, t) 
{
    const p =
    {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    };

    return p;
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
