// ty chat gpt
export const weatherImages: {[x: string]: string} = {
  // Thunderstorm
  "200": "thunder_", // thunderstorm with light rain
  "201": "thunder_", // thunderstorm with rain
  "202": "thunder_", // thunderstorm with heavy rain
  "210": "thunder_", // light thunderstorm
  "211": "thunder_", // thunderstorm
  "212": "thunder_", // heavy thunderstorm
  "221": "thunder_", // ragged thunderstorm
  "230": "thunder_", // thunderstorm with light drizzle
  "231": "thunder_", // thunderstorm with drizzle
  "232": "thunder_", // thunderstorm with heavy drizzle
  // Night variants for thunderstorms
  "200_night": "thunder_night_",
  "210_night": "thunder_night_",
  "211_night": "thunder_night_",

  // Drizzle & Rain - Using generic rain images as placeholders
  "300": "rain_light_", // light intensity drizzle
  "301": "rain_light_", // drizzle
  "500": "rain_light_", // light rain
  "501": "rain_heavy_", // moderate rain
  "502": "rain_heavy_", // heavy intensity rain
  "520": "rain_light_", // light intensity shower rain
  "521": "rain_heavy_", // shower rain
  // Night variants for rain
  "500_night": "rain_light_night_",

  // Snow
  "600": "snowy_light_", // light snow
  "601": "snowy_light_", // snow
  "602": "snowy_heavy_night_", // heavy snow
  "620": "snowy_light_night_", // light shower snow
  "621": "snowy_light_night_", // shower snow
  // Night variants for snow
  "600_night": "snowy_light_night_",

  // Atmosphere
  "701": "cloudy_foggy_", // mist
  "741": "cloudy_foggy_", // fog
  // Night variants for atmosphere
  "701_night": "cloudy_foggy_night_",
  "741_night": "foggy_night_",

  // Clear
  "800": "sunny_", // clear sky
  // Night variant for clear
  "800_night": "night_",

  // Clouds
  "801": "cloudy_sunny_", // few clouds
  "802": "cloudy_sunny_", // scattered clouds
  "803": "cloudy_sunny_", // broken clouds
  "804": "cloudy_sunny_", // overcast clouds
  // Night variants for clouds
  "801_night": "cloudy_night_",

  // Special conditions not explicitly covered but inferred
  "windy": "windy_",
  "windy_night": "windy_night_",
  "sunny_windy": "sunny_windy_",
  "rain_sunny": "rain_sunny_",
  "cloudy_windy": "cloudy_windy_",
  "cloudy_windy_night": "cloudy_windy_night_",
  "cloudy_windy_sunny": "cloudy_windy_sunny_",
  "windy_snowy": "windy_snowy_",
  "windy_snowy_night": "windy_snowy_night_",
  "sunny_foggy": "sunny_foggy_",
};