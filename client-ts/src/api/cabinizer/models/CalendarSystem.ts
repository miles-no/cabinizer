/* eslint-disable */

import { Era } from './Era';

export interface CalendarSystem {
  readonly id?: string | null;
  readonly name?: string | null;
  readonly minYear?: number;
  readonly maxYear?: number;
  readonly eras?: Array<Era> | null;
}
