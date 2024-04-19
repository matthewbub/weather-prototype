// Function to convert degrees to radians
function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Haversine formula to calculate the distance between two points on the earth
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusMiles: number = 3958.8; // Radius of the Earth in miles
  const dLat: number = toRadians(lat2 - lat1);
  const dLon: number = toRadians(lon2 - lon1);
  const a: number = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance: number = earthRadiusMiles * c;
  return distance;
}

// Function to check if a point is within a 50 mile radius
function isWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radiusMiles: number = 50): boolean {
  return calculateDistance(lat1, lon1, lat2, lon2) <= radiusMiles;
}

// Example usage
const baseLat: number = 40.7128; // New York City latitude
const baseLon: number = -74.0060; // New York City longitude
const targetLat: number = 40.730610; // Some point's latitude
const targetLon: number = -73.935242; // Some point's longitude

if (isWithinRadius(baseLat, baseLon, targetLat, targetLon)) {
  console.log("The point is within a 50 mile radius.");
} else {
  console.log("The point is not within a 50 mile radius.");
}