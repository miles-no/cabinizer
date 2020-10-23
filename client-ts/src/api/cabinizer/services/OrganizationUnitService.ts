/* eslint-disable */
import { OrganizationUnit } from '../models/OrganizationUnit';

import { catchGenericError } from '../../core/ApiError';
import { request as __request } from '../../core/request';
import { OpenAPI } from './settings';

export class OrganizationUnitService {
  /**
   * @result OrganizationUnit Success
   * @throws ApiError
   */
  public static async getOrganizationUnitService(): Promise<
    Array<OrganizationUnit>
  > {
    const result = await __request({
      method: 'get',
      path: `/orgunits`,
      basePath: OpenAPI.BASE,
    });

    catchGenericError(result);

    return result.body;
  }
}
