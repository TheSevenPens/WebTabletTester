import { easeOutCubic, lerp } from './interpolation.js';


export function format4Digits1Decimal(num) {
    const nbsp = "\u00A0";
    return num.toFixed(1).padStart(6, nbsp );
}

export function format1Digit4Decimals(num) {
    return num.toFixed(4);
}


/**
 * Round to n decimal places. Use this for arbitrary precision; use roundTo1DecimalPlaces etc. for convenience.
 * @param {number} v
 * @param {number} n
 * @returns {number}
 */
export function roundToNDecimalPlaces(v, n) {
    const factor = 10 ** n;
    return Math.round(v * factor) / factor;
}

export function roundTo4DecimalPlaces(v) {
    return roundToNDecimalPlaces(v, 4);
}

export function roundTo3DecimalPlaces(v) {
    return roundToNDecimalPlaces(v, 3);
}

export function roundTo2DecimalPlaces(v) {
    return roundToNDecimalPlaces(v, 2);
}

export function roundTo1DecimalPlaces(v) {
    return roundToNDecimalPlaces(v, 1);
}

export function radiansToDegrees(r)
{
    return (r * (180 / Math.PI));
}

/**
 * Quantize value in [0, 1] to `levels` discrete steps.
 * @param {number} value - In [0, 1]
 * @param {number} levels - Integer >= 2
 * @returns {number}
 * @throws {Error} If value or levels are invalid
 */
export function quantize(value, levels) 
{
  if (typeof value !== 'number' || value < 0 || value > 1) {
    throw new Error('Input value must be a number between 0.0 and 1.0 inclusive.');
  }
  if (!Number.isInteger(levels) || levels < 2) {
    throw new Error('Number of quantization levels must be an integer greater than or equal to 2.');
  }
  return Math.round(value * (levels - 1)) / (levels - 1);
}

export function getSmoothingValue(input) 
{
    // first map it with a curve
    const output1 =  easeOutCubic( input );
    // second restrict to a slightly smaller range 
    const output2 = lerp( 0.985, 0.0, output1);
    // round it so that we easier-to-read numbers for the user
    const output3 = roundTo4DecimalPlaces(output2);

    return output3;
}

export function tiltxyToTiltAzimuth(tiltX,tiltY)
{
    var azimuth = tiltX || tiltY 
                ? (Math.atan2(tiltY, tiltX) * 180 / Math.PI) 
                : 0;
    if (azimuth<0) {
        azimuth = 360  + azimuth;
    }
    return azimuth;
}

export function tiltxyToTiltAltitude(tiltX, tiltY)
{
   const angle = tiltX  || tiltY 
                ? (Math.sqrt( tiltX  * tiltX  + tiltY  * tiltY))
                : 0;
    return angle;
}