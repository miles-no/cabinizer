import * as Handlebars from "handlebars/runtime";

export function registerHandlebarHelpers(): void {
  Handlebars.registerHelper("equals", function (
    a: string,
    b: string,
    options: Handlebars.HelperOptions
  ): string {
    // @ts-ignore
    return a === b ? options.fn(this) : options.inverse(this);
  });
  Handlebars.registerHelper("notEquals", function (
    a: string,
    b: string,
    options: Handlebars.HelperOptions
  ): string {
    // @ts-ignore
    return a !== b ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper("interpolation", function (
    a: string,
    b: string
  ): string {
    const env = `${b}apiurl`.toUpperCase();
    const ret = "`${" + `${a}.${env}` + "}`";
    return ret;
  });
}
