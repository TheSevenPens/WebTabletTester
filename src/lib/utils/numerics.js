import { easeOutCubic, lerp } from './interpolation.js';


export function format4Digits1Decimal(num) {
    const nbsp = "\u00A0";
    return num.toFixed(1).padStart(6, nbsp );
}

export function format1Digit4Decimals(num) {
    return num.toFixed(4);
}


export function roundTo4DecimalPlaces(v)
{
  return Math.round(v * 10000) / 10000;
}

export function roundTo3DecimalPlaces(v) 
{
  return Math.round(v * 1000) / 1000;
}

export function roundTo2DecimalPlaces(v) 
{
  return Math.round(v * 100) / 100;
}

export function roundTo1DecimalPlaces(v) 
{
  return Math.round(v * 10) / 10;
}

export function radiansToDegrees(r)
{
    return (r * 57.2958);
}

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