export function formatUnixTimestampToEasyRead(timestamp: number, timezone: string): string {
   // Convert Unix timestamp to milliseconds
	const date = new Date(timestamp * 1000);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit', 
		minute: '2-digit',
		hour12: true,
    timeZone: timezone 
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
}

/**
 * Returns the current time in a specified timezone.
 * 
 * @param {string} timezone - The IANA timezone string (e.g., "America/Chicago").
 * @returns {string} - The current time formatted as HH:mm:ss.
 */
export function getCurrentTimeInTimezone(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    hour12: true 
  });

  // Extract the time parts from the formatted string
  const formattedTime = formatter.format(now);
  
  return formattedTime;
}