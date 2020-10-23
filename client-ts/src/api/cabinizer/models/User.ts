/* eslint-disable */

import { Instant } from './Instant';
import { Item } from './Item';
import { OrganizationUnit } from './OrganizationUnit';

export interface User {
  id?: string | null;
  createdAt?: Instant;
  updatedAt?: Instant;
  createdBy?: string | null;
  updatedBy?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  cloudinaryPublicId?: string | null;
  organizationUnitPath?: string | null;
  organizationUnit?: OrganizationUnit;
  readonly items?: Array<Item> | null;
}
