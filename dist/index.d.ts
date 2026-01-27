import { MaybeRefOrGetter, ComputedRef } from 'vue';

type DateLike = Date | number | string | undefined;
interface UseDateFormatOptions {
    /**
     * The locale(s) to used for dd/ddd/dddd/MMM/MMMM format
     *
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument).
     */
    locales?: MaybeRefOrGetter<Intl.LocalesArgument>;
    /**
     * A custom function to re-modify the way to display meridiem
     *
     */
    customMeridiem?: (hours: number, minutes: number, isLowercase?: boolean, hasPeriod?: boolean) => string;
}
declare function formatDate(date: Date, formatStr: string, options?: UseDateFormatOptions): string;
declare function normalizeDate(date: DateLike): Date;
type UseDateFormatReturn = ComputedRef<string>;
/**
 * Get the formatted date according to the string of tokens passed in.
 *
 * @see https://vueuse.org/useDateFormat
 * @param date - The date to format, can either be a `Date` object, a timestamp, or a string
 * @param formatStr - The combination of tokens to format the date
 * @param options - UseDateFormatOptions
 *
 * @__NO_SIDE_EFFECTS__
 */
declare function useDateFormat(date: MaybeRefOrGetter<DateLike>, formatStr?: MaybeRefOrGetter<string>, options?: UseDateFormatOptions): UseDateFormatReturn;

export { formatDate, normalizeDate, useDateFormat };
export type { DateLike, UseDateFormatOptions, UseDateFormatReturn };
