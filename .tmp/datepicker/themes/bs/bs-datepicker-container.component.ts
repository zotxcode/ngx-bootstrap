import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { BsDatepickerAbstractComponent } from '../../base/bs-datepicker-container';

import { BsDatepickerConfig } from '../../bs-datepicker.config';
import { DayViewModel } from '../../models/index';
import { BsDatepickerActions } from '../../reducer/bs-datepicker.actions';
import { BsDatepickerEffects } from '../../reducer/bs-datepicker.effects';
import { BsDatepickerStore } from '../../reducer/bs-datepicker.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bs-datepicker-container',
  providers: [BsDatepickerStore, BsDatepickerEffects],
  template: "<!-- days calendar view mode --> <div class=\"bs-datepicker\" [ngClass]=\"containerClass\" *ngIf=\"viewMode | async\"> <div class=\"bs-datepicker-container\"> <!--calendars--> <div class=\"bs-calendar-container\" [ngSwitch]=\"viewMode | async\" role=\"application\"> <!--days calendar--> <div *ngSwitchCase=\"'day'\"> <bs-days-calendar-view *ngFor=\"let calendar of (daysCalendar | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async)?.length > 1\" [calendar]=\"calendar\" [options]=\"options | async\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"dayHoverHandler($event)\" (onSelect)=\"daySelectHandler($event)\" ></bs-days-calendar-view> </div> <!--months calendar--> <div *ngSwitchCase=\"'month'\"> <bs-month-calendar-view *ngFor=\"let calendar of (monthsCalendar | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async)?.length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"monthHoverHandler($event)\" (onSelect)=\"monthSelectHandler($event)\" ></bs-month-calendar-view> </div> <!--years calendar--> <div *ngSwitchCase=\"'year'\"> <bs-years-calendar-view *ngFor=\"let calendar of (yearsCalendar | async)\" [class.bs-datepicker-multiple]=\"(daysCalendar | async)?.length > 1\" [calendar]=\"calendar\" (onNavigate)=\"navigateTo($event)\" (onViewMode)=\"setViewMode($event)\" (onHover)=\"yearHoverHandler($event)\" (onSelect)=\"yearSelectHandler($event)\" ></bs-years-calendar-view> </div> </div> <!--applycancel buttons--> <div class=\"bs-datepicker-buttons\" *ngIf=\"false\"> <button class=\"btn btn-success\">Apply</button> <button class=\"btn btn-default\">Cancel</button> </div> </div> <!--custom dates or date ranges picker--> <div class=\"bs-datepicker-custom-range\" *ngIf=\"false\"> <bs-custom-date-view [ranges]=\"_customRangesFish\"></bs-custom-date-view> </div> </div> ",
  host: {
    '(click)': '_stopPropagation($event)',
    style: 'position: absolute; display: block;',
    role: 'dialog',
    'aria-label': 'calendar'
  }
})
export class BsDatepickerContainerComponent extends BsDatepickerAbstractComponent
  implements OnInit, OnDestroy {
  set value(value: Date) {
    this._effects.setValue(value);
  }
  valueChange: EventEmitter<Date> = new EventEmitter<Date>();

  _subs: Subscription[] = [];
  constructor(
    private _config: BsDatepickerConfig,
    private _store: BsDatepickerStore,
    private _actions: BsDatepickerActions,
    _effects: BsDatepickerEffects
  ) {
    super();
    this._effects = _effects;
  }

  ngOnInit(): void {
    this.containerClass = this._config.containerClass;
    this._effects
      .init(this._store)
      // intial state options
      .setOptions(this._config)
      // data binding view --> model
      .setBindings(this)
      // set event handlers
      .setEventHandlers(this)
      .registerDatepickerSideEffects();

    // todo: move it somewhere else
    // on selected date change
    this._subs.push(
      this._store
        .select(state => state.selectedDate)
        .subscribe(date => this.valueChange.emit(date))
    );
  }

  daySelectHandler(day: DayViewModel): void {
    if (day.isOtherMonth || day.isDisabled) {
      return;
    }
    this._store.dispatch(this._actions.select(day.date));
  }

  ngOnDestroy(): void {
    for (const sub of this._subs) {
      sub.unsubscribe();
    }
    this._effects.destroy();
  }
}
