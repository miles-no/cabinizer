/* eslint-disable */

import { CalendarSystem } from './CalendarSystem';
import { Era } from './Era';
import { IsoDayOfWeek } from './IsoDayOfWeek';

export interface LocalDate {
  calendar?: CalendarSystem;
  readonly year?: number;
  readonly month?: number;
  readonly day?: number;
  dayOfWeek?: IsoDayOfWeek;
  readonly yearOfEra?: number;
  era?: Era;
  readonly dayOfYear?: number;
}
