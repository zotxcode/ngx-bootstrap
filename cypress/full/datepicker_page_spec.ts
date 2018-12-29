import { DatepickerPo } from '../support/datepicker.po';

describe('Datepicker demo page test suite', () => {
  const datepicker = new DatepickerPo();
  const newDate = new Date();
  const currentMonthNum: number = newDate.getMonth();
  const currentMonthStr: string = datepicker.monthNames[newDate.getMonth()];
  const prevMonthStr: string = datepicker.monthNames[currentMonthNum === 0 ? 11 : currentMonthNum - 1];
  const currentYearNum: number = newDate.getFullYear();
  const currentYearStr: string = currentYearNum.toString();
  const prevYearStr: string = (currentYearNum - 1).toString();
  const nextMonthStr: string = datepicker.monthNames[(currentMonthNum + 1)];
  const nextYearStr: string = (currentYearNum + 1).toString();
  const currentDay: number = newDate.getDate();
  const daySevenAfterCurrent = new Date();
  daySevenAfterCurrent.setDate(newDate.getDate() + 7);

  beforeEach(() => datepicker.navigateTo());

  describe('Initial state', () => {
    const initialState = datepicker.exampleDemosArr.initialState;

    beforeEach(() => datepicker.scrollToMenu('Initial state'));

    it(`example contains 2 inputs, 2 buttons Datepicker and Daterangepicker, value in Datepicker input is current day,
                     value in Daterangepicker input is interval from current day to current + 7 days`, () => {
      datepicker.isInputHaveAttrs(initialState, [{ attr: 'type', value: 'text' }], 0);
      datepicker.isButtonExist(initialState, 'Date Picker', 0);
      datepicker.isButtonExist(initialState, 'Date Range Picker', 1);
      datepicker.isInputValueEqual(initialState, `${newDate.toLocaleDateString('en-US')}`, 0);
      datepicker.isInputValueEqual(initialState, `${
        newDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
        } - ${
        daySevenAfterCurrent.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}`, 1);
    });

    it('when user clicks on "Date Picker" button, bs-datepicker-container opened and current date selected', () => {
      datepicker.clickOnBtn(initialState, 0);
      datepicker.isDatepickerOpened(true);
      datepicker.isSelectedDateExist('datepicker', true, `${currentDay}`);
    });

    it('when user clicks on other date, that date selected and shown in input', () => {
      const dayToChose = currentDay === 15 ? '16' : '15';
      datepicker.clickOnBtn(initialState, 0);
      datepicker.clickOnDatepickerTableItem('date', undefined, dayToChose);
      datepicker.isDatepickerOpened(false);
      datepicker.isInputValueEqual(initialState, `${currentMonthNum + 1}/${dayToChose}/${currentYearStr}`, 0);
      datepicker.clickOnBtn(initialState, 0);
      datepicker.isSelectedDateExist('datepicker', true, `${dayToChose}`);
    });

    it('when user clicks on "Date Range Picker", bs-daterangepicker-container opened with interval selected', () => {
      datepicker.clickOnBtn(initialState, 1);
      datepicker.isDaterangepickerOpened(true);
      datepicker.isSelectedDateExist('daterangepicker', true, `${currentDay}`);
      datepicker.isSelectedDateExist('daterangepicker', true, `${daySevenAfterCurrent.getDate()}`);
    });

    it('when user chose another interval, that interval selected and shown in input', () => {
      const dayToChose = currentDay === 15 ? '16' : '15';
      const nextDayToChose = `${Number(dayToChose) + 1}`;
      datepicker.clickOnBtn(initialState, 1);
      datepicker.clickOnDaterangePickerTableItem('date', 0, undefined, dayToChose);
      datepicker.clickOnDaterangePickerTableItem('date', 0, undefined, nextDayToChose);
      datepicker.isDatepickerOpened(false);
      datepicker.isInputValueEqual(initialState,
        `${currentMonthNum + 1}/${dayToChose}/${currentYearStr} - ${
        currentMonthNum + 1}/${nextDayToChose}/${currentYearStr}`, 1);
      datepicker.clickOnBtn(initialState, 1);
      datepicker.isSelectedDateExist('daterangepicker', true, dayToChose);
      datepicker.isSelectedDateExist('daterangepicker', true, nextDayToChose);
    });
  });

  describe('Custom date format', () => {
    const customFormat = datepicker.exampleDemosArr.customFormat;

    beforeEach(() => datepicker.scrollToMenu('Custom date format'));

    it(`example contains 3 Datepicker inputs, 3 clickable buttons, value in inputs is current day in diff formats:
                     "YYYY-MM-DD", "MM/DD/YYYY", "MMMM Do YYYY,h:mm:ss a"`, () => {
      datepicker.isInputHaveAttrs(customFormat, [{ attr: 'formcontrolname', value: 'myDateYMD' }], 0);
      datepicker.isInputHaveAttrs(customFormat, [{ attr: 'formcontrolname', value: 'myDateMDY' }], 1);
      datepicker.isInputHaveAttrs(customFormat, [{ attr: 'formcontrolname', value: 'myDateFull' }], 2);
      datepicker.isButtonExist(customFormat, 'Date Picker', 0);
      datepicker.isButtonExist(customFormat, 'Date Picker', 1);
      datepicker.isButtonExist(customFormat, 'Date Picker', 2);
      datepicker.isInputValueEqual(customFormat, `${currentYearNum}-${currentMonthNum + 1}-${currentDay}`, 0);
      datepicker.isInputValueEqual(customFormat, `${currentMonthNum + 1}/${currentDay}/${currentYearNum}`, 1);
      datepicker.isInputValueContain(customFormat,
        `${newDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`, 2);
      datepicker.isInputValueContain(customFormat,
        `${newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase().split('')[1]}`, 2);
    });

    it('when user click on the first "Date Picker" btn, chose other date - it chosen, appear in "YYYY-MM-DD"', () => {
      const dayToChose = currentDay === 15 ? '16' : '15';
      datepicker.clickOnBtn(customFormat, 0);
      datepicker.clickOnDatepickerTableItem('date', undefined, dayToChose);
      datepicker.isInputValueEqual(customFormat, `${currentYearNum}-${currentMonthNum + 1}-${dayToChose}`, 0);
    });

    it('when user click on the second "Date Picker" btn, chose other date - it chosen, appear in "MM/DD/YYYY"', () => {
      const dayToChose = currentDay === 15 ? '16' : '15';
      datepicker.clickOnBtn(customFormat, 1);
      datepicker.clickOnDatepickerTableItem('date', undefined, dayToChose);
      datepicker.isInputValueEqual(customFormat, `${currentMonthNum + 1}/${dayToChose}/${currentYearNum}`, 1);
    });

    it('when user click on the third "Date Picker" btn, chose other date - it chosen, MMMM Do YYYY,h:mm:ss a', () => {
      const dayToChose = currentDay === 15 ? '16' : '15';
      datepicker.clickOnBtn(customFormat, 2);
      datepicker.clickOnDatepickerTableItem('date', undefined, dayToChose);
      datepicker.isInputValueContain(customFormat,
        `${currentMonthStr} ${dayToChose}th ${currentYearNum}`, 2);
      datepicker.isInputValueContain(customFormat,
        `${newDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase().split('')[1]}`, 2);
    });
  });

  describe('Hide on scroll', () => {
    const hideOnScroll = datepicker.exampleDemosArr.hideOnScroll;

    beforeEach(() => datepicker.scrollToMenu('Hide on scroll'));

    it(`example contains Datepicker input, "Date Picker" button`, () => {
      datepicker.isInputHaveAttrs(hideOnScroll, [{ attr: 'placeholder', value: 'Datepicker' }]);
      datepicker.isButtonExist(hideOnScroll, 'Date Picker');
    });

    it(`when user clicks on "Date Picker", container opened without selected date, after scroll it disappear`, () => {
      // TODO impossible open datepicker, because scroll always triggers
      // datepicker.clickOnBtn(hideOnScroll);
      // datepicker.clickOnDatepickerInput(hideOnScroll);
      // datepicker.setBtnAttribute(hideOnScroll, 0, 'true');
      // datepicker.isDatepickerOpened(true);
      // datepicker.isSelectedDateExist('datepicker', false);
      // datepicker.scrollToDatepickerBottom(hideOnScroll);
      // datepicker.isDatepickerOpened(false);
    });
  });

  describe('Themes', () => {
    const themes = datepicker.exampleDemosArr.themes;

    beforeEach(() => datepicker.scrollToMenu('Themes'));

    it(`example contains select field (with "green" by default), Datepicker input and button "Open"`, () => {
      datepicker.isInputHaveAttrs(themes, [{ attr: 'type', value: 'text' }]);
      datepicker.isButtonExist(themes, 'Open');
      datepicker.isSelectExist(themes, 'green');
    });

    it(`when user clicks on "Open" button, bs-datepicker theme-green opened with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.isDatepickerStyleCorrect('green');
    });

    it(`when user chose "default", bs-datepicker theme-default shown with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.selectOne(themes, 'default');
      datepicker.isDatepickerStyleCorrect('default');
    });

    it(`when user chose "blue", bs-datepicker theme-blue shown with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.selectOne(themes, 'blue');
      datepicker.isDatepickerStyleCorrect('blue');
    });

    it(`when user chose "dark-blue", bs-datepicker theme-dark-blue shown with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.selectOne(themes, 'dark-blue');
      datepicker.isDatepickerStyleCorrect('dark-blue');
    });

    it(`when user chose "red", bs-datepicker theme-red shown with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.selectOne(themes, 'red');
      datepicker.isDatepickerStyleCorrect('red');
    });

    it(`when user chose "orange", bs-datepicker theme-red shown with appropriate styles`, () => {
      datepicker.clickOnBtn(themes);
      datepicker.isDatepickerOpened(true);
      datepicker.selectOne(themes, 'orange');
      datepicker.isDatepickerStyleCorrect('orange');
    });
  });

  describe('Locales', () => {
    const locales = datepicker.exampleDemosArr.locales;

    beforeEach(() => datepicker.scrollToMenu('Locales'));

    it(`example contains 2 selects (with "en" locale), Datepicker and Daterangepicker and appropriate buttons`, () => {
      datepicker.isSelectExist(locales, 'en', 0);
      datepicker.isSelectExist(locales, 'en', 1);
      datepicker.isInputHaveAttrs(locales, [{ attr: 'placeholder', value: 'Datepicker' }], 0);
      datepicker.isInputHaveAttrs(locales, [{ attr: 'placeholder', value: 'Daterangepicker' }], 1);
      datepicker.isButtonExist(locales, 'Date Picker', 0);
      datepicker.isButtonExist(locales, 'Date Range Picker', 1);
    });

    it(`when user clicks on "Date Picker" btn, container opened with all info in English (month, days)`, () => {
      datepicker.clickOnBtn(locales, 0);
      datepicker.isDatepickerOpened(true);
      datepicker.clickOnNavigation('month');
      datepicker.isMonthLocaleAppropriate('en');
      datepicker.clickOnDatepickerTableItem('month', 0);
      datepicker.isWeekdayLocaleAppropriate('en');
    });

    it(`when user chose locale "N" for "Datepicker", container shown with info in appr language`, () => {
      datepicker.getLocalesList().each(locale => {
        cy.log(`Current Datepicker Locale, which is in test: ${locale.text()}`);
        datepicker.selectOne(locales, locale.text(), 0);
        datepicker.isDatepickerOpened(true);
        datepicker.clickOnNavigation('month');
        datepicker.isMonthLocaleAppropriate(locale.text());
        datepicker.clickOnDatepickerTableItem('month', 0);
        datepicker.isWeekdayLocaleAppropriate(locale.text());
      });
    });

    it(`when user clicks on "Date Range Picker" button, container opened in English (month, days)`, () => {
      datepicker.clickOnBtn(locales, 1);
      datepicker.isDaterangepickerOpened(true);
      datepicker.clickOnDateRangePickerNavigation('month-left');
      datepicker.isMonthLocaleAppropriate('en', 'daterangepicker');
      datepicker.clickOnDaterangePickerTableItem('month', 0, 0);
      datepicker.isWeekdayLocaleAppropriate('en', 'daterangepicker');
    });

    it(`when user chose other locale "N" for "Daterangepicker", container shown in appropriate language`, () => {
      datepicker.getLocalesList('daterangepicker').each(locale => {
        cy.log(`Current Daterangepicker Locale, which is in test: ${locale.text()}`);
        datepicker.selectOne(locales, locale.text(), 1);
        datepicker.isDaterangepickerOpened(true);
        datepicker.clickOnDateRangePickerNavigation('month-left');
        datepicker.isMonthLocaleAppropriate(locale.text(), 'daterangepicker');
        datepicker.clickOnDaterangePickerTableItem('month', 0, 0);
        datepicker.isWeekdayLocaleAppropriate(locale.text(), 'daterangepicker');
      });
    });
  });

  describe('Min-max', () => {
    const minMax = datepicker.exampleDemosArr.minMax;

    beforeEach(() => datepicker.scrollToMenu('Min-max'));

    it(`example contains 2 inputs: Datepicker and Daterangepicker`, () => {
      datepicker.isInputHaveAttrs(minMax, [{ attr: 'placeholder', value: 'Datepicker' }], 0);
      datepicker.isInputHaveAttrs(minMax, [{ attr: 'placeholder', value: 'Daterangepicker' }], 1);
    });

    it(`when user clicks on Datepicker input, then container opened and user can chose date from min-max`, () => {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 1);
      maxDate.setDate(maxDate.getDate() + 7);
      datepicker.clickOnDatepickerInput(minMax);
      datepicker.isDatepickerOpened(true);
      datepicker.isDayIntervalDisabledInCurrentMonth(minDate, maxDate, false);
      datepicker.clickOnNavigation('>');
      datepicker.isDayIntervalDisabledInNextMonth(minDate, maxDate, false);
    });

    it(`when user clicks on any other date, not from this interval, nothing happens`, () => {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 2);
      maxDate.setDate(maxDate.getDate() + 8);
      const dateOutOfIntervalLeft = new Date(minDate.getTime());
      const dateOutOfIntervalRight = new Date(maxDate.getTime());
      dateOutOfIntervalLeft.setDate((dateOutOfIntervalLeft.getDate() - 5));
      dateOutOfIntervalRight.setDate((dateOutOfIntervalRight.getDate() + 5));
      datepicker.clickOnDatepickerInput(minMax);
      datepicker.isDatepickerOpened(true);
      if (minDate.getMonth() === dateOutOfIntervalLeft.getMonth()) {
        datepicker.isDayIntervalDisabledInCurrentMonth(dateOutOfIntervalLeft, minDate, true);
      } else {
        datepicker.clickOnNavigation('>');
        datepicker.isDayIntervalDisabledInNextMonth(maxDate, dateOutOfIntervalRight, true);
      }
    });

    it('when user clicks on date from this interval, it chosen and shown in input in format "mm/dd/yyyy"', () => {
      const minDate = new Date();
      minDate.setDate(minDate.getDate() - 1);
      datepicker.clickOnDatepickerInput(minMax);
      datepicker.clickOnDatepickerTableItem('date', undefined, `${minDate.getDate()}`);
      datepicker.isInputValueEqual(minMax, minDate.toLocaleDateString('en'), 0);
    });

    it(`when user clicks on DateRange input, then container opened and user can chose date from min-max`, () => {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 1);
      maxDate.setDate(maxDate.getDate() + 7);
      datepicker.clickOnDaterangepickerInput(minMax);
      datepicker.isDaterangepickerOpened(true);
      datepicker.isDayIntervalDisabledInCurrentMonthDateRange(minDate, maxDate, false);
      datepicker.isDayIntervalDisabledInNextMonthDateRange(minDate, maxDate, false);
    });

    it(`clicks on any other date in daterangepicker, not from this interval, nothing happens`, () => {
      const minDate = new Date();
      const maxDate = new Date();
      minDate.setDate(minDate.getDate() - 2);
      maxDate.setDate(maxDate.getDate() + 8);
      const dateOutOfIntervalLeft = new Date(minDate.getTime());
      const dateOutOfIntervalRight = new Date(maxDate.getTime());
      dateOutOfIntervalLeft.setDate((dateOutOfIntervalLeft.getDate() - 5));
      dateOutOfIntervalRight.setDate((dateOutOfIntervalRight.getDate() + 5));
      datepicker.clickOnDaterangepickerInput(minMax);
      datepicker.isDaterangepickerOpened(true);
      if (minDate.getMonth() === dateOutOfIntervalLeft.getMonth()) {
        datepicker.isDayIntervalDisabledInCurrentMonthDateRange(dateOutOfIntervalLeft, minDate, true);
      } else {
        datepicker.isDayIntervalDisabledInNextMonthDateRange(maxDate, dateOutOfIntervalRight, true);
      }
    });

    it('when user clicks on the first, second date from this interval, then it shown in input "mm/dd/yyyy"', () => {
      const dateLeft = new Date();
      const dateRight = new Date();
      dateLeft.setDate(dateLeft.getDate() - 1);
      datepicker.clickOnDaterangepickerInput(minMax);
      datepicker.clickOnDaterangePickerTableItem('date', 0, undefined, `${dateLeft.getDate()}`);
      if (dateLeft.getMonth() === dateRight.getMonth()) {
        datepicker.clickOnDaterangePickerTableItem('date', 0, undefined, `${dateRight.getDate()}`);
      } else {
        datepicker.clickOnDaterangePickerTableItem('date', 1, undefined, `${dateRight.getDate()}`);
      }
      datepicker.isInputValueEqual(minMax,
        `${dateLeft.toLocaleDateString('en')} - ${dateRight.toLocaleDateString('en')}`, 1);
    });
  });

  describe('Days disabled', () => {
    const daysDisabled = datepicker.exampleDemosArr.daysDisabled;

    beforeEach(() => datepicker.scrollToMenu('Days disabled'));

    it(`example contains 2 inputs of Datepicker`, () => {
      datepicker.isInputHaveAttrs(daysDisabled, [{ attr: 'placeholder', value: 'Datepicker' }], 0);
      datepicker.isInputHaveAttrs(daysDisabled, [{ attr: 'placeholder', value: 'Datepicker' }], 1);
    });

    it(`when user clicks on 1 Datepicker, then it opened, user can chose date except Saturday and Sunday
                   when user clicks on any Saturday or Sunday, nothing happens, they are disabled`, () => {
      datepicker.clickOnDatepickerInput(daysDisabled, 0);
      datepicker.isDatepickerOpened(true);
      datepicker.isSaturdaySundayDisabled(true);
      datepicker.clickOnWeekDay(false);
      datepicker.isDatepickerOpened(true);
      datepicker.isInputValueEqual(daysDisabled, '', 0);
    });

    it(`when user clicks on any active date in 1 datepicker, this date chosen and shown "mm/dd/yyyy"`, () => {
      datepicker.clickOnDatepickerInput(daysDisabled, 0);
      datepicker.clickOnWeekDay(true);
      datepicker.isDatepickerOpened(false);
      datepicker.isInputValueContain(daysDisabled, `${new Date().getMonth() + 1}`, 0);
      datepicker.isInputValueContain(daysDisabled, `${new Date().getFullYear()}`, 0);
    });

    it(`when user clicks on the second Datepicker, then container opened and user can chose any date`, () => {
      datepicker.clickOnDatepickerInput(daysDisabled, 1);
      datepicker.isDatepickerOpened(true);
      datepicker.clickOnDatepickerTableItem('date', undefined, '10');
      datepicker.isInputValueEqual(daysDisabled, `${new Date().getMonth() + 1}/10/${new Date().getFullYear()}`, 1);
    });

    it(`when user clicks on any Saturday or Sunday, this date chosen and shown in the input "mm/dd/yyyy"`, () => {
      datepicker.clickOnDatepickerInput(daysDisabled, 1);
      datepicker.clickOnWeekDay(false);
      datepicker.isInputValueContain(daysDisabled, `${new Date().getMonth() + 1}`, 1);
      datepicker.isInputValueContain(daysDisabled, `${new Date().getFullYear()}`, 1);
    });
  });
});
