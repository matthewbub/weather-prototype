/**
 * Converts a temperature from Kelvin to Fahrenheit.
 * 
 * @param {number} kelvin - The temperature in Kelvin to be converted.
 * @returns {string} The converted temperature in Fahrenheit, rounded to the nearest whole number, followed by °F.
 */
export function kelvinToFahrenheit(kelvin: number): string {
  return `${Math.round((kelvin - 273.15) * (9/5) + 32)}°F`;
}

/**
 * Converts a temperature from Kelvin to Celsius.
 * 
 * @param {number} kelvin - The temperature in Kelvin to be converted.
 * @returns {string} The converted temperature in Celsius, rounded to the nearest whole number, followed by °C.
 */
export function kelvinToCelsius(kelvin: number): string {
  return `${Math.round(kelvin - 273.15)}°C`;
}