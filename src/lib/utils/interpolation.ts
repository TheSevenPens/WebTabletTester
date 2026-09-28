/** t=0 returns a; t=1 returns b. */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}
