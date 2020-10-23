/* eslint-disable */

import { Booking } from './Booking';
import { Instant } from './Instant';
import { OrganizationUnit } from './OrganizationUnit';
import { User } from './User';

export interface Item {
  id?: string;
  createdAt?: Instant;
  updatedAt?: Instant;
  createdBy?: string | null;
  updatedBy?: string | null;
  name?: string | null;
  adminUserId?: string | null;
  adminUser?: User;
  organizationUnitPath?: string | null;
  organizationUnit?: OrganizationUnit;
  readonly bookings?: Array<Booking> | null;
}
