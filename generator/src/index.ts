import { parse } from "./openApi/v3";
import { getOpenApiSpec } from "./utils/getOpenApiSpec";
import { isString } from "./utils/isString";
import { postProcessClient } from "./utils/postProcessClient";
import { registerHandlebarTemplates } from "./utils/registerHandlebarTemplates";
import { writeClient } from "./utils/writeClient";

export enum HttpClient {
  FETCH = "fetch",
  XHR = "xhr",
}

export interface Options {
  envName: string;
  input: string | Record<string, any>;
  output: string;
  httpClient?: HttpClient;
  useOptions?: boolean;
  useUnionTypes?: boolean;
  exportCore?: boolean;
  exportServices?: boolean;
  exportModels?: boolean;
  exportSchemas?: boolean;
  write?: boolean;
}

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec.
 * @param output The relative location of the output directory.
 * @param httpClient The selected httpClient (fetch or XHR).
 * @param useOptions Use options or arguments functions.
 * @param useUnionTypes Use inclusive union types.
 * @param exportCore: Generate core client classes.
 * @param exportServices: Generate services.
 * @param exportModels: Generate models.
 * @param exportSchemas: Generate schemas.
 * @param write Write the files to disk (true or false).
 */
export async function generate({
  envName,
  input,
  output,
  httpClient = HttpClient.XHR,
  useOptions = false,
  useUnionTypes = false,
  exportCore = true,
  exportServices = true,
  exportModels = true,
  exportSchemas = true,
  write = true,
}: Options): Promise<void> {
  // Load the specification, read the OpenAPI version and load the
  // handlebar templates for the given language
  if (!envName) throw "No env name was provided, unable to continue";
  const openApi = isString(input) ? await getOpenApiSpec(input) : input;
  const templates = registerHandlebarTemplates();
  const client = parse(openApi);
  const clientFinal = postProcessClient(client, useUnionTypes);
  if (write) {
    await writeClient(
      envName,
      clientFinal,
      templates,
      output,
      httpClient,
      useOptions,
      exportCore,
      exportServices,
      exportModels,
      exportSchemas
    );
  }
}
