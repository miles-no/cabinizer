/* eslint-disable */
import { UserModel } from '../models/UserModel';

import { ApiError, catchGenericError } from '../../core/ApiError';
import { request as __request } from '../../core/request';
import { OpenAPI } from './settings';

export class UserService {
  /**
   * @param id
   * @result UserModel Success
   * @throws ApiError
   */
  public static async getUserService(id: string | null): Promise<UserModel> {
    const result = await __request({
      method: 'get',
      path: `/users/${id}`,
      basePath: OpenAPI.BASE,
    });

    if (!result.ok) {
      switch (result.status) {
        case 302:
          throw new ApiError(result, `Redirect`);
        case 404:
          throw new ApiError(result, `Not Found`);
      }
    }

    catchGenericError(result);

    return result.body;
  }

  /**
   * @param orgUnitPath
   * @param page
   * @param size
   * @result UserModel Success
   * @throws ApiError
   */
  public static async getUserService1(
    orgUnitPath?: string | null,
    page?: number | null,
    size?: number | null,
  ): Promise<Array<UserModel>> {
    const result = await __request({
      method: 'get',
      path: `/users`,
      query: {
        OrgUnitPath: orgUnitPath,
        Page: page,
        Size: size,
      },
      basePath: OpenAPI.BASE,
    });

    catchGenericError(result);

    return result.body;
  }

  /**
   * @param id
   * @param size
   * @result any
   * @throws ApiError
   */
  public static async getUserService2(
    id: string | null,
    size?: number | null,
  ): Promise<any> {
    const result = await __request({
      method: 'get',
      path: `/users/${id}/picture`,
      query: {
        size: size,
      },
      basePath: OpenAPI.BASE,
    });

    if (!result.ok) {
      switch (result.status) {
        case 302:
          throw new ApiError(result, `Redirect`);
        case 404:
          throw new ApiError(result, `Not Found`);
      }
    }

    catchGenericError(result);

    return result.body;
  }
}
