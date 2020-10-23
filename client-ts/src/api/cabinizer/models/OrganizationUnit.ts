/* eslint-disable */

export interface OrganizationUnit {
  path?: string | null;
  name?: string | null;
  parentPath?: string | null;
  readonly children?: Array<OrganizationUnit> | null;
}
