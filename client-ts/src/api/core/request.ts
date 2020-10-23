import shortId from 'shortid';
import { getFormData } from './getFormData';
import { getQueryString } from './getQueryString';
import { RequestOptions } from './RequestOptions';
import { requestUsingXHR } from './requestUsingXHR';
import { Result } from './Result';

/**
 * Create the request.
 * @param options Request method options.
 * @returns Result object (see above)
 */
export async function request(
  options: Readonly<RequestOptions>,
): Promise<Result> {
  // Escape path (RFC3986) and create the request URL
  const path = options.path.replace(/[:]/g, '_');
  let url = `${options.basePath}${path}`;

  // Create request headers
  const headers = new Headers({
    ...options.headers,
    Accept: options.accept || 'application/json',
  });

  // Create request settings
  const req: RequestInit = {
    headers,
    method: options.method,
  };

  // If we specified to send requests with credentials, then we
  // set the request credentials options to include. This is only
  // needed if you make cross-origin calls.
  req.credentials = 'include';

  // Get token from local storage
  const token = window.localStorage.getItem('cabinizer.token');

  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  // Add the query parameters (if defined).
  if (options.query) {
    url += getQueryString(options.query);
  }

  // Append formData as body
  if (options.formData) {
    req.body = getFormData(options.formData);
  } else if (options.body) {
    // If this is blob data, then pass it directly to the body and set content type.
    // Otherwise we just convert request data to JSON string (needed for fetch api)
    if (options.body instanceof Blob) {
      req.body = options.body;
      if (options.body.type) {
        headers.append('Content-Type', options.body.type);
      }
    } else {
      req.body = JSON.stringify(options.body);
      headers.append('Content-Type', 'application/json');
    }
  }

  try {
    return await requestUsingXHR(
      url,
      req,
      options.responseHeader,
      options.responseType,
    );
  } catch (error) {
    return {
      url,
      ok: false,
      status: 0,
      statusText: '',
      body: error,
    };
  }
}
