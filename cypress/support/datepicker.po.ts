import { BaseComponent } from './base.component';
import {
  arLocale,
  bgLocale,
  glLocale,
  heLocale,
  hiLocale,
  ltLocale,
  mnLocale,
  nbLocale,
  svLocale,
  plLocale, roLocale, thLocale, trLocale
} from 'ngx-bootstrap/chronos';

export class DatepickerPo extends BaseComponent {
  pageUrl = '/datepicker';
  pageTitle = 'Datepicker';
  ghLinkToComponent = 'https://github.com/valor-software/ngx-bootstrap/tree/development/src/datepicker';

  datepickerInput = 'input[bsdatepicker]';
  daterangepickerInput = 'input[bsdaterangepicker]';
  datepickerLastOpened = 'bs-datepicker-container:last';
  daterangepickerLastOpened = 'bs-daterangepicker-container:last';
  datepickerNavView = 'bs-datepicker-navigation-view';
  datepickerContainer = 'bs-datepicker-container';
  daterangepickerContainer = 'bs-daterangepicker-container';
  datepickerDays = '[bsdatepickerdaydecorator]';
  datepickerBodyDaysView = 'bs-days-calendar-view';
  datepickerBodyMonthView = 'bs-month-calendar-view';
  datepickerBodyYearsView = 'bs-years-calendar-view';
  formOutput = '.code-preview';
  monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'January'];
  locales = [];


  exampleDemosArr = {
    basic: 'demo-datepicker-basic',
    initialState: 'demo-datepicker-date-initial-state',
    customFormat: 'demo-date-picker-custom-format',
    hideOnScroll: 'demo-date-picker-hide-on-scroll',
    themes: 'demo-datepicker-color-theming',
    locales: 'demo-datepicker-change-locale',
    minMax: 'demo-datepicker-min-max',
    daysDisabled: 'demo-datepicker-daysdisabled',
    minMode: 'demo-datepicker-min-mode',
    disabled: 'demo-datepicker-disabled',
    forms: 'demo-datepicker-forms',
    reactiveForms: 'demo-datepicker-reactive-forms',
    manualTrigger: 'demo-datepicker-triggers-manual',
    placemeent: 'demo-datepicker-placement',
    configMethod: 'demo-datepicker-config-method',
    visibilityEvents: 'demo-datepicker-visibility-events',
    valueChangeEvent: 'demo-datepicker-value-change-event',
    configProperties: 'demo-datepicker-config-object',
    selectFromOtherMonth: 'demo-datepicker-select-dates-from-other-months',
    outsideClick: 'demo-datepicker-outside-click',
    triggerByIsOpen: 'demo-datepicker-trigger-by-isopen',
    customTriggers: 'demo-datepicker-triggers-custom'
  };

  clickOnDayInCurrMonth(baseSelector: string, day: string) {
    cy.get(`${baseSelector} ${this.datepickerDays}`)
      .not('.is-other-month')
      .contains(day).click();
  }

  clickOnDatepickerInput(baseSelector: string, datepickerIndex = 0) {
    cy.get(`${baseSelector} ${this.datepickerInput}`).eq(datepickerIndex).click();
  }

  clickOnDaterangepickerInput(baseSelector: string) {
    cy.get(`${baseSelector} ${this.daterangepickerInput}`).click();
  }

  isSelectedDateExist(picker = 'datepicker' || 'daterangepicker', exist: boolean, expectedDay?: string) {
    if (!exist) {
      cy.get(`${picker === 'datepicker' ? this.datepickerContainer : this.daterangepickerContainer} .selected`)
        .should('not.exist');
    } else {
      cy.get(`${picker === 'datepicker' ? this.datepickerContainer : this.daterangepickerContainer} .selected`)
        .should('be.visible')
        .and('contain', expectedDay);
    }
  }

  isVisibleMonthOrYearEqual(expectedMonth: string) {
    cy.get(`${this.datepickerNavView} button`).eq(1)
      .should('be.visible')
      .and('to.have.text', expectedMonth);
  }

  isVisibleDateRangePickerMonthOrYearEqual(expectedValueLeft: string, expectedValueRight: string) {
    cy.get(`${this.datepickerNavView}`).eq(0).find('button').eq(1)
      .should('be.visible')
      .and('to.have.text', expectedValueLeft);
    cy.get(`${this.datepickerNavView}`).eq(1).find('button').eq(1)
      .should('be.visible')
      .and('to.have.text', expectedValueRight);
  }

  isDatepickerNavigationFullyActiveAndCorrect(mode = 'date',
                                              expectedMonth?: string,
                                              expectedYear?: string) {
    const currentMonth: string = this.monthNames[new Date().getMonth()];
    const currentYearSrt: string = new Date().getFullYear().toString();

    cy.get(`${this.datepickerContainer} ${this.datepickerNavView} button`).as('DatepickerNavBarArray');
    cy.get('@DatepickerNavBarArray')
      .should('to.have.length', mode === 'date' ? 4 : 3);
    cy.get('@DatepickerNavBarArray').get('.previous')
      .should('be.visible')
      .and('to.have.text', '‹');
    cy.get('@DatepickerNavBarArray').get('.next')
      .should('be.visible')
      .and('to.have.text', '›');
    if (mode === 'date') {
      cy.get('@DatepickerNavBarArray').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedMonth ? expectedMonth : currentMonth);
      cy.get('@DatepickerNavBarArray').eq(2)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : currentYearSrt);
    } else if (mode === 'month') {
      cy.get('@DatepickerNavBarArray').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : currentYearSrt);
    } else {
      cy.get('@DatepickerNavBarArray').eq(1)
        .should('be.visible')
        .and('to.have.text', `${new Date().getFullYear() - 7} - ${new Date().getFullYear() + 8}`);
    }
  }

  isDateRangepickerNavigationFullyActiveAndCorrect(mode = 'date',
                                                   expectedMonth?: string,
                                                   expectedYear?: string) {
    const currentMonth: string = this.monthNames[new Date().getMonth()];
    const nextMonth: string = this.monthNames[new Date().getMonth() + 1];
    const currentYearSrt: string = new Date().getFullYear().toString();
    const currentYearNum: number = new Date().getFullYear();
    const nextYear: string = (new Date().getFullYear() + 1).toString();

    cy.get(`${this.daterangepickerContainer} ${this.datepickerNavView}`).eq(0).as('DaterangepickerNavBarLeft');
    cy.get(`${this.daterangepickerContainer} ${this.datepickerNavView}`).eq(1).as('DaterangepickerNavBarRight');
    cy.get('@DaterangepickerNavBarLeft').find('button')
      .should('to.have.length', mode === 'date' ? 4 : 3);
    cy.get('@DaterangepickerNavBarLeft').find('button.previous')
      .should('be.visible')
      .and('to.have.text', '‹');
    cy.get('@DaterangepickerNavBarLeft').find('button.next')
      .should('be.hidden')
      .and('to.have.text', '›');
    cy.get('@DaterangepickerNavBarRight').find('button')
      .should('to.have.length', mode === 'date' ? 4 : 3);
    cy.get('@DaterangepickerNavBarRight').find('button.previous')
      .should('be.hidden')
      .and('to.have.text', '‹');
    cy.get('@DaterangepickerNavBarRight').find('button.next')
      .should('be.visible')
      .and('to.have.text', '›');
    if (mode === 'date') {
      cy.get('@DaterangepickerNavBarLeft').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedMonth ? expectedMonth : currentMonth);
      cy.get('@DaterangepickerNavBarLeft').find('button').eq(2)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : currentYearSrt);
      cy.get('@DaterangepickerNavBarRight').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedMonth ? this.monthNames[this.monthNames.indexOf(expectedMonth) + 1] : nextMonth);
      cy.get('@DaterangepickerNavBarRight').find('button').eq(2)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : (currentMonth === 'December' ? nextYear : currentYearSrt));
    } else if (mode === 'month') {
      cy.get('@DaterangepickerNavBarLeft').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : currentYearSrt);
      cy.get('@DaterangepickerNavBarRight').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', expectedYear ? expectedYear : nextYear);
    } else {
      cy.get('@DaterangepickerNavBarLeft').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', `${currentYearNum - 7} - ${currentYearNum + 8}`);
      cy.get('@DaterangepickerNavBarRight').find('button').eq(1)
        .should('be.visible')
        .and('to.have.text', `${currentYearNum + 9} - ${currentYearNum + 24}`);
    }
  }

  isDatePickerBodyExistAndCorrect(mode: string) {
    const bodyView = this.getBodyParams(mode).bodyView;
    const expectedLength = this.getBodyParams(mode).expectedLength;

    cy.get(`${this.datepickerContainer} ${bodyView} td`)
      .should('to.have.length', expectedLength);
  }

  isDaterangePickerBodyExistAndCorrect(mode: string) {
    const bodyView = this.getBodyParams(mode).bodyView;
    const expectedLength = this.getBodyParams(mode).expectedLength;

    cy.get(`${this.daterangepickerContainer} ${bodyView}`).each(bodyContainer => {
      cy.wrap(bodyContainer).find('td').should('to.have.length', expectedLength);
    });
  }

  isDatePickerTriggerCorrect(mode: string) {
    const bodyView = this.getBodyParams(mode).bodyView;

    cy.get(`${this.datepickerContainer} ${bodyView} td`)
      .each(date => {
        cy.wrap(date).trigger('mouseenter').should('to.have.class', 'is-highlighted');
      });
  }

  isDaterangePickerTriggerCorrect(mode: string) {
    const bodyView = this.getBodyParams(mode).bodyView;

    cy.get(`${this.daterangepickerContainer} ${bodyView}`).each(bodyContainer => {
      cy.wrap(bodyContainer).find('td')
        .each(date => {
          cy.wrap(date).trigger('mouseenter').should('to.have.class', 'is-highlighted');
        });
    });
  }

  isDatepickerOpened(opened: boolean) {
    cy.get(`${this.datepickerContainer}`).debug().should(opened ? 'to.be.exist' : 'not.to.be.exist');
  }

  isDaterangepickerOpened(opened: boolean) {
    cy.get(`${this.daterangepickerContainer}`).should(opened ? 'to.be.exist' : 'not.to.be.exist');
  }

  isInputValueEqual(baseSelector: string, expectedTxt: string, inputIndex = 0) {
    cy.get(`${baseSelector} input`).eq(inputIndex).should('to.have.value', expectedTxt);
  }

  isInputValueContain(baseSelector: string, expectedTxt: string, inputIndex = 0) {
    cy.get(`${baseSelector} input`).eq(inputIndex).then(input => {
      expect(input.val()).to.contains(expectedTxt);
    });
  }

  getBodyParams(mode: string) {
    let bodyView: string;
    let expectedLength: number;
    switch (mode) {
      case 'date':
        bodyView = this.datepickerBodyDaysView;
        expectedLength = 48;
        break;
      case 'month':
        bodyView = this.datepickerBodyMonthView;
        expectedLength = 12;
        break;
      case 'year':
        bodyView = this.datepickerBodyYearsView;
        expectedLength = 16;
        break;
      default:
        throw new Error('Unknown view mode');
    }

    return { bodyView, expectedLength };
  }

  clickOnNavigation(navigationItem: string) {
    switch (navigationItem) {
      case '<' :
        cy.get(`${this.datepickerNavView} .previous`).click();
        break;

      case '>' :
        cy.get(`${this.datepickerNavView} .next`).click();
        break;

      case 'month' :
        cy.get(`${this.datepickerNavView} button`).eq(1).click();
        break;

      case 'year' :
        cy.get(`${this.datepickerNavView} button`).eq(2).click();
        break;

      default:
        throw new Error('Unknown navigation item');
    }
  }

  clickOnDateRangePickerNavigation(navigationItem: string) {
    switch (navigationItem) {
      case '<' :
        cy.get(`${this.datepickerNavView}`).eq(0).find('.previous').click();
        break;

      case '>' :
        cy.get(`${this.datepickerNavView}`).eq(1).find('.next').click();
        break;

      case 'month-left' || 'yearInterval-left' :
        cy.get(`${this.datepickerNavView}`).eq(0).find('button').eq(1).click();
        break;

      case 'month-right' || 'yearInterval-right' :
        cy.get(`${this.datepickerNavView}`).eq(1).find('button').eq(1).click();
        break;

      case 'year-left' :
        cy.get(`${this.datepickerNavView}`).eq(0).find('button').eq(2).click();
        break;

      case 'year-right' :
        cy.get(`${this.datepickerNavView}`).eq(1).find('button').eq(2).click();
        break;

      default:
        throw new Error(`Unknown item, available: "<", ">", "month-left", "month-right",
        "year-left", "year-right", "yearInterval-left", "yearInterval-right"`);
    }
  }

  clickOnDatepickerTableItem(mode: string, itemIndex?: number, itemText?: string) {
    const bodyView = this.getBodyParams(mode).bodyView;

    if (itemText === undefined) {
      cy.get(`${this.datepickerContainer} ${bodyView} td`).eq(itemIndex).click();
    } else {
      cy.get(`${this.datepickerContainer} ${bodyView} td span`)
        .not('[class*="is-other-month"]') //TODO new was added ,need to recheck other tests
        .contains(itemText).click();
    }
  }

  clickOnDaterangePickerTableItem(mode: string, pickerIndex = 0, itemIndex?: number, itemText?: string) {
    const bodyView = this.getBodyParams(mode).bodyView;

    if (itemText === undefined) {
      cy.get(`${this.daterangepickerContainer} ${bodyView}`)
        .eq(pickerIndex)
        .find(`td span`)
        .not('[class*="is-other-month"]')
        .eq(itemIndex).click();
    } else {
      cy.get(`${this.daterangepickerContainer} ${bodyView}`)
        .eq(pickerIndex)
        .find(`td span`)
        .not('[class*="is-other-month"]')
        .contains(itemText).click();
    }
  }

  scrollToDatepickerBottom(baseSelector: string) {
    cy.get(`${this.datepickerContainer}`).scrollTo('bottom');
  }

  setBtnAttribute(baseSelector: string, buttonIndex = 0, attrValue: string) {
    cy.get(`${baseSelector} button`).eq(buttonIndex).invoke('attr', 'aria-expanded', attrValue);
  }

  isDatepickerStyleCorrect(expectedTheme: string) {
    let expColour: string;

    switch (expectedTheme) {
      case 'green' :
        expColour = 'rgb(92, 184, 92)';
        break;

      case 'default' :
        expColour = 'rgb(119, 119, 119)';
        break;

      case 'red' :
        expColour = 'rgb(217, 83, 79)';
        break;

      case 'blue' :
        expColour = 'rgb(91, 192, 222)';
        break;

      case 'dark-blue' :
        expColour = 'rgb(51, 122, 183)';
        break;

      case 'orange' :
        expColour = 'rgb(240, 173, 78)';
        break;

      default:
        throw new Error(`Unknown theme, available: "green", "blue", "dark-blue", "red", "orange", "default"`);
    }

    cy.get(`.bs-datepicker-head`).should('to.have.css', 'background-color', expColour);
    cy.get(`.bs-datepicker-body .week span`).should('to.have.css', 'color', expColour);
  }

  isMonthLocaleAppropriate(expectedLocale: string, pickerType = 'datepicker') {
    let actualMonthArr: any;
    switch (expectedLocale) {
      case 'hi' :
        actualMonthArr = hiLocale.months;
        break;

      case 'gl' :
        actualMonthArr = glLocale.months;
        break;

      case 'mn' :
        actualMonthArr = mnLocale.months;
        break;

      default:
        actualMonthArr = undefined;
    }
    cy.get(`${pickerType === 'datepicker' ? this.datepickerContainer : this.daterangepickerContainer} tbody td`)
      .eq(0).each((month, monthIndex) => {
      expect(month.text().toLowerCase()).to.contains(
        actualMonthArr ? actualMonthArr[monthIndex].toLowerCase() :
          new Date(2017, monthIndex)
            .toLocaleDateString(expectedLocale, { month: 'long' })
            .toLowerCase());
    });
  }

  isWeekdayLocaleAppropriate(expectedLocale: string, pickerType = 'datepicker') {
    let addIndex: number;
    let weekDayArray: any;

    switch (expectedLocale) {
      case 'ar':
        addIndex = 6;
        weekDayArray = arLocale.weekdaysShort;
        weekDayArray.unshift(weekDayArray[6]);
        weekDayArray.slice(7, 1);

        return weekDayArray;

      case 'bg':
        addIndex = 8;
        weekDayArray = bgLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'en' :
        addIndex = 7;
        break;

      case 'es-us' :
        addIndex = 7;
        break;

      case 'he' :
        addIndex = 6;
        weekDayArray = heLocale.weekdaysShort;
        break;

      case 'hi' :
        addIndex = 7;
        weekDayArray = hiLocale.weekdaysShort;
        break;

      case 'gl' :
        addIndex = 7;
        weekDayArray = glLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'ja' :
        addIndex = 7;
        break;

      case 'ko' :
        addIndex = 7;
        break;

      case 'lt' :
        weekDayArray = ltLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'mn' :
        weekDayArray = mnLocale.weekdaysShort;
        break;

      case 'nb' :
        weekDayArray = nbLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'pl' :
        weekDayArray = plLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'pt-br' :
        addIndex = 7;
        break;

      case 'ro' :
        weekDayArray = roLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'sv' :
        weekDayArray = svLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'th' :
        weekDayArray = thLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      case 'tr' :
        weekDayArray = trLocale.weekdaysShort;
        weekDayArray.push(weekDayArray.splice(0, 1)[0]);

        return weekDayArray;

      default:
        addIndex = 8;
    }
    cy.get(`${pickerType === 'datepicker' ? this.datepickerContainer : this.daterangepickerContainer} table`)
      .eq(0)
      .find('th[aria-label*="weekday"]')
      .each((weekday, weekdayIndex) => {
        expect(weekday.text().toLowerCase()).to.contains(
          weekDayArray ? weekDayArray[weekdayIndex].toLowerCase() :
            new Date(2018, 0, weekdayIndex + addIndex)
              .toLocaleDateString(expectedLocale, { weekday: 'short' })
              .toLowerCase());
      });
  }

  getLocalesList(pickerType = 'datepicker') {
    return cy.get(this.exampleDemosArr.locales).find('select').eq(pickerType === 'picker' ? 0 : 1).find('option');
  }

  isDayIntervalDisabledInCurrentMonth(minDate: Date, maxDate: Date, disabled: boolean) {
    const minOrigin = new Date(minDate.getTime());
    const min = minDate;
    for (min; min <= maxDate && min.getMonth() === minOrigin.getMonth(); min.setDate(min.getDate() + 1)) {
      cy.get(`${this.datepickerContainer} ${this.datepickerBodyDaysView} tbody span`)
        .not('[class*="is-other-month"]')
        .contains(min.getDate())
        .should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
    }
  }

  isSaturdaySundayDisabled(disabled: boolean) {
    cy.get(`${this.datepickerContainer} ${this.datepickerBodyDaysView} tbody tr`)
        .each(week => {
          cy.wrap(week)
            .find('td')
            .not('.week')
            .find('span')
            .first()
            .should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
          cy.wrap(week)
            .find('td')
            .not('.week')
            .find('span')
            .last().should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
        });
  }

  clickOnWeekDay(workingDay: boolean) {
    cy.get(`${this.datepickerContainer} ${this.datepickerBodyDaysView} tbody tr`)
      .eq(2)
      .find('td')
      .not('.week')
      .eq(workingDay ? 2 : 0)
      .click();
  }

  isDayIntervalDisabledInCurrentMonthDateRange(minDate: Date, maxDate: Date, disabled: boolean) {
    const minOrigin = new Date(minDate.getTime());
    const min = minDate;
    for (min; min <= maxDate && min.getMonth() === minOrigin.getMonth(); min.setDate(min.getDate() + 1)) {
      cy.get(`${this.daterangepickerContainer} ${this.datepickerBodyDaysView}`).eq(0).find(`tbody span`)
        .not('[class*="is-other-month"]')
        .contains(min.getDate())
        .should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
    }
  }

  isDayIntervalDisabledInNextMonth(minDate: Date, maxDate: Date, disabled: boolean) {
    const maxOrigin = new Date(maxDate.getTime());
    const max = maxDate;
    for (max; minDate <= max && maxOrigin.getMonth() === max.getMonth(); max.setDate(max.getDate() - 1)) {
      cy.get(`${this.datepickerContainer} ${this.datepickerBodyDaysView} tbody span`)
        .not('[class*="is-other-month"]')
        .contains(max.getDate())
        .should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
    }
  }

  isDayIntervalDisabledInNextMonthDateRange(minDate: Date, maxDate: Date, disabled: boolean) {
    const maxOrigin = new Date(maxDate.getTime());
    const max = maxDate;
    for (max; minDate <= max && maxOrigin.getMonth() === max.getMonth(); max.setDate(max.getDate() - 1)) {
      cy.get(`${this.daterangepickerContainer} ${this.datepickerBodyDaysView}`).eq(1).find(`tbody span`)
        .not('[class*="is-other-month"]')
        .contains(max.getDate())
        .should(disabled ? 'have.class' : 'not.to.have.class', 'disabled');
    }
  }
}
