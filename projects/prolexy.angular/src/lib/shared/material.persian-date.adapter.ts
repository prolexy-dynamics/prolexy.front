import { DateAdapter } from "@angular/material/core";
import moment from "jalali-moment";

export const PERSIAN_DATE_FORMATS = {
  parse: {
    dateInput: "jYYYY/jMM/jDD"
  },
  display: {
    dateInput: "jYYYY/jMM/jDD",
    monthYearLabel: "jYYYY jMMMM",
    dateA11yLabel: "jYYYY/jMM/jDD",
    monthYearA11yLabel: "jYYYY jMMMM"
  }
};

export class MaterialPersianDateAdapter extends DateAdapter<moment.Moment> {

  constructor() {
    super();
    super.setLocale("fa");
  }

  getYear(date: moment.Moment): number {
    return this.clone(date).jYear();
  }

  getMonth(date: moment.Moment): number {
    return this.clone(date).jMonth();
  }

  getDate(date: moment.Moment): number {
    return this.clone(date).jDate();
  }

  getDayOfWeek(date: moment.Moment): number {
    return this.clone(date).day();
  }

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long":
      case "short":
        return moment.localeData("fa").jMonths().slice(0);
      case "narrow":
        return moment.localeData("fa").jMonthsShort().slice(0);
    }
  }

  getDateNames(): string[] {
    const valuesArray = Array(31);
    for (let i = 0; i < 31; i++) {
      valuesArray[i] = String(i + 1);
    }
    return valuesArray;
  }

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long":
        return moment.localeData("fa").weekdays().slice(0);
      case "short":
        return moment.localeData("fa").weekdaysShort().slice(0);
      case "narrow":
        return ["ی", "د", "س", "چ", "پ", "ج", "ش"];
    }
  }

  getYearName(date: moment.Moment): string {
    return this.clone(date).jYear().toString();
  }

  getFirstDayOfWeek(): number {
    return moment.localeData("fa").firstDayOfWeek();
  }

  getNumDaysInMonth(date: moment.Moment): number {
    return this.clone(date).jDaysInMonth();
  }

  clone(date: moment.Moment): moment.Moment {
    return date.clone().locale("fa");
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }
    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }
    const result = moment().jYear(year).jMonth(month).jDate(date)
      .hours(0).minutes(0).seconds(0).milliseconds(0)
      .locale("fa");

    if (this.getMonth(result) !== month) {
      throw Error(`Invalid date ${date} for month with index ${month}.`);
    }
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }
    return result;
  }

  today(): moment.Moment {
    return moment().locale("fa");
  }

  parse(value: any, parseFormat: string | string[]): moment.Moment | null {
    if (value && typeof value === "string") {
      return moment(value, parseFormat, "fa");
    }
    return value ? moment(value).locale("fa") : null;
  }

  format(date: moment.Moment, displayFormat: string): string {
    date = this.clone(date);
    if (!this.isValid(date)) {
      throw Error("JalaliMomentDateAdapter: Cannot format invalid date.");
    }
    return date.format(displayFormat);
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    return this.clone(date).add(years, "jYear");
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    return this.clone(date).add(months, "jmonth");
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
    return this.clone(date).add(days, "jDay");
  }

  toIso8601(date: moment.Moment): string {
    return this.clone(date).format();
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj);
  }

  isValid(date: moment.Moment): boolean {
    return this.clone(date).isValid();
  }

  invalid(): moment.Moment {
    return moment.invalid();
  }

  override deserialize(value: any): moment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = moment(value);
    }
    if (typeof value === "string") {
      if (!value) {
        return null;
      }
      date = moment(value).locale("fa");
    }
    if (date && this.isValid(date)) {
      return date;
    }
    return super.deserialize(value);
  }
}