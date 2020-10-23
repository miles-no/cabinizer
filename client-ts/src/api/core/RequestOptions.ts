/* eslint-disable */
import { ContentType } from './ContentType';

export interface RequestOptions {
  method: 'get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch';
  path: string;
  cookies?: { [key: string]: any };
  headers?: { [key: string]: any };
  query?: { [key: string]: any };
  formData?: { [key: string]: any };
  body?: any;
  responseHeader?: string;
  basePath: string;
  responseType?: XMLHttpRequestResponseType | undefined;
  accept?: ContentType;
}
