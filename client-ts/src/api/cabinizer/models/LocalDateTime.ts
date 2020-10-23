/* eslint-disable */

import { CalendarSystem } from './CalendarSystem';
import { Era } from './Era';
import { IsoDayOfWeek } from './IsoDayOfWeek';
import { LocalDate } from './LocalDate';
import { LocalTime } from './LocalTime';

export interface LocalDateTime {
  calendar?: CalendarSystem;
  readonly year?: number;
  readonly yearOfEra?: number;
  era?: Era;
  readonly month?: number;
  readonly dayOfYear?: number;
  readonly day?: number;
  dayOfWeek?: IsoDayOfWeek;
  readonly hour?: number;
  readonly clockHourOfHalfDay?: number;
  readonly minute?: number;
  readonly second?: number;
  readonly millisecond?: number;
  readonly tickOfSecond?: number;
  readonly tickOfDay?: number;
  readonly nanosecondOfSecond?: number;
  readonly nanosecondOfDay?: number;
  timeOfDay?: LocalTime;
  date?: LocalDate;
}
