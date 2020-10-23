/* eslint-disable */
import { Item } from '../models/Item';

import { catchGenericError } from '../../core/ApiError';
import { request as __request } from '../../core/request';
import { OpenAPI } from './settings';

export class ItemService {
  /**
   * @result Item Success
   * @throws ApiError
   */
  public static async getItemService(): Promise<Array<Item>> {
    const result = await __request({
      method: 'get',
      path: `/items`,
      basePath: OpenAPI.BASE,
    });

    catchGenericError(result);

    return result.body;
  }
}
