/* eslint-disable */

import { Booking } from './Booking';
import { Instant } from './Instant';
import { Item } from './Item';

export interface Raffle {
  id?: string;
  createdAt?: Instant;
  updatedAt?: Instant;
  createdBy?: string | null;
  updatedBy?: string | null;
  name?: string | null;
  itemId?: string;
  item?: Item;
  readonly bookings?: Array<Booking> | null;
}
