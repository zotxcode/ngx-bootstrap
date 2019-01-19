import { addFormatToken } from '../format/format';
import { addUnitAlias } from './aliases';
import { addUnitPriority } from './priorities';
import { addRegexToken, match1to2, match1to4, match1to6, match2, match4, match6, matchSigned } from '../parse/regex';
import { addWeekParseToken } from '../parse/token';
import { toInt } from '../utils/type-checks';
import { parseTwoDigitYear } from './year';
import { dayOfYearFromWeeks, weekOfYear, weeksInYear } from './week-calendar-utils';
import { createUTCDate } from '../create/date-from-array';
import { getISOWeek, getWeek } from './week';
import { getISODayOfWeek, getLocaleDayOfWeek } from './day-of-week';
import { getLocale } from '../locale/locales';
import { setDate, setFullYear, setMonth } from '../utils/date-setters';
import { getDate, getFullYear, getMonth } from '../utils/date-getters';
import { Locale } from '../locale/locale.class';
import { DateFormatterFn, DateFormatterOptions, WeekParsing } from '../types';

// FORMATTING

addFormatToken(null, ['gg', 2, false], null,
  function (date: Date, opts: DateFormatterOptions): string {
    // return this.weekYear() % 100;
    return (getWeekYear(date, opts.locale) % 100).toString();
  });

addFormatToken(null, ['GG', 2, false], null,
  function (date: Date): string {
    // return this.isoWeekYear() % 100;
    return (getISOWeekYear(date) % 100).toString();
  });

function addWeekYearFormatToken(token: string, getter: DateFormatterFn): void {
  addFormatToken(null, [token, token.length, false], null, getter);
}

function _getWeekYearFormatCb(date: Date, opts: DateFormatterOptions): string {
  return getWeekYear(date, opts.locale).toString();
}

function _getISOWeekYearFormatCb(date: Date): string {
  return getISOWeekYear(date).toString();
}

addWeekYearFormatToken('gggg', _getWeekYearFormatCb);
addWeekYearFormatToken('ggggg', _getWeekYearFormatCb);
addWeekYearFormatToken('GGGG', _getISOWeekYearFormatCb);
addWeekYearFormatToken('GGGGG', _getISOWeekYearFormatCb);

// ALIASES

addUnitAlias('weekYear', 'gg');
addUnitAlias('isoWeekYear', 'GG');

// PRIORITY

addUnitPriority('weekYear', 1);
addUnitPriority('isoWeekYear', 1);


// PARSING

addRegexToken('G', matchSigned);
addRegexToken('g', matchSigned);
addRegexToken('GG', match1to2, match2);
addRegexToken('gg', match1to2, match2);
addRegexToken('GGGG', match1to4, match4);
addRegexToken('gggg', match1to4, match4);
addRegexToken('GGGGG', match1to6, match6);
addRegexToken('ggggg', match1to6, match6);

addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'],
  function (input, week: WeekParsing, config, token) {
    week[token.substr(0, 2)] = toInt(input);

    return config;
  });

addWeekParseToken(['gg', 'GG'], function (input, week: WeekParsing, config, token) {
  week[token] = parseTwoDigitYear(input);

  return config;
});

// MOMENTS

export function getSetWeekYear(date: Date, input: number, locale = getLocale(), isUTC?: boolean): number | Date {
  return getSetWeekYearHelper(date,
    input,
    // this.week(),
    getWeek(date, locale, isUTC),
    // this.weekday(),
    getLocaleDayOfWeek(date, locale, isUTC),
    locale.firstDayOfWeek(),
    locale.firstDayOfYear(),
    isUTC);
}

export function getWeekYear(date: Date, locale = getLocale(), isUTC?: boolean): number {
  return weekOfYear(date, locale.firstDayOfWeek(), locale.firstDayOfYear(), isUTC).year;
}

export function getSetISOWeekYear(date: Date, input: number, isUTC?: boolean): number | Date {
  return getSetWeekYearHelper(date, input, getISOWeek(date, isUTC), getISODayOfWeek(date, isUTC), 1, 4);
}

export function getISOWeekYear(date: Date, isUTC?: boolean): number {
  return weekOfYear(date, 1, 4, isUTC).year;
}

export function getISOWeeksInYear(date: Date, isUTC?: boolean) {
  return weeksInYear(getFullYear(date, isUTC), 1, 4);
}

export function getWeeksInYear(date: Date, isUTC?: boolean, locale: Locale = getLocale()): number {
  return weeksInYear(getFullYear(date, isUTC), locale.firstDayOfWeek(), locale.firstDayOfYear());
}

function getSetWeekYearHelper(date: Date, input: number, week: number,
                              weekday: number, dow: number, doy: number, isUTC?: boolean): number | Date {
  if (!input) {
    return getWeekYear(date, void 0, isUTC);
  }

  const weeksTarget = weeksInYear(input, dow, doy);
  const _week = week > weeksTarget ? weeksTarget : week;

  return setWeekAll(date, input, _week, weekday, dow, doy);
}

function setWeekAll(date: Date, weekYear: number, week: number,
                    weekday: number, dow: number, doy: number): Date {
  const dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
  const _date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
  setFullYear(date, getFullYear(_date, true), true);
  setMonth(date, getMonth(_date, true), true);
  setDate(date, getDate(_date, true), true);

  return date;
}
