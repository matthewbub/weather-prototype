import { dateToNumbers } from '../../helpers';

/**
 * Returns the next month given a current month.
 * @param month The current month as a number.
 * @returns The next month as a number.
 */
export const getNextMonth = (month: number) => {
  return month === 12 ? 1 : month + 1;
};

/**
 * Returns the previous month given a current month.
 * @param month The current month as a number.
 * @returns The previous month as a number.
 */
export const getPreviousMonth = (month: number) => {
  return month === 1 ? 12 : month - 1;
};

/**
 * Creates an array of weeks for the calendar.
 * @param days - Array of days for the calendar.
 * @returns Array of weeks for the calendar.
 * @example
 * const days = [null, null, null, null, null, null, null, <Day />, <Day />, <Day />
 * const weeks = createCalendarWeeks(days);
*/
export const createCalendarWeeks = (days: (JSX.Element | null)[]) => {
  const weeks: (JSX.Element | null)[][] = [];

  for (let i = 0;i < days.length;i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

/**
 * Determines whether the given date is the same day as today.
 *
 * @param {Date} date - The date to compare with today.
 * @returns {boolean} Returns true if the given date is the same day as today, false otherwise.
 * @example
 *  if (isToday(new Date())) {
 *    console.log("The given date is today!");
 *  } else {
 *    console.log("The given date is not today.");
 *  }
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return isSameDay(date, today);
};


/**
 * Determines whether two dates represent the same day, regardless of the time of day.
 *
 * @param {Date} a - The first date to compare.
 * @param {Date} b - The second date to compare.
 * @returns {boolean} Returns true if the two dates represent the same day, false otherwise.
 * @example
 *  const customDate = customDates.find(cd => isSameDay(cd.date, currentDate));
 */
export const isSameDay = (a: Date, b: Date): boolean => {
  const aN = dateToNumbers(a);
  const bN = dateToNumbers(b);

  const isSameYear = aN.year === bN.year;
  const isSameMonth = aN.month === bN.month;
  const isSameDate = aN.day === bN.day;

  if (isSameYear && isSameMonth && isSameDate) {
    return true;
  }

  return false;
};
