import { computed, toValue } from 'vue';

const REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[T\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/i;
const REGEX_FORMAT = /[YMDHhms]o|\[([^\]]+)\]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a{1,2}|A{1,2}|m{1,2}|s{1,2}|Z{1,2}|z{1,4}|SSS/g;
function defaultMeridiem(hours, minutes, isLowercase, hasPeriod) {
  let m = hours < 12 ? "AM" : "PM";
  if (hasPeriod)
    m = m.split("").reduce((acc, curr) => acc += `${curr}.`, "");
  return isLowercase ? m.toLowerCase() : m;
}
function formatOrdinal(num) {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = num % 100;
  return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}
function formatDate(date, formatStr, options = {}) {
  const years = date.getFullYear();
  const month = date.getMonth();
  const days = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  const day = date.getDay();
  const meridiem = options.customMeridiem ?? defaultMeridiem;
  const stripTimeZone = (dateString) => {
    return dateString.split(" ")[1] ?? "";
  };
  const matches = {
    Yo: () => formatOrdinal(years),
    YY: () => String(years).slice(-2),
    YYYY: () => years,
    M: () => month + 1,
    Mo: () => formatOrdinal(month + 1),
    MM: () => `${month + 1}`.padStart(2, "0"),
    MMM: () => date.toLocaleDateString(toValue(options.locales), { month: "short" }),
    MMMM: () => date.toLocaleDateString(toValue(options.locales), { month: "long" }),
    D: () => String(days),
    Do: () => formatOrdinal(days),
    DD: () => `${days}`.padStart(2, "0"),
    H: () => String(hours),
    Ho: () => formatOrdinal(hours),
    HH: () => `${hours}`.padStart(2, "0"),
    h: () => `${hours % 12 || 12}`.padStart(1, "0"),
    ho: () => formatOrdinal(hours % 12 || 12),
    hh: () => `${hours % 12 || 12}`.padStart(2, "0"),
    m: () => String(minutes),
    mo: () => formatOrdinal(minutes),
    mm: () => `${minutes}`.padStart(2, "0"),
    s: () => String(seconds),
    so: () => formatOrdinal(seconds),
    ss: () => `${seconds}`.padStart(2, "0"),
    SSS: () => `${milliseconds}`.padStart(3, "0"),
    d: () => day,
    dd: () => date.toLocaleDateString(toValue(options.locales), { weekday: "narrow" }),
    ddd: () => date.toLocaleDateString(toValue(options.locales), { weekday: "short" }),
    dddd: () => date.toLocaleDateString(toValue(options.locales), { weekday: "long" }),
    A: () => meridiem(hours, minutes),
    AA: () => meridiem(hours, minutes, false, true),
    a: () => meridiem(hours, minutes, true),
    aa: () => meridiem(hours, minutes, true, true),
    z: () => stripTimeZone(date.toLocaleDateString(toValue(options.locales), { timeZoneName: "shortOffset" })),
    zz: () => stripTimeZone(date.toLocaleDateString(toValue(options.locales), { timeZoneName: "shortOffset" })),
    zzz: () => stripTimeZone(date.toLocaleDateString(toValue(options.locales), { timeZoneName: "shortOffset" })),
    zzzz: () => stripTimeZone(date.toLocaleDateString(toValue(options.locales), { timeZoneName: "longOffset" }))
  };
  return formatStr.replace(REGEX_FORMAT, (match, $1) => $1 ?? matches[match]?.() ?? match);
}
function normalizeDate(date) {
  if (date === null)
    return new Date(Number.NaN);
  if (date === void 0)
    return /* @__PURE__ */ new Date();
  if (date instanceof Date)
    return new Date(date);
  if (typeof date === "string" && !/Z$/i.test(date)) {
    const d = date.match(REGEX_PARSE);
    if (d) {
      const m = d[2] - 1 || 0;
      const ms = (d[7] || "0").substring(0, 3);
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }
  return new Date(date);
}
// @__NO_SIDE_EFFECTS__
function useDateFormat(date, formatStr = "HH:mm:ss", options = {}) {
  return computed(() => formatDate(normalizeDate(toValue(date)), toValue(formatStr), options));
}

export { formatDate, normalizeDate, useDateFormat };
