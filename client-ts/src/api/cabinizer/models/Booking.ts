/* eslint-disable */

import { Instant } from './Instant';
import { Item } from './Item';
import { LocalDateTime } from './LocalDateTime';
import { Raffle } from './Raffle';

export interface Booking {
  id?: string;
  createdAt?: Instant;
  updatedAt?: Instant;
  createdBy?: string | null;
  updatedBy?: string | null;
  name?: string | null;
  itemId?: string;
  item?: Item;
  raffleId?: string;
  raffle?: Raffle;
  startTime?: LocalDateTime;
  endTime?: LocalDateTime;
}
