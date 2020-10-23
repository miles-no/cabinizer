"use strict";
function e(e) {
  return e && "object" == typeof e && "default" in e ? e.default : e;
}
Object.defineProperty(exports, "__esModule", { value: !0 });
var n,
  t = require("os"),
  r = e(require("camelcase")),
  a = require("js-yaml"),
  l = require("path"),
  o = e(l),
  i = require("fs"),
  s = require("mkdirp"),
  u = e(require("rimraf")),
  c = require("util"),
  p = e(require("http")),
  m = e(require("https")),
  f = require("handlebars/runtime");
!(function (e) {
  (e.FILE = "File"),
    (e.OBJECT = "any"),
    (e.ARRAY = "any[]"),
    (e.BOOLEAN = "boolean"),
    (e.NUMBER = "number"),
    (e.STRING = "string"),
    (e.VOID = "void"),
    (e.NULL = "null"),
    (e.DATE = "Date");
})(n || (n = {}));
const d = new Map([
  ["file", n.FILE],
  ["any", n.OBJECT],
  ["object", n.OBJECT],
  ["array", n.ARRAY],
  ["boolean", n.BOOLEAN],
  ["byte", n.NUMBER],
  ["int", n.NUMBER],
  ["int32", n.NUMBER],
  ["int64", n.NUMBER],
  ["integer", n.NUMBER],
  ["float", n.NUMBER],
  ["double", n.NUMBER],
  ["short", n.NUMBER],
  ["long", n.NUMBER],
  ["number", n.NUMBER],
  ["char", n.STRING],
  ["date", n.DATE],
  ["date-time", n.DATE],
  ["password", n.STRING],
  ["string", n.STRING],
  ["void", n.VOID],
  ["null", n.NULL],
]);
var h, y;
!(function (e) {
  (e.GET = "get"),
    (e.PUT = "put"),
    (e.POST = "post"),
    (e.DELETE = "delete"),
    (e.OPTIONS = "options"),
    (e.HEAD = "head"),
    (e.PATCH = "patch");
})(h || (h = {})),
  (function (e) {
    (e.APPLICATION_JSON_PATCH = "application/json-patch+json"),
      (e.APPLICATION_JSON = "application/json"),
      (e.TEXT_JSON = "text/json"),
      (e.TEXT_PAIN = "text/plain"),
      (e.MULTIPART_MIXED = "multipart/mixed"),
      (e.MULTIPART_RELATED = "multipart/related"),
      (e.MULTIPART_BATCH = "multipart/batch"),
      (e.OCTET_STREAM = "application/octet-stream");
  })(y || (y = {}));
function v(e) {
  return e ? e.replace(/\r?\n(.*)/g, (e, n) => `${t.EOL} * ${n.trim()}`) : null;
}
function P(e) {
  return null != e && "" !== e;
}
function O(e, n) {
  if (void 0 === e.default) return;
  if (null === e.default) return "null";
  switch (e.type || typeof e.default) {
    case "int":
    case "integer":
    case "number":
      return n && "enum" == n.export && n.enum.length && n.enum[e.default]
        ? n.enum[e.default].value
        : e.default;
    case "boolean":
      return JSON.stringify(e.default);
    case "string":
      return `'${e.default}'`;
    case "object":
      try {
        return JSON.stringify(e.default, null, 4);
      } catch (e) {}
  }
}
function b(e, t) {
  const r = { type: n.OBJECT, base: n.OBJECT, template: null, imports: [] },
    a = (function (e) {
      return e
        .trim()
        .replace(/^#\/components\/schemas\//, "")
        .replace(/^#\/components\/responses\//, "")
        .replace(/^#\/components\/parameters\//, "")
        .replace(/^#\/components\/examples\//, "")
        .replace(/^#\/components\/requestBodies\//, "")
        .replace(/^#\/components\/headers\//, "")
        .replace(/^#\/components\/securitySchemes\//, "")
        .replace(/^#\/components\/links\//, "")
        .replace(/^#\/components\/callbacks\//, "")
        .replace(
          /(\[.*\]$)/,
          (e) => `[${e.replace("[", "").replace("]", "").split(".").pop()}]`
        )
        .replace(/.*/, (e) => e.split(".").pop());
    })(e || "");
  if (/\[.*\]$/g.test(a)) {
    const e = a.match(/(.*?)\[(.*)\]$/);
    if (e && e.length) {
      const t = b(e[1]),
        a = b(e[2]);
      t.type === n.ARRAY
        ? ((r.type = a.type + "[]"), (r.base = "" + a.type), (t.imports = []))
        : a.type
        ? ((r.type = `${t.type}<${a.type}>`),
          (r.base = t.type),
          (r.template = a.type))
        : ((r.type = t.type), (r.base = t.type), (r.template = t.type)),
        r.imports.push(...t.imports),
        r.imports.push(...a.imports);
    }
  } else if (((l = a), d.has(l.toLowerCase()))) {
    const e = (function (e) {
      const n = d.get(e.toLowerCase());
      return n || e;
    })(a);
    (r.type = e), (r.base = e);
  } else a && ((r.type = a), (r.base = a), r.imports.push(a));
  var l;
  return r.type === t && ((r.type = "T"), (r.base = "T"), (r.imports = [])), r;
}
function x(e, n, t) {
  const r = [];
  for (const a in n.properties)
    if (n.properties.hasOwnProperty(a)) {
      const l = n.properties[a],
        o = n.required && n.required.includes(a);
      if (l.$ref) {
        const e = b(l.$ref);
        r.push({
          name: a,
          export: "reference",
          type: e.type,
          base: e.base,
          template: e.template,
          link: null,
          description: v(l.description),
          isDefinition: !1,
          isReadOnly: !0 === l.readOnly,
          isRequired: !0 === o,
          isNullable: !0 === l.nullable,
          format: l.format,
          maximum: l.maximum,
          exclusiveMaximum: l.exclusiveMaximum,
          minimum: l.minimum,
          exclusiveMinimum: l.exclusiveMinimum,
          multipleOf: l.multipleOf,
          maxLength: l.maxLength,
          minLength: l.minLength,
          pattern: l.pattern,
          maxItems: l.maxItems,
          minItems: l.minItems,
          uniqueItems: l.uniqueItems,
          maxProperties: l.maxProperties,
          minProperties: l.minProperties,
          imports: e.imports,
          extends: [],
          enum: [],
          enums: [],
          properties: [],
        });
      } else {
        const n = t(e, l);
        r.push({
          name: a,
          export: n.export,
          type: n.type,
          base: n.base,
          template: n.template,
          link: n.link,
          description: v(l.description),
          isDefinition: !1,
          isReadOnly: !0 === l.readOnly,
          isRequired: !0 === o,
          isNullable: !0 === l.nullable,
          format: l.format,
          maximum: l.maximum,
          exclusiveMaximum: l.exclusiveMaximum,
          minimum: l.minimum,
          exclusiveMinimum: l.exclusiveMinimum,
          multipleOf: l.multipleOf,
          maxLength: l.maxLength,
          minLength: l.minLength,
          pattern: l.pattern,
          maxItems: l.maxItems,
          minItems: l.minItems,
          uniqueItems: l.uniqueItems,
          maxProperties: l.maxProperties,
          minProperties: l.minProperties,
          imports: n.imports,
          extends: n.extends,
          enum: n.enum,
          enums: n.enums,
          properties: n.properties,
        });
      }
    }
  return r;
}
function g(e, t, r = !1, a = "") {
  const l = {
    name: a,
    export: "interface",
    type: n.OBJECT,
    base: n.OBJECT,
    template: null,
    link: null,
    format: t.format,
    description: v(t.description),
    isDefinition: r,
    isReadOnly: !0 === t.readOnly,
    isNullable: !0 === t.nullable,
    isRequired: !1,
    imports: [],
    extends: [],
    enum: [],
    enums: [],
    properties: [],
  };
  if (t.$ref) {
    const e = b(t.$ref);
    return (
      (l.export = "reference"),
      (l.type = e.type),
      (l.base = e.base),
      (l.template = e.template),
      l.imports.push(...e.imports),
      (l.default = O(t, l)),
      l
    );
  }
  if (t.enum) {
    const e = (function (e, n) {
      const t = n["x-enum-varnames"],
        r = n["x-enum-descriptions"],
        a = n["x-enumNames"];
      return e.map((e, n) => ({
        name: (t && t[n]) || (a && a[n]) || e.name,
        description: (r && r[n]) || e.description,
        value: e.value,
        type: e.type,
      }));
    })(
      ((o = t.enum),
      Array.isArray(o)
        ? o
            .filter((e, n, t) => t.indexOf(e) === n)
            .filter(P)
            .map((e) =>
              "number" == typeof e
                ? {
                    name: "_" + e,
                    value: String(e),
                    type: n.NUMBER,
                    description: null,
                  }
                : {
                    name: e
                      .replace(/\W+/g, "_")
                      .replace(/^(\d+)/g, "_$1")
                      .replace(/([a-z])([A-Z]+)/g, "$1_$2")
                      .toUpperCase(),
                    value: `'${e}'`,
                    type: n.STRING,
                    description: null,
                  }
            )
        : []),
      t
    );
    if (e.length)
      return (
        (l.export = "enum"),
        (l.type = n.STRING),
        (l.base = n.STRING),
        l.enum.push(...e),
        (l.default = O(t, l)),
        l
      );
  }
  var o;
  if (("int" === t.type || "integer" === t.type) && t.description) {
    const e = (function (e) {
      if (/^(\w+=[0-9]+,?)+$/g.test(e)) {
        const t = e.match(/(\w+=[0-9]+,?)/g);
        if (t) {
          const e = [];
          return (
            t.forEach((t) => {
              const r = t.split("=")[0],
                a = parseInt(t.split("=")[1].replace(/[^0-9]/g, ""));
              r &&
                Number.isInteger(a) &&
                e.push({
                  name: r
                    .replace(/\W+/g, "_")
                    .replace(/^(\d+)/g, "_$1")
                    .replace(/([a-z])([A-Z]+)/g, "$1_$2")
                    .toUpperCase(),
                  value: String(a),
                  type: n.NUMBER,
                  description: null,
                });
            }),
            e.filter((e, n, t) => t.map((e) => e.name).indexOf(e.name) === n)
          );
        }
      }
      return [];
    })(t.description);
    if (e.length)
      return (
        (l.export = "enum"),
        (l.type = n.NUMBER),
        (l.base = n.NUMBER),
        l.enum.push(...e),
        (l.default = O(t, l)),
        l
      );
  }
  if ("array" === t.type && t.items) {
    if (t.items.$ref) {
      const e = b(t.items.$ref);
      return (
        (l.export = "array"),
        (l.type = e.type),
        (l.base = e.base),
        (l.template = e.template),
        l.imports.push(...e.imports),
        (l.default = O(t, l)),
        l
      );
    }
    {
      const n = g(e, t.items);
      return (
        (l.export = "array"),
        (l.type = n.type),
        (l.base = n.base),
        (l.template = n.template),
        (l.link = n),
        l.imports.push(...n.imports),
        (l.default = O(t, l)),
        l
      );
    }
  }
  if (
    "object" === t.type &&
    t.additionalProperties &&
    "object" == typeof t.additionalProperties
  ) {
    if (t.additionalProperties.$ref) {
      const e = b(t.additionalProperties.$ref);
      return (
        (l.export = "dictionary"),
        (l.type = e.type),
        (l.base = e.base),
        (l.template = e.template),
        l.imports.push(...e.imports),
        l.imports.push("Dictionary"),
        (l.default = O(t, l)),
        l
      );
    }
    {
      const n = g(e, t.additionalProperties);
      return (
        (l.export = "dictionary"),
        (l.type = n.type),
        (l.base = n.base),
        (l.template = n.template),
        (l.link = n),
        l.imports.push(...n.imports),
        l.imports.push("Dictionary"),
        (l.default = O(t, l)),
        l
      );
    }
  }
  if (t.anyOf && t.anyOf.length && !t.properties) {
    l.export = "generic";
    const e = t.anyOf.filter((e) => e.$ref).map((e) => b(e.$ref)),
      n = e
        .map((e) => e.type)
        .sort()
        .join(" | ");
    return (
      l.imports.push(...e.map((e) => e.base)), (l.type = n), (l.base = n), l
    );
  }
  if (t.oneOf && t.oneOf.length && !t.properties) {
    l.export = "generic";
    const e = t.oneOf.filter((e) => e.$ref).map((e) => b(e.$ref)),
      n = e
        .map((e) => e.type)
        .sort()
        .join(" | ");
    return (
      l.imports.push(...e.map((e) => e.base)), (l.type = n), (l.base = n), l
    );
  }
  if ("object" === t.type || t.allOf) {
    if (
      ((l.export = "interface"),
      (l.type = n.OBJECT),
      (l.base = n.OBJECT),
      (l.default = O(t, l)),
      t.allOf &&
        t.allOf.length &&
        t.allOf.forEach((n) => {
          if (n.$ref) {
            const e = b(n.$ref);
            l.extends.push(e.base), l.imports.push(e.base);
          }
          if ("object" === n.type && n.properties) {
            x(e, n, g).forEach((e) => {
              l.properties.push(e),
                l.imports.push(...e.imports),
                "enum" === e.export && l.enums.push(e);
            });
          }
        }),
      t.properties)
    ) {
      x(e, t, g).forEach((e) => {
        l.properties.push(e),
          l.imports.push(...e.imports),
          "enum" === e.export && l.enums.push(e);
      });
    }
    return l;
  }
  if (t.type) {
    const e = b(t.type);
    return (
      (l.export = "generic"),
      (l.type = e.type),
      (l.base = e.base),
      (l.template = e.template),
      l.imports.push(...e.imports),
      (l.default = O(t, l)),
      l.type !== n.STRING ||
        ("date-time" !== l.format && "date" !== l.format) ||
        ((l.type = n.DATE), (l.base = n.DATE)),
      l
    );
  }
  return l;
}
function w(e) {
  const n = e.replace(/[^\w\s\-]+/g, "-").trim();
  return r(n);
}
function k(e, n) {
  if (n.$ref) {
    const t = n.$ref
      .replace(/^#/g, "")
      .split("/")
      .filter((e) => e);
    let r = e;
    return (
      t.forEach((e) => {
        if (!r.hasOwnProperty(e))
          throw new Error(`Could not find reference: "${n.$ref}"`);
        r = r[e];
      }),
      r
    );
  }
  return n;
}
function C(e, n) {
  const t = e.isRequired && void 0 === e.default,
    r = n.isRequired && void 0 === n.default;
  return t && !r ? -1 : !t && r ? 1 : 0;
}
function j(e, t) {
  const r = {
    imports: [],
    parameters: [],
    parametersPath: [],
    parametersQuery: [],
    parametersForm: [],
    parametersCookie: [],
    parametersHeader: [],
    parametersBody: null,
  };
  return (
    t.forEach((t) => {
      const a = k(e, t),
        l = (function (e, t) {
          const r = {
            in: t.in,
            prop: t.name,
            export: "interface",
            name: w(t.name),
            type: n.OBJECT,
            base: n.OBJECT,
            template: null,
            link: null,
            description: v(t.description),
            isDefinition: !1,
            isReadOnly: !1,
            isRequired: !0 === t.required,
            isNullable: !0 === t.nullable,
            imports: [],
            extends: [],
            enum: [],
            enums: [],
            properties: [],
          };
          if (t.$ref) {
            const e = b(t.$ref);
            return (
              (r.export = "reference"),
              (r.type = e.type),
              (r.base = e.base),
              (r.template = e.template),
              r.imports.push(...e.imports),
              r
            );
          }
          if (t.schema) {
            if (t.schema.$ref) {
              const e = b(t.schema.$ref);
              return (
                (r.export = "reference"),
                (r.type = e.type),
                (r.base = e.base),
                (r.template = e.template),
                r.imports.push(...e.imports),
                (r.default = O(t.schema)),
                r
              );
            }
            {
              const n = g(e, t.schema);
              return (
                (r.export = n.export),
                (r.type = n.type),
                (r.base = n.base),
                (r.template = n.template),
                (r.link = n.link),
                (r.isReadOnly = n.isReadOnly),
                (r.isRequired = r.isRequired || n.isRequired),
                (r.isNullable = r.isNullable || n.isNullable),
                (r.format = n.format),
                (r.maximum = n.maximum),
                (r.exclusiveMaximum = n.exclusiveMaximum),
                (r.minimum = n.minimum),
                (r.exclusiveMinimum = n.exclusiveMinimum),
                (r.multipleOf = n.multipleOf),
                (r.maxLength = n.maxLength),
                (r.minLength = n.minLength),
                (r.pattern = n.pattern),
                (r.maxItems = n.maxItems),
                (r.minItems = n.minItems),
                (r.uniqueItems = n.uniqueItems),
                (r.maxProperties = n.maxProperties),
                (r.minProperties = n.minProperties),
                (r.default = n.default),
                r.imports.push(...n.imports),
                r.extends.push(...n.extends),
                r.enum.push(...n.enum),
                r.enums.push(...n.enums),
                r.properties.push(...n.properties),
                r
              );
            }
          }
          return r;
        })(e, a);
      if ("api-version" !== l.prop)
        switch (a.in) {
          case "path":
            r.parametersPath.push(l),
              r.parameters.push(l),
              r.imports.push(...l.imports);
            break;
          case "query":
            r.parametersQuery.push(l),
              r.parameters.push(l),
              r.imports.push(...l.imports);
            break;
          case "formData":
            r.parametersForm.push(l),
              r.parameters.push(l),
              r.imports.push(...l.imports);
            break;
          case "cookie":
            r.parametersCookie.push(l),
              r.parameters.push(l),
              r.imports.push(...l.imports);
            break;
          case "header":
            r.parametersHeader.push(l),
              r.parameters.push(l),
              r.imports.push(...l.imports);
        }
    }),
    (r.parameters = r.parameters.sort(C)),
    (r.parametersPath = r.parametersPath.sort(C)),
    (r.parametersQuery = r.parametersQuery.sort(C)),
    (r.parametersForm = r.parametersForm.sort(C)),
    (r.parametersCookie = r.parametersCookie.sort(C)),
    (r.parametersHeader = r.parametersHeader.sort(C)),
    r
  );
}
function E(e, n) {
  return (
    (n[y.OCTET_STREAM] && n[y.OCTET_STREAM].schema) ||
    (n[y.APPLICATION_JSON_PATCH] && n[y.APPLICATION_JSON_PATCH].schema) ||
    (n[y.APPLICATION_JSON] && n[y.APPLICATION_JSON].schema) ||
    (n[y.TEXT_JSON] && n[y.TEXT_JSON].schema) ||
    (n[y.TEXT_PAIN] && n[y.TEXT_PAIN].schema) ||
    (n[y.MULTIPART_MIXED] && n[y.MULTIPART_MIXED].schema) ||
    (n[y.MULTIPART_RELATED] && n[y.MULTIPART_RELATED].schema) ||
    (n[y.MULTIPART_BATCH] && n[y.MULTIPART_BATCH].schema) ||
    null
  );
}
function R(e, t, r) {
  const a = {
    in: "response",
    name: "",
    code: r,
    description: v(t.description),
    export: "generic",
    type: n.OBJECT,
    base: n.OBJECT,
    template: null,
    link: null,
    isDefinition: !1,
    isReadOnly: !1,
    isRequired: !1,
    isNullable: !1,
    imports: [],
    extends: [],
    enum: [],
    enums: [],
    properties: [],
  };
  if (t.headers)
    for (const e in t.headers)
      if (t.headers.hasOwnProperty(e))
        return (
          (a.in = "header"),
          (a.name = e),
          (a.type = n.STRING),
          (a.base = n.STRING),
          a
        );
  if (t.content) {
    const n = E(0, t.content);
    if (n) {
      if (n && n.$ref) {
        const e = b(n.$ref);
        return (
          (a.export = "reference"),
          (a.type = e.type),
          (a.base = e.base),
          (a.template = e.template),
          a.imports.push(...e.imports),
          a
        );
      }
      {
        const t = g(e, n);
        return (
          (a.export = t.export),
          (a.type = t.type),
          (a.base = t.base),
          (a.template = t.template),
          (a.link = t.link),
          (a.isReadOnly = t.isReadOnly),
          (a.isRequired = t.isRequired),
          (a.isNullable = t.isNullable),
          (a.format = t.format),
          (a.maximum = t.maximum),
          (a.exclusiveMaximum = t.exclusiveMaximum),
          (a.minimum = t.minimum),
          (a.exclusiveMinimum = t.exclusiveMinimum),
          (a.multipleOf = t.multipleOf),
          (a.maxLength = t.maxLength),
          (a.minLength = t.minLength),
          (a.pattern = t.pattern),
          (a.maxItems = t.maxItems),
          (a.minItems = t.minItems),
          (a.uniqueItems = t.uniqueItems),
          (a.maxProperties = t.maxProperties),
          (a.minProperties = t.minProperties),
          a.imports.push(...t.imports),
          a.extends.push(...t.extends),
          a.enum.push(...t.enum),
          a.enums.push(...t.enums),
          a.properties.push(...t.properties),
          a
        );
      }
    }
  }
  return a;
}
function T(e) {
  if ("default" === e) return 200;
  if (/[0-9]+/g.test(e)) {
    const n = parseInt(e);
    if (Number.isInteger(n)) return Math.abs(n);
  }
  return null;
}
function q(e) {
  const t = [];
  return (
    e.forEach((e) => {
      e.code && e.code >= 200 && e.code < 300 && t.push(e);
    }),
    t.length ||
      t.push({
        in: "response",
        name: "",
        code: 200,
        description: "",
        export: "interface",
        type: n.OBJECT,
        base: n.OBJECT,
        template: null,
        link: null,
        isDefinition: !1,
        isReadOnly: !1,
        isRequired: !1,
        isNullable: !1,
        imports: [],
        extends: [],
        enum: [],
        enums: [],
        properties: [],
      }),
    t.filter(
      (e, n, t) =>
        t.findIndex((n) =>
          (function e(n, t) {
            const r =
              n.type === t.type &&
              n.base === t.base &&
              n.template === t.template;
            return r && n.link && t.link ? e(n.link, t.link) : r;
          })(n, e)
        ) === n
    )
  );
}
function I(e, t, a, l) {
  const o = (function (e) {
      const n = e.replace(/[^\w\s\-]+/g, "-").trim(),
        t = r(n, { pascalCase: !0 });
      return t && !t.endsWith("Service") ? t + "Service" : t;
    })((l.tags && l.tags[0]) || "Service"),
    i = `${a}${o}`,
    s = (function (e) {
      const n = e.replace(/[^\w\s\-]+/g, "-").trim();
      return r(n);
    })(l.operationId || i),
    u = (function (e) {
      return e
        .replace(/\{(.*?)\}/g, (e, n) => `\${${w(n)}}`)
        .replace("${apiVersion}", "${OpenAPI.VERSION}");
    })(t),
    c = {
      service: o,
      name: s,
      summary: v(l.summary),
      description: v(l.description),
      isBinary: !1,
      deprecated: !0 === l.deprecated,
      method: a,
      path: u,
      parameters: [],
      parametersPath: [],
      parametersQuery: [],
      parametersForm: [],
      parametersHeader: [],
      parametersCookie: [],
      parametersBody: null,
      imports: [],
      errors: [],
      results: [],
      responseHeader: null,
    };
  if (l.parameters) {
    const n = j(e, l.parameters);
    c.imports.push(...n.imports),
      c.parameters.push(...n.parameters),
      c.parametersPath.push(...n.parametersPath),
      c.parametersQuery.push(...n.parametersQuery),
      c.parametersForm.push(...n.parametersForm),
      c.parametersHeader.push(...n.parametersHeader),
      c.parametersCookie.push(...n.parametersCookie),
      (c.parametersBody = n.parametersBody);
  }
  if (l.requestBody) {
    const t = (function (e, t) {
      const r = {
        in: "body",
        prop: "body",
        export: "interface",
        name: "requestBody",
        type: n.OBJECT,
        base: n.OBJECT,
        template: null,
        link: null,
        description: v(t.description),
        default: void 0,
        isDefinition: !1,
        isReadOnly: !1,
        isRequired: !0 === t.required,
        isNullable: !0 === t.nullable,
        imports: [],
        extends: [],
        enum: [],
        enums: [],
        properties: [],
      };
      if (t.content) {
        const n = E(0, t.content);
        if (n) {
          if (n && n.$ref) {
            const e = b(n.$ref);
            return (
              (r.export = "reference"),
              (r.type = e.type),
              (r.base = e.base),
              (r.template = e.template),
              r.imports.push(...e.imports),
              r
            );
          }
          {
            const t = g(e, n);
            return (
              (r.export = t.export),
              (r.type = t.type),
              (r.base = t.base),
              (r.template = t.template),
              (r.link = t.link),
              (r.isReadOnly = t.isReadOnly),
              (r.isRequired = r.isRequired || t.isRequired),
              (r.isNullable = r.isNullable || t.isNullable),
              (r.format = t.format),
              (r.maximum = t.maximum),
              (r.exclusiveMaximum = t.exclusiveMaximum),
              (r.minimum = t.minimum),
              (r.exclusiveMinimum = t.exclusiveMinimum),
              (r.multipleOf = t.multipleOf),
              (r.maxLength = t.maxLength),
              (r.minLength = t.minLength),
              (r.pattern = t.pattern),
              (r.maxItems = t.maxItems),
              (r.minItems = t.minItems),
              (r.uniqueItems = t.uniqueItems),
              (r.maxProperties = t.maxProperties),
              (r.minProperties = t.minProperties),
              r.imports.push(...t.imports),
              r.extends.push(...t.extends),
              r.enum.push(...t.enum),
              r.enums.push(...t.enums),
              r.properties.push(...t.properties),
              r
            );
          }
        }
      }
      return r;
    })(e, l.requestBody);
    c.imports.push(...t.imports),
      c.parameters.push(t),
      (c.parameters = c.parameters.sort(C)),
      (c.parametersBody = t);
  }
  if (l.responses) {
    const n = (function (e, n) {
        const t = [];
        for (const r in n)
          if (n.hasOwnProperty(r)) {
            const a = k(e, n[r]),
              l = T(r);
            l && t.push(R(e, a, l));
          }
        return t.sort((e, n) =>
          e.code < n.code ? -1 : e.code > n.code ? 1 : 0
        );
      })(e, l.responses),
      t = q(n);
    (c.errors = (function (e) {
      return e
        .filter((e) => e.code >= 300 && e.description)
        .map((e) => ({ code: e.code, description: e.description }));
    })(n)),
      (c.responseHeader = (function (e) {
        const n = e.find((e) => "header" === e.in);
        return n ? n.name : null;
      })(t)),
      (c.isBinary = t.filter((e) => "binary" === e.format).length > 0),
      t.forEach((e) => {
        c.results.push(e), c.imports.push(...e.imports);
      });
  }
  return c;
}
function N(e) {
  return {
    version: (function (e = "1.0") {
      return e.replace(/^v/gi, "");
    })(e.info.version),
    server: (function (e) {
      const n = e.servers && e.servers[0],
        t = (n && n.variables) || {};
      let r = (n && n.url) || "";
      for (const e in t)
        t.hasOwnProperty(e) && (r = r.replace(`{${e}}`, t[e].default));
      return r;
    })(e),
    models: (function (e) {
      const n = [];
      if (e.components)
        for (const t in e.components.schemas)
          if (e.components.schemas.hasOwnProperty(t)) {
            const r = g(e, e.components.schemas[t], !0, b(t).base);
            n.push(r);
          }
      return n;
    })(e),
    services: (function (e) {
      const n = new Map();
      for (const t in e.paths)
        if (e.paths.hasOwnProperty(t)) {
          const r = e.paths[t];
          for (const a in r)
            if (r.hasOwnProperty(a))
              switch (a) {
                case h.GET:
                case h.PUT:
                case h.POST:
                case h.DELETE:
                case h.OPTIONS:
                case h.HEAD:
                case h.PATCH:
                  const l = I(e, t, a, r[a]),
                    o = n.get(l.service) || {
                      name: l.service,
                      operations: [],
                      imports: [],
                      importContentType: !1,
                    };
                  l.isBinary && (o.importContentType = !0),
                    o.operations.push(l),
                    o.imports.push(...l.imports),
                    n.set(l.service, o);
              }
        }
      return Array.from(n.values());
    })(e),
  };
}
const A = c.promisify(i.readFile),
  $ = c.promisify(i.writeFile),
  D = c.promisify(i.copyFile),
  L = c.promisify(i.exists),
  M = s;
async function B(e) {
  return e.startsWith("https://")
    ? await (async function (e) {
        return new Promise((n, t) => {
          m.get(e, (r) => {
            let a = "";
            r.on("data", (e) => {
              a += e;
            }),
              r.on("end", () => {
                n(a);
              }),
              r.on("error", () => {
                t(`Could not read OpenApi spec: "${e}"`);
              });
          });
        });
      })(e)
    : e.startsWith("http://")
    ? await (async function (e) {
        return new Promise((n, t) => {
          p.get(e, (r) => {
            let a = "";
            r.on("data", (e) => {
              a += e;
            }),
              r.on("end", () => {
                n(a);
              }),
              r.on("error", () => {
                t(`Could not read OpenApi spec: "${e}"`);
              });
          });
        });
      })(e)
    : await (async function (e) {
        const n = o.resolve(process.cwd(), e);
        if (await L(n))
          try {
            return (await A(n, "utf8")).toString();
          } catch (e) {
            throw new Error(`Could not read OpenApi spec: "${n}"`);
          }
        throw new Error(`Could not find OpenApi spec: "${n}"`);
      })(e);
}
function S(e) {
  return e.enum.filter(
    (e, n, t) => t.findIndex((n) => n.name === e.name) === n
  );
}
function _(e) {
  return e.enums.filter(
    (e, n, t) => t.findIndex((n) => n.name === e.name) === n
  );
}
function H(e, n) {
  const t = e.toLowerCase(),
    r = n.toLowerCase();
  return t.localeCompare(r, "en");
}
function U(e, n, t) {
  return t.indexOf(e) === n;
}
function J(e) {
  return e.imports
    .filter(U)
    .sort(H)
    .filter((n) => e.name !== n);
}
function G(e, n) {
  const t = [];
  return (
    e.map(n).forEach((e) => {
      t.push(...e);
    }),
    t
  );
}
function F(e, n, t) {
  const r = Object.assign({}, e);
  if (t) {
    if (!r.isDefinition) {
      const e = (function e(n, t) {
        const r = t.models.filter((e) =>
          (n.isDefinition ? [n.name] : n.base.split(" | ")).find((n) =>
            e.extends.includes(n)
          )
        );
        return r.length && r.push(...G(r, (n) => e(n, t))), r.filter(U);
      })(r, n).map((e) => e.name);
      (r.base = [r.base, ...e].sort().join(" | ")),
        (r.imports = r.imports.concat(...e));
    }
    (r.properties = r.properties.map((e) => F(e, n, t))),
      r.properties.forEach((e) => {
        r.imports.push(...e.imports);
      }),
      (r.link = r.link ? F(r.link, n, t) : null),
      r.link && r.imports.push(...r.link.imports);
  }
  return r;
}
function X(e, n, t) {
  const r = Object.assign({}, e);
  return (
    (r.operations = (function (e, n, t = !1) {
      const r = new Map();
      return e.operations.map((e) => {
        const a = Object.assign({}, e);
        (a.parameters = a.parameters.map((e) => F(e, n, t))),
          (a.results = a.results.map((e) => F(e, n, t))),
          a.imports.push(...G(a.parameters, (e) => e.imports)),
          a.imports.push(...G(a.results, (e) => e.imports));
        const l = a.name,
          o = r.get(l) || 0;
        return o > 0 && (a.name = `${l}${o}`), r.set(l, o + 1), a;
      });
    })(r, n, t)),
    r.operations.forEach((e) => {
      r.imports.push(...e.imports);
    }),
    (r.imports = (function (e) {
      return e.imports
        .filter(U)
        .sort(H)
        .filter((n) => e.name !== n);
    })(r)),
    r
  );
}
function W(e, n) {
  return Object.assign(Object.assign({}, e), {
    models: e.models.map((t) =>
      (function (e, n, t) {
        const r = F(e, n, t);
        return Object.assign(Object.assign({}, r), {
          imports: J(r),
          enums: _(r),
          enum: S(r),
        });
      })(t, e, n)
    ),
    services: e.services.map((t) => X(t, e, n)),
  });
}
var Q = {
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "interface Config {\n    BASE: string;\n    VERSION: string;\n}\n\nexport const OpenAPI: Config = {\n    BASE: " +
        (null !=
        (l = o(t, "interpolation").call(
          null != n ? n : e.nullContext || {},
          "process.env",
          o(n, "server"),
          {
            name: "interpolation",
            hash: {},
            data: a,
            loc: {
              start: { line: 7, column: 10 },
              end: { line: 7, column: 48 },
            },
          }
        ))
          ? l
          : "") +
        ",\n    VERSION: '" +
        (null !=
        (l = e.lambda(
          e.strict(n, "version", {
            start: { line: 8, column: 17 },
            end: { line: 8, column: 24 },
          }),
          n
        ))
          ? l
          : "") +
        "',\n};"
      );
    },
    useData: !0,
  },
  V = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "imports"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 4, column: 0 }, end: { line: 6, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      var l,
        o = e.lambda;
      return (
        "import { " +
        (null != (l = o(n, n)) ? l : "") +
        " } from './" +
        (null != (l = o(n, n)) ? l : "") +
        "';\n"
      );
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "exportInterface"), n, {
          name: "exportInterface",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "enum",
          {
            name: "equals",
            hash: {},
            fn: e.program(7, a, 0),
            inverse: e.program(9, a, 0),
            data: a,
            loc: {
              start: { line: 11, column: 0 },
              end: { line: 15, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    7: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "exportEnum"), n, {
          name: "exportEnum",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    9: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "exportType"), n, {
          name: "exportType",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "/* eslint-disable */\n\n" +
        (null !=
        (l = i(t, "if").call(o, i(n, "imports"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 3, column: 0 }, end: { line: 7, column: 7 } },
        }))
          ? l
          : "") +
        "\n" +
        (null !=
        (l = i(t, "equals").call(o, i(n, "export"), "interface", {
          name: "equals",
          hash: {},
          fn: e.program(4, a, 0),
          inverse: e.program(6, a, 0),
          data: a,
          loc: { start: { line: 9, column: 0 }, end: { line: 15, column: 11 } },
        }))
          ? l
          : "")
      );
    },
    usePartial: !0,
    useData: !0,
  },
  Y = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "extends"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 3, column: 0 }, end: { line: 5, column: 9 } },
          }
        ))
          ? l
          : "")
      );
    },
    2: function (e, n, t, r, a) {
      var l,
        o = e.lambda;
      return (
        "import { $" +
        (null != (l = o(n, n)) ? l : "") +
        " } from './$" +
        (null != (l = o(n, n)) ? l : "") +
        "';\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "extends"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 6, column: 7 } },
          }
        ))
          ? l
          : "") +
        "\nexport const $" +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 8, column: 17 },
            end: { line: 8, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        " = " +
        (null !=
        (l = e.invokePartial(o(r, "schema"), n, {
          name: "schema",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ";"
      );
    },
    usePartial: !0,
    useData: !0,
  },
  z = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "imports"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 3, column: 0 }, end: { line: 5, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      var l,
        o = e.lambda;
      return (
        "import { " +
        (null != (l = o(n, n)) ? l : "") +
        " } from '../models/" +
        (null != (l = o(n, n)) ? l : "") +
        "';\n"
      );
    },
    4: function (e, n, t, r, a) {
      return "import { ContentType } from '../../core/ContentType'; \n";
    },
    6: function (e, n, t, r, a) {
      return "import { ApiError, catchGenericError } from '../../core/ApiError';\n";
    },
    8: function (e, n, t, r, a) {
      return "import { catchGenericError } from '../../core/ApiError';\n";
    },
    10: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i = e.strict,
        s = e.lambda,
        u =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "    /**\n" +
        (null !=
        (l = u(t, "if").call(o, u(n, "deprecated"), {
          name: "if",
          hash: {},
          fn: e.program(11, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 24, column: 4 },
            end: { line: 26, column: 11 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "summary"), {
          name: "if",
          hash: {},
          fn: e.program(13, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 27, column: 4 },
            end: { line: 29, column: 11 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "description"), {
          name: "if",
          hash: {},
          fn: e.program(15, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 30, column: 4 },
            end: { line: 32, column: 11 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "parameters"), {
          name: "if",
          hash: {},
          fn: e.program(17, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 33, column: 4 },
            end: { line: 37, column: 11 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "each").call(o, u(n, "results"), {
          name: "each",
          hash: {},
          fn: e.program(20, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 38, column: 4 },
            end: { line: 40, column: 13 },
          },
        }))
          ? l
          : "") +
        "     * @throws ApiError\n     */\n    public static async " +
        (null !=
        (l = s(
          i(n, "name", {
            start: { line: 43, column: 27 },
            end: { line: 43, column: 31 },
          }),
          n
        ))
          ? l
          : "") +
        "(" +
        (null !=
        (l = e.invokePartial(u(r, "parameters"), n, {
          name: "parameters",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        "): Promise<" +
        (null !=
        (l = e.invokePartial(u(r, "result"), n, {
          name: "result",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        "> {\n\n        const result = await __request({\n            method: '" +
        (null !=
        (l = s(
          i(n, "method", {
            start: { line: 46, column: 24 },
            end: { line: 46, column: 30 },
          }),
          n
        ))
          ? l
          : "") +
        "',\n            path: `" +
        (null !=
        (l = s(
          i(n, "path", {
            start: { line: 47, column: 22 },
            end: { line: 47, column: 26 },
          }),
          n
        ))
          ? l
          : "") +
        "`,\n" +
        (null !=
        (l = u(t, "if").call(o, u(n, "parametersCookie"), {
          name: "if",
          hash: {},
          fn: e.program(22, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 48, column: 12 },
            end: { line: 54, column: 19 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "parametersHeader"), {
          name: "if",
          hash: {},
          fn: e.program(25, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 55, column: 12 },
            end: { line: 61, column: 19 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "parametersQuery"), {
          name: "if",
          hash: {},
          fn: e.program(27, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 62, column: 12 },
            end: { line: 68, column: 19 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "parametersForm"), {
          name: "if",
          hash: {},
          fn: e.program(29, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 69, column: 12 },
            end: { line: 75, column: 19 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "parametersBody"), {
          name: "if",
          hash: {},
          fn: e.program(31, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 76, column: 12 },
            end: { line: 78, column: 19 },
          },
        }))
          ? l
          : "") +
        (null !=
        (l = u(t, "if").call(o, u(n, "responseHeader"), {
          name: "if",
          hash: {},
          fn: e.program(33, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 79, column: 12 },
            end: { line: 81, column: 19 },
          },
        }))
          ? l
          : "") +
        "            basePath: OpenAPI.BASE,\n" +
        (null !=
        (l = u(t, "if").call(o, u(n, "isBinary"), {
          name: "if",
          hash: {},
          fn: e.program(35, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 83, column: 12 },
            end: { line: 86, column: 19 },
          },
        }))
          ? l
          : "") +
        "            \n        });\n" +
        (null !=
        (l = u(t, "if").call(o, u(n, "errors"), {
          name: "if",
          hash: {},
          fn: e.program(37, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 89, column: 8 },
            end: { line: 98, column: 15 },
          },
        }))
          ? l
          : "") +
        "\n        catchGenericError(result);\n\n        return result.body;\n    }\n\n"
      );
    },
    11: function (e, n, t, r, a) {
      return "     * @deprecated\n";
    },
    13: function (e, n, t, r, a) {
      var l;
      return (
        "     * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "summary", {
            start: { line: 28, column: 10 },
            end: { line: 28, column: 17 },
          }),
          n
        ))
          ? l
          : "") +
        "\n"
      );
    },
    15: function (e, n, t, r, a) {
      var l;
      return (
        "     * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 31, column: 10 },
            end: { line: 31, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        "\n"
      );
    },
    17: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parameters"),
          {
            name: "each",
            hash: {},
            fn: e.program(18, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 34, column: 4 },
              end: { line: 36, column: 13 },
            },
          }
        ))
        ? l
        : "";
    },
    18: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda;
      return (
        "     * @param " +
        (null !=
        (l = i(
          o(n, "name", {
            start: { line: 35, column: 17 },
            end: { line: 35, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        " " +
        (null !=
        (l = i(
          o(n, "description", {
            start: { line: 35, column: 28 },
            end: { line: 35, column: 39 },
          }),
          n
        ))
          ? l
          : "") +
        "\n"
      );
    },
    20: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda;
      return (
        "     * @result " +
        (null !=
        (l = i(
          o(n, "type", {
            start: { line: 39, column: 18 },
            end: { line: 39, column: 22 },
          }),
          n
        ))
          ? l
          : "") +
        " " +
        (null !=
        (l = i(
          o(n, "description", {
            start: { line: 39, column: 29 },
            end: { line: 39, column: 40 },
          }),
          n
        ))
          ? l
          : "") +
        "\n"
      );
    },
    22: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "cookies: {\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parametersCookie"),
          {
            name: "each",
            hash: {},
            fn: e.program(23, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 50, column: 16 },
              end: { line: 52, column: 25 },
            },
          }
        ))
          ? l
          : "") +
        "            },\n"
      );
    },
    23: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda;
      return (
        "                '" +
        (null !=
        (l = i(
          o(n, "prop", {
            start: { line: 51, column: 20 },
            end: { line: 51, column: 24 },
          }),
          n
        ))
          ? l
          : "") +
        "': " +
        (null !=
        (l = i(
          o(n, "name", {
            start: { line: 51, column: 33 },
            end: { line: 51, column: 37 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    25: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "headers: {\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parametersHeader"),
          {
            name: "each",
            hash: {},
            fn: e.program(23, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 57, column: 16 },
              end: { line: 59, column: 25 },
            },
          }
        ))
          ? l
          : "") +
        "            },\n"
      );
    },
    27: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "query: {\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parametersQuery"),
          {
            name: "each",
            hash: {},
            fn: e.program(23, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 64, column: 16 },
              end: { line: 66, column: 25 },
            },
          }
        ))
          ? l
          : "") +
        "            },\n"
      );
    },
    29: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "formData: {\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parametersForm"),
          {
            name: "each",
            hash: {},
            fn: e.program(23, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 71, column: 16 },
              end: { line: 73, column: 25 },
            },
          }
        ))
          ? l
          : "") +
        "            },\n"
      );
    },
    31: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "body: " +
        (null !=
        (l = e.lambda(
          e.strict(o(n, "parametersBody"), "name", {
            start: { line: 77, column: 21 },
            end: { line: 77, column: 40 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    33: function (e, n, t, r, a) {
      var l;
      return (
        "responseHeader: '" +
        (null !=
        (l = e.lambda(
          e.strict(n, "responseHeader", {
            start: { line: 80, column: 32 },
            end: { line: 80, column: 46 },
          }),
          n
        ))
          ? l
          : "") +
        "',\n"
      );
    },
    35: function (e, n, t, r, a) {
      return "            accept: acceptContentType,\n            responseType: 'arraybuffer'\n";
    },
    37: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n        if (!result.ok) {\n            switch (result.status) {\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "errors"),
          {
            name: "each",
            hash: {},
            fn: e.program(38, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 93, column: 12 },
              end: { line: 95, column: 21 },
            },
          }
        ))
          ? l
          : "") +
        "            }\n        }\n"
      );
    },
    38: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda;
      return (
        "                case " +
        (null !=
        (l = i(
          o(n, "code", {
            start: { line: 94, column: 24 },
            end: { line: 94, column: 28 },
          }),
          n
        ))
          ? l
          : "") +
        ": throw new ApiError(result, `" +
        (null !=
        (l = i(
          o(n, "description", {
            start: { line: 94, column: 64 },
            end: { line: 94, column: 75 },
          }),
          n
        ))
          ? l
          : "") +
        "`);\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "/* eslint-disable */\n" +
        (null !=
        (l = i(t, "if").call(o, i(n, "imports"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 2, column: 0 }, end: { line: 6, column: 7 } },
        }))
          ? l
          : "") +
        "\n" +
        (null !=
        (l = i(t, "equals").call(o, i(n, "importContentType"), !0, {
          name: "equals",
          hash: {},
          fn: e.program(4, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 8, column: 0 }, end: { line: 10, column: 11 } },
        }))
          ? l
          : "") +
        "\n" +
        (null !=
        (l = i(t, "if").call(o, i(n, "hasApiErrors"), {
          name: "if",
          hash: {},
          fn: e.program(6, a, 0),
          inverse: e.program(8, a, 0),
          data: a,
          loc: { start: { line: 12, column: 0 }, end: { line: 16, column: 7 } },
        }))
          ? l
          : "") +
        "import { request as __request } from '../../core/request';\nimport { OpenAPI } from './settings';\n\nexport class " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 20, column: 16 },
            end: { line: 20, column: 20 },
          }),
          n
        ))
          ? l
          : "") +
        " {\n\n" +
        (null !=
        (l = i(t, "each").call(o, i(n, "operations"), {
          name: "each",
          hash: {},
          fn: e.program(10, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 22, column: 4 },
            end: { line: 105, column: 13 },
          },
        }))
          ? l
          : "") +
        "}"
      );
    },
    usePartial: !0,
    useData: !0,
  },
  Z = {
    1: function (e, n, t, r, a) {
      return "\nexport { ApiError } from '../core/ApiError';\nexport { isSuccess } from '../core/isSuccess';\n";
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "models"),
          {
            name: "if",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 7, column: 0 },
              end: { line: 12, column: 7 },
            },
          }
        ))
        ? l
        : "";
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "models"),
          {
            name: "each",
            hash: {},
            fn: e.program(5, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 9, column: 0 },
              end: { line: 11, column: 9 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    5: function (e, n, t, r, a) {
      var l;
      return (
        "export * from './models/" +
        (null != (l = e.lambda(n, n)) ? l : "") +
        "';\n"
      );
    },
    7: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "models"),
          {
            name: "if",
            hash: {},
            fn: e.program(8, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 15, column: 0 },
              end: { line: 20, column: 7 },
            },
          }
        ))
        ? l
        : "";
    },
    8: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "models"),
          {
            name: "each",
            hash: {},
            fn: e.program(9, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 17, column: 0 },
              end: { line: 19, column: 9 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    9: function (e, n, t, r, a) {
      var l,
        o = e.lambda;
      return (
        "export { $" +
        (null != (l = o(n, n)) ? l : "") +
        " } from './schemas/$" +
        (null != (l = o(n, n)) ? l : "") +
        "';\n"
      );
    },
    11: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "services"),
          {
            name: "if",
            hash: {},
            fn: e.program(12, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 23, column: 0 },
              end: { line: 28, column: 7 },
            },
          }
        ))
        ? l
        : "";
    },
    12: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "services"),
          {
            name: "each",
            hash: {},
            fn: e.program(13, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 25, column: 0 },
              end: { line: 27, column: 9 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    13: function (e, n, t, r, a) {
      var l,
        o = e.lambda;
      return (
        "export { " +
        (null != (l = o(n, n)) ? l : "") +
        " } from './services/" +
        (null != (l = o(n, n)) ? l : "") +
        "';\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = i(t, "if").call(o, i(n, "exportCore"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "exportModels"), {
          name: "if",
          hash: {},
          fn: e.program(3, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 6, column: 0 }, end: { line: 13, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "exportSchemas"), {
          name: "if",
          hash: {},
          fn: e.program(7, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 14, column: 0 }, end: { line: 21, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "exportServices"), {
          name: "if",
          hash: {},
          fn: e.program(11, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 22, column: 0 }, end: { line: 29, column: 7 } },
        }))
          ? l
          : "")
      );
    },
    useData: !0,
  },
  K = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "/**\n * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 3, column: 6 },
            end: { line: 3, column: 17 },
          }),
          n
        ))
          ? l
          : "") +
        "\n */\n"
      );
    },
    3: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda,
        s =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = s(t, "if").call(
          null != n ? n : e.nullContext || {},
          s(n, "description"),
          {
            name: "if",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 8, column: 4 },
              end: { line: 12, column: 11 },
            },
          }
        ))
          ? l
          : "") +
        "    " +
        (null !=
        (l = i(
          o(n, "name", {
            start: { line: 13, column: 7 },
            end: { line: 13, column: 11 },
          }),
          n
        ))
          ? l
          : "") +
        " = " +
        (null !=
        (l = i(
          o(n, "value", {
            start: { line: 13, column: 20 },
            end: { line: 13, column: 25 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    4: function (e, n, t, r, a) {
      var l;
      return (
        "    /**\n     * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 10, column: 10 },
            end: { line: 10, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        "\n     */\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = i(t, "if").call(o, i(n, "description"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 7 } },
        }))
          ? l
          : "") +
        "export enum " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 6, column: 15 },
            end: { line: 6, column: 19 },
          }),
          n
        ))
          ? l
          : "") +
        " {\n" +
        (null !=
        (l = i(t, "each").call(o, i(n, "enum"), {
          name: "each",
          hash: {},
          fn: e.program(3, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 7, column: 4 }, end: { line: 14, column: 13 } },
        }))
          ? l
          : "") +
        "}"
      );
    },
    useData: !0,
  },
  ee = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "/**\n * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 3, column: 6 },
            end: { line: 3, column: 17 },
          }),
          n
        ))
          ? l
          : "") +
        "\n */\n"
      );
    },
    3: function (e, n, t, r, a, l, o) {
      var i,
        s =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (i = s(t, "if").call(
          null != n ? n : e.nullContext || {},
          s(n, "description"),
          {
            name: "if",
            hash: {},
            fn: e.program(4, a, 0, l, o),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 8, column: 4 },
              end: { line: 12, column: 11 },
            },
          }
        ))
          ? i
          : "") +
        "    " +
        (null !=
        (i = e.invokePartial(s(r, "isReadOnly"), n, {
          name: "isReadOnly",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? i
          : "") +
        (null !=
        (i = e.lambda(
          e.strict(n, "name", {
            start: { line: 13, column: 22 },
            end: { line: 13, column: 26 },
          }),
          n
        ))
          ? i
          : "") +
        (null !=
        (i = e.invokePartial(s(r, "isRequired"), n, {
          name: "isRequired",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? i
          : "") +
        ": " +
        (null !=
        (i = e.invokePartial(s(r, "type"), n, {
          name: "type",
          hash: { parent: s(o[1], "name") },
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? i
          : "") +
        ";\n"
      );
    },
    4: function (e, n, t, r, a) {
      var l;
      return (
        "    /**\n     * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 10, column: 10 },
            end: { line: 10, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        "\n     */\n"
      );
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\nexport namespace " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 19, column: 20 },
            end: { line: 19, column: 24 },
          }),
          n
        ))
          ? l
          : "") +
        " {\n\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "enums"),
          {
            name: "each",
            hash: {},
            fn: e.program(7, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 21, column: 4 },
              end: { line: 33, column: 13 },
            },
          }
        ))
          ? l
          : "") +
        "\n}\n"
      );
    },
    7: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = i(t, "if").call(o, i(n, "description"), {
          name: "if",
          hash: {},
          fn: e.program(4, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 22, column: 4 },
            end: { line: 26, column: 11 },
          },
        }))
          ? l
          : "") +
        "    export enum " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 27, column: 19 },
            end: { line: 27, column: 23 },
          }),
          n
        ))
          ? l
          : "") +
        " {\n" +
        (null !=
        (l = i(t, "each").call(o, i(n, "enum"), {
          name: "each",
          hash: {},
          fn: e.program(8, a, 0),
          inverse: e.noop,
          data: a,
          loc: {
            start: { line: 28, column: 8 },
            end: { line: 30, column: 17 },
          },
        }))
          ? l
          : "") +
        "    }\n\n"
      );
    },
    8: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda;
      return (
        "        " +
        (null !=
        (l = i(
          o(n, "name", {
            start: { line: 29, column: 11 },
            end: { line: 29, column: 15 },
          }),
          n
        ))
          ? l
          : "") +
        " = " +
        (null !=
        (l = i(
          o(n, "value", {
            start: { line: 29, column: 24 },
            end: { line: 29, column: 29 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a, l, o) {
      var i,
        s = null != n ? n : e.nullContext || {},
        u =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (i = u(t, "if").call(s, u(n, "description"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0, l, o),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 7 } },
        }))
          ? i
          : "") +
        "export interface " +
        (null !=
        (i = e.lambda(
          e.strict(n, "name", {
            start: { line: 6, column: 20 },
            end: { line: 6, column: 24 },
          }),
          n
        ))
          ? i
          : "") +
        (null !=
        (i = e.invokePartial(u(r, "extends"), n, {
          name: "extends",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? i
          : "") +
        " {\n" +
        (null !=
        (i = u(t, "each").call(s, u(n, "properties"), {
          name: "each",
          hash: {},
          fn: e.program(3, a, 0, l, o),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 7, column: 4 }, end: { line: 14, column: 13 } },
        }))
          ? i
          : "") +
        "}\n\n" +
        (null !=
        (i = u(t, "if").call(s, u(n, "enums"), {
          name: "if",
          hash: {},
          fn: e.program(6, a, 0, l, o),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 17, column: 0 }, end: { line: 36, column: 7 } },
        }))
          ? i
          : "")
      );
    },
    usePartial: !0,
    useData: !0,
    useDepths: !0,
  },
  ne = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "/**\n * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 3, column: 6 },
            end: { line: 3, column: 17 },
          }),
          n
        ))
          ? l
          : "") +
        "\n */\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "description"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 7 } },
          }
        ))
          ? l
          : "") +
        "export type " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 6, column: 15 },
            end: { line: 6, column: 19 },
          }),
          n
        ))
          ? l
          : "") +
        " = " +
        (null !=
        (l = e.invokePartial(o(r, "type"), n, {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ";"
      );
    },
    usePartial: !0,
    useData: !0,
  },
  te = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        " extends " +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "extends"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 1, column: 24 },
              end: { line: 1, column: 90 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    2: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null != (l = e.lambda(n, n)) ? l : "") +
        (null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(a, "last"),
          {
            name: "unless",
            hash: {},
            fn: e.program(3, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 1, column: 51 },
              end: { line: 1, column: 81 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    3: function (e, n, t, r, a) {
      return ", ";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "extends"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 97 },
            },
          }
        ))
        ? l
        : "";
    },
    useData: !0,
  },
  re = {
    1: function (e, n, t, r, a) {
      return " | null";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "isNullable"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 32 },
            },
          }
        ))
        ? l
        : "";
    },
    useData: !0,
  },
  ae = {
    1: function (e, n, t, r, a) {
      return "readonly ";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "isReadOnly"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 34 },
            },
          }
        ))
        ? l
        : "";
    },
    useData: !0,
  },
  le = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(n, "isRequired"),
          {
            name: "unless",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.program(4, a, 0),
            data: a,
            loc: {
              start: { line: 2, column: 0 },
              end: { line: 2, column: 56 },
            },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      return "?";
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "default"),
          {
            name: "if",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 2, column: 24 },
              end: { line: 2, column: 44 },
            },
          }
        ))
        ? l
        : "";
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(n, "isRequired"),
          {
            name: "unless",
            hash: {},
            fn: e.program(7, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 4, column: 0 },
              end: { line: 4, column: 66 },
            },
          }
        ))
        ? l
        : "";
    },
    7: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(n, "default"),
          {
            name: "unless",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 4, column: 23 },
              end: { line: 4, column: 54 },
            },
          }
        ))
        ? l
        : "";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(o(a, "root"), "useOptions"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(6, a, 0),
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 7 } },
          }
        ))
        ? l
        : "";
    },
    useData: !0,
  },
  oe = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(o(a, "root"), "useOptions"),
          {
            name: "if",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.program(8, a, 0),
            data: a,
            loc: {
              start: { line: 2, column: 0 },
              end: { line: 17, column: 7 },
            },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = i(t, "each").call(o, i(n, "parameters"), {
          name: "each",
          hash: {},
          fn: e.program(3, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 4, column: 0 }, end: { line: 6, column: 9 } },
        }))
          ? l
          : "") +
        "}: {\n" +
        (null !=
        (l = i(t, "each").call(o, i(n, "parameters"), {
          name: "each",
          hash: {},
          fn: e.program(6, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 8, column: 0 }, end: { line: 10, column: 9 } },
        }))
          ? l
          : "") +
        "}"
      );
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 5, column: 3 },
            end: { line: 5, column: 7 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "default"),
          {
            name: "if",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 5, column: 10 },
              end: { line: 5, column: 48 },
            },
          }
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    4: function (e, n, t, r, a) {
      var l;
      return (
        " = " +
        (null !=
        (l = e.lambda(
          e.strict(n, "default", {
            start: { line: 5, column: 31 },
            end: { line: 5, column: 38 },
          }),
          n
        ))
          ? l
          : "")
      );
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 9, column: 3 },
            end: { line: 9, column: 7 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isRequired"), n, {
          name: "isRequired",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ": " +
        (null !=
        (l = e.invokePartial(o(r, "type"), n, {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ",\n"
      );
    },
    8: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "parameters"),
          {
            name: "each",
            hash: {},
            fn: e.program(9, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 14, column: 0 },
              end: { line: 16, column: 9 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    9: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 15, column: 3 },
            end: { line: 15, column: 7 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isRequired"), n, {
          name: "isRequired",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ": " +
        (null !=
        (l = e.invokePartial(o(r, "type"), n, {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "default"),
          {
            name: "if",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 15, column: 36 },
              end: { line: 15, column: 74 },
            },
          }
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    11: function (e, n, t, r, a) {
      return "acceptContentType: ContentType,\n";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = i(t, "if").call(o, i(n, "parameters"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 1, column: 0 }, end: { line: 18, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "isBinary"), {
          name: "if",
          hash: {},
          fn: e.program(11, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 19, column: 0 }, end: { line: 21, column: 7 } },
        }))
          ? l
          : "")
      );
    },
    usePartial: !0,
    useData: !0,
  },
  ie = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "results"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 2, column: 0 },
              end: { line: 2, column: 66 },
            },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.invokePartial(o(r, "type"), n, {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        (null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(a, "last"),
          {
            name: "unless",
            hash: {},
            fn: e.program(3, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 2, column: 26 },
              end: { line: 2, column: 57 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    3: function (e, n, t, r, a) {
      return " | ";
    },
    5: function (e, n, t, r, a) {
      return "void";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "results"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(5, a, 0),
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  se = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "schemaInterface"), n, {
          name: "schemaInterface",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "enum",
          {
            name: "equals",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.program(6, a, 0),
            data: a,
            loc: {
              start: { line: 3, column: 0 },
              end: { line: 11, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "schemaEnum"), n, {
          name: "schemaEnum",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "array",
          {
            name: "equals",
            hash: {},
            fn: e.program(7, a, 0),
            inverse: e.program(9, a, 0),
            data: a,
            loc: {
              start: { line: 5, column: 0 },
              end: { line: 11, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    7: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "schemaArray"), n, {
          name: "schemaArray",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    9: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "dictionary",
          {
            name: "equals",
            hash: {},
            fn: e.program(10, a, 0),
            inverse: e.program(12, a, 0),
            data: a,
            loc: {
              start: { line: 7, column: 0 },
              end: { line: 11, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    10: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "schemaDictionary"), n, {
          name: "schemaDictionary",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    12: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "schemaGeneric"), n, {
          name: "schemaGeneric",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "interface",
          {
            name: "equals",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 11, column: 11 },
            },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  ue = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "required: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "isRequired", {
            start: { line: 3, column: 17 },
            end: { line: 3, column: 27 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "isRequired"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 2, column: 0 }, end: { line: 4, column: 7 } },
          }
        ))
          ? l
          : "") +
        "}"
      );
    },
    useData: !0,
  },
  ce = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "required: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "isRequired", {
            start: { line: 3, column: 17 },
            end: { line: 3, column: 27 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "isRequired"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 2, column: 0 }, end: { line: 4, column: 7 } },
          }
        ))
          ? l
          : "") +
        "}"
      );
    },
    useData: !0,
  },
  pe = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "required: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "isRequired", {
            start: { line: 3, column: 13 },
            end: { line: 3, column: 23 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "isRequired"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 2, column: 0 }, end: { line: 4, column: 7 } },
          }
        ))
          ? l
          : "") +
        "}"
      );
    },
    useData: !0,
  },
  me = {
    1: function (e, n, t, r, a) {
      var l;
      return (
        "required: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "isRequired", {
            start: { line: 3, column: 15 },
            end: { line: 3, column: 25 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    3: function (e, n, t, r, a) {
      var l;
      return (
        "maximum: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "maximum", {
            start: { line: 6, column: 14 },
            end: { line: 6, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    5: function (e, n, t, r, a) {
      var l;
      return (
        "exclusiveMaximum: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "exclusiveMaximum", {
            start: { line: 9, column: 23 },
            end: { line: 9, column: 39 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    7: function (e, n, t, r, a) {
      var l;
      return (
        "minimum: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "minimum", {
            start: { line: 12, column: 14 },
            end: { line: 12, column: 21 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    9: function (e, n, t, r, a) {
      var l;
      return (
        "exclusiveMinimum: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "exclusiveMinimum", {
            start: { line: 15, column: 23 },
            end: { line: 15, column: 39 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    11: function (e, n, t, r, a) {
      var l;
      return (
        "multipleOf: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "multipleOf", {
            start: { line: 18, column: 17 },
            end: { line: 18, column: 27 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    13: function (e, n, t, r, a) {
      var l;
      return (
        "maxLength: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "maxLength", {
            start: { line: 21, column: 16 },
            end: { line: 21, column: 25 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    15: function (e, n, t, r, a) {
      var l;
      return (
        "minLength: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "minLength", {
            start: { line: 24, column: 16 },
            end: { line: 24, column: 25 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    17: function (e, n, t, r, a) {
      var l;
      return (
        "pattern: '" +
        (null !=
        (l = e.lambda(
          e.strict(n, "pattern", {
            start: { line: 27, column: 15 },
            end: { line: 27, column: 22 },
          }),
          n
        ))
          ? l
          : "") +
        "',\n"
      );
    },
    19: function (e, n, t, r, a) {
      var l;
      return (
        "maxItems: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "maxItems", {
            start: { line: 30, column: 15 },
            end: { line: 30, column: 23 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    21: function (e, n, t, r, a) {
      var l;
      return (
        "minItems: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "minItems", {
            start: { line: 33, column: 15 },
            end: { line: 33, column: 23 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    23: function (e, n, t, r, a) {
      var l;
      return (
        "uniqueItems: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "uniqueItems", {
            start: { line: 36, column: 18 },
            end: { line: 36, column: 29 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    25: function (e, n, t, r, a) {
      var l;
      return (
        "maxProperties: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "maxProperties", {
            start: { line: 39, column: 20 },
            end: { line: 39, column: 33 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    27: function (e, n, t, r, a) {
      var l;
      return (
        "minProperties: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "minProperties", {
            start: { line: 42, column: 20 },
            end: { line: 42, column: 33 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = i(t, "if").call(o, i(n, "isRequired"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 2, column: 0 }, end: { line: 4, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "maximum"), {
          name: "if",
          hash: {},
          fn: e.program(3, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 5, column: 0 }, end: { line: 7, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "exclusiveMaximum"), {
          name: "if",
          hash: {},
          fn: e.program(5, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 8, column: 0 }, end: { line: 10, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "minimum"), {
          name: "if",
          hash: {},
          fn: e.program(7, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 11, column: 0 }, end: { line: 13, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "exclusiveMinimum"), {
          name: "if",
          hash: {},
          fn: e.program(9, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 14, column: 0 }, end: { line: 16, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "multipleOf"), {
          name: "if",
          hash: {},
          fn: e.program(11, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 17, column: 0 }, end: { line: 19, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "maxLength"), {
          name: "if",
          hash: {},
          fn: e.program(13, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 20, column: 0 }, end: { line: 22, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "minLength"), {
          name: "if",
          hash: {},
          fn: e.program(15, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 23, column: 0 }, end: { line: 25, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "pattern"), {
          name: "if",
          hash: {},
          fn: e.program(17, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 26, column: 0 }, end: { line: 28, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "maxItems"), {
          name: "if",
          hash: {},
          fn: e.program(19, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 29, column: 0 }, end: { line: 31, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "minItems"), {
          name: "if",
          hash: {},
          fn: e.program(21, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 32, column: 0 }, end: { line: 34, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "uniqueItems"), {
          name: "if",
          hash: {},
          fn: e.program(23, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 35, column: 0 }, end: { line: 37, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "maxProperties"), {
          name: "if",
          hash: {},
          fn: e.program(25, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 38, column: 0 }, end: { line: 40, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "minProperties"), {
          name: "if",
          hash: {},
          fn: e.program(27, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 41, column: 0 }, end: { line: 43, column: 7 } },
        }))
          ? l
          : "") +
        "}"
      );
    },
    useData: !0,
  },
  fe = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "extends"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 3, column: 4 },
              end: { line: 5, column: 13 },
            },
          }
        ))
        ? l
        : "";
    },
    2: function (e, n, t, r, a) {
      var l;
      return (
        "        ...$" +
        (null != (l = e.lambda(n, n)) ? l : "") +
        ".properties,\n"
      );
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "properties"),
          {
            name: "each",
            hash: {},
            fn: e.program(5, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 8, column: 4 },
              end: { line: 10, column: 13 },
            },
          }
        ))
        ? l
        : "";
    },
    5: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "        " +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 9, column: 11 },
            end: { line: 9, column: 15 },
          }),
          n
        ))
          ? l
          : "") +
        ": " +
        (null !=
        (l = e.invokePartial(o(r, "schema"), n, {
          name: "schema",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ",\n"
      );
    },
    7: function (e, n, t, r, a) {
      var l;
      return (
        "required: " +
        (null !=
        (l = e.lambda(
          e.strict(n, "isRequired", {
            start: { line: 13, column: 17 },
            end: { line: 13, column: 27 },
          }),
          n
        ))
          ? l
          : "") +
        ",\n"
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o = null != n ? n : e.nullContext || {},
        i =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = i(t, "if").call(o, i(n, "extends"), {
          name: "if",
          hash: {},
          fn: e.program(1, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 2, column: 0 }, end: { line: 6, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "properties"), {
          name: "if",
          hash: {},
          fn: e.program(4, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 7, column: 0 }, end: { line: 11, column: 7 } },
        }))
          ? l
          : "") +
        (null !=
        (l = i(t, "if").call(o, i(n, "isRequired"), {
          name: "if",
          hash: {},
          fn: e.program(7, a, 0),
          inverse: e.noop,
          data: a,
          loc: { start: { line: 12, column: 0 }, end: { line: 14, column: 7 } },
        }))
          ? l
          : "") +
        "}"
      );
    },
    usePartial: !0,
    useData: !0,
  },
  de = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeInterface"), n, {
          name: "typeInterface",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "reference",
          {
            name: "equals",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.program(6, a, 0),
            data: a,
            loc: {
              start: { line: 3, column: 0 },
              end: { line: 13, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeReference"), n, {
          name: "typeReference",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    6: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "enum",
          {
            name: "equals",
            hash: {},
            fn: e.program(7, a, 0),
            inverse: e.program(9, a, 0),
            data: a,
            loc: {
              start: { line: 5, column: 0 },
              end: { line: 13, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    7: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeEnum"), n, {
          name: "typeEnum",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    9: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "array",
          {
            name: "equals",
            hash: {},
            fn: e.program(10, a, 0),
            inverse: e.program(12, a, 0),
            data: a,
            loc: {
              start: { line: 7, column: 0 },
              end: { line: 13, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    10: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeArray"), n, {
          name: "typeArray",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    12: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "dictionary",
          {
            name: "equals",
            hash: {},
            fn: e.program(13, a, 0),
            inverse: e.program(15, a, 0),
            data: a,
            loc: {
              start: { line: 9, column: 0 },
              end: { line: 13, column: 0 },
            },
          }
        ))
        ? l
        : "";
    },
    13: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeDictionary"), n, {
          name: "typeDictionary",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    15: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = e.invokePartial(o(r, "typeGeneric"), n, {
          name: "typeGeneric",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
        ? l
        : "";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "export"),
          "interface",
          {
            name: "equals",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 13, column: 11 },
            },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  he = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "Array<" +
        (null !=
        (l = e.invokePartial(o(r, "type"), o(n, "link"), {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ">" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "Array<" +
        (null !=
        (l = e.lambda(
          e.strict(n, "base", {
            start: { line: 4, column: 9 },
            end: { line: 4, column: 13 },
          }),
          n
        ))
          ? l
          : "") +
        ">" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "link"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  ye = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "Dictionary<" +
        (null !=
        (l = e.invokePartial(o(r, "type"), o(n, "link"), {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ">" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "Dictionary<" +
        (null !=
        (l = e.lambda(
          e.strict(n, "base", {
            start: { line: 4, column: 14 },
            end: { line: 4, column: 18 },
          }),
          n
        ))
          ? l
          : "") +
        ">" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "link"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 5, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  ve = {
    1: function (e, n, t, r, a) {
      var l,
        o = e.strict,
        i = e.lambda,
        s =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = i(
          o(n, "parent", {
            start: { line: 2, column: 3 },
            end: { line: 2, column: 9 },
          }),
          n
        ))
          ? l
          : "") +
        "." +
        (null !=
        (l = i(
          o(n, "name", {
            start: { line: 2, column: 16 },
            end: { line: 2, column: 20 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(s(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "(" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "enum"),
          {
            name: "each",
            hash: {},
            fn: e.program(4, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 5, column: 0 },
              end: { line: 7, column: 11 },
            },
          }
        ))
          ? l
          : "") +
        ")" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    4: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "value", {
            start: { line: 6, column: 3 },
            end: { line: 6, column: 8 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = o(t, "unless").call(
          null != n ? n : e.nullContext || {},
          o(a, "last"),
          {
            name: "unless",
            hash: {},
            fn: e.program(5, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 6, column: 11 },
              end: { line: 6, column: 42 },
            },
          }
        ))
          ? l
          : "")
      );
    },
    5: function (e, n, t, r, a) {
      return " | ";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "parent"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: { start: { line: 1, column: 0 }, end: { line: 9, column: 9 } },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  Pe = {
    1: function (e, n, t, r, a) {
      return "void";
    },
    3: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "base", {
            start: { line: 1, column: 42 },
            end: { line: 1, column: 46 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "equals").call(
          null != n ? n : e.nullContext || {},
          o(n, "format"),
          "binary",
          {
            name: "equals",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(3, a, 0),
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 75 },
            },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  Oe = {
    1: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        "{\n" +
        (null !=
        (l = o(t, "each").call(
          null != n ? n : e.nullContext || {},
          o(n, "properties"),
          {
            name: "each",
            hash: {},
            fn: e.program(2, a, 0),
            inverse: e.noop,
            data: a,
            loc: {
              start: { line: 3, column: 0 },
              end: { line: 10, column: 9 },
            },
          }
        ))
          ? l
          : "") +
        "}" +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    2: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "description"),
          {
            name: "if",
            hash: {},
            fn: e.program(3, a, 0),
            inverse: e.noop,
            data: a,
            loc: { start: { line: 4, column: 0 }, end: { line: 8, column: 7 } },
          }
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isReadOnly"), n, {
          name: "isReadOnly",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        (null !=
        (l = e.lambda(
          e.strict(n, "name", {
            start: { line: 9, column: 18 },
            end: { line: 9, column: 22 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isRequired"), n, {
          name: "isRequired",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ": " +
        (null !=
        (l = e.invokePartial(o(r, "type"), n, {
          name: "type",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "") +
        ",\n"
      );
    },
    3: function (e, n, t, r, a) {
      var l;
      return (
        "/**\n * " +
        (null !=
        (l = e.lambda(
          e.strict(n, "description", {
            start: { line: 6, column: 6 },
            end: { line: 6, column: 17 },
          }),
          n
        ))
          ? l
          : "") +
        "\n */\n"
      );
    },
    5: function (e, n, t, r, a) {
      return "any";
    },
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return null !=
        (l = o(t, "if").call(
          null != n ? n : e.nullContext || {},
          o(n, "properties"),
          {
            name: "if",
            hash: {},
            fn: e.program(1, a, 0),
            inverse: e.program(5, a, 0),
            data: a,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 14, column: 9 },
            },
          }
        ))
        ? l
        : "";
    },
    usePartial: !0,
    useData: !0,
  },
  be = {
    compiler: [8, ">= 4.3.0"],
    main: function (e, n, t, r, a) {
      var l,
        o =
          e.lookupProperty ||
          function (e, n) {
            if (Object.prototype.hasOwnProperty.call(e, n)) return e[n];
          };
      return (
        (null !=
        (l = e.lambda(
          e.strict(n, "base", {
            start: { line: 1, column: 3 },
            end: { line: 1, column: 7 },
          }),
          n
        ))
          ? l
          : "") +
        (null !=
        (l = e.invokePartial(o(r, "isNullable"), n, {
          name: "isNullable",
          data: a,
          helpers: t,
          partials: r,
          decorators: e.decorators,
        }))
          ? l
          : "")
      );
    },
    usePartial: !0,
    useData: !0,
  };
function xe() {
  f.registerHelper("equals", function (e, n, t) {
    return e === n ? t.fn(this) : t.inverse(this);
  }),
    f.registerHelper("notEquals", function (e, n, t) {
      return e !== n ? t.fn(this) : t.inverse(this);
    }),
    f.registerHelper("interpolation", function (e, n) {
      return `\`\${${e}.${(n + "apiurl").toUpperCase()}}\``;
    });
  const e = {
    index: f.template(Z),
    model: f.template(V),
    schema: f.template(Y),
    service: f.template(z),
    settings: f.template(Q),
  };
  return (
    f.registerPartial("exportEnum", f.template(K)),
    f.registerPartial("exportInterface", f.template(ee)),
    f.registerPartial("exportType", f.template(ne)),
    f.registerPartial("extends", f.template(te)),
    f.registerPartial("isNullable", f.template(re)),
    f.registerPartial("isReadOnly", f.template(ae)),
    f.registerPartial("isRequired", f.template(le)),
    f.registerPartial("parameters", f.template(oe)),
    f.registerPartial("result", f.template(ie)),
    f.registerPartial("schema", f.template(se)),
    f.registerPartial("schemaArray", f.template(ue)),
    f.registerPartial("schemaDictionary", f.template(ce)),
    f.registerPartial("schemaEnum", f.template(pe)),
    f.registerPartial("schemaGeneric", f.template(me)),
    f.registerPartial("schemaInterface", f.template(fe)),
    f.registerPartial("type", f.template(de)),
    f.registerPartial("typeArray", f.template(he)),
    f.registerPartial("typeDictionary", f.template(ye)),
    f.registerPartial("typeEnum", f.template(ve)),
    f.registerPartial("typeGeneric", f.template(Pe)),
    f.registerPartial("typeInterface", f.template(Oe)),
    f.registerPartial("typeReference", f.template(be)),
    e
  );
}
function ge(e) {
  let n = 0,
    r = e.split(t.EOL);
  return (
    (r = r.map((e) => {
      e = e.trim().replace(/^\*/g, " *");
      let t = n;
      (e.endsWith("(") || e.endsWith("{") || e.endsWith("[")) && n++,
        (e.startsWith(")") || e.startsWith("}") || e.startsWith("]")) &&
          t &&
          (n--, t--);
      const r = `${"    ".repeat(t)}${e}`;
      return "" === r.trim() ? "" : r;
    })),
    r.join(t.EOL)
  );
}
const { exec: we } = require("child_process");
async function ke(e, n) {
  await D(l.resolve(__dirname, "../src/templates/" + e), l.resolve(n, e));
}
async function Ce(e, n, t, r, a, o, i, s, c, p) {
  const m = l.resolve(process.cwd(), r),
    f = l.resolve(m, "core"),
    d = l.resolve(m, e, "models"),
    h = l.resolve(m, e, "schemas"),
    y = l.resolve(m, e, "services");
  var v;
  await ((e) =>
    new Promise((n, t) => {
      u(e, (e) => {
        e ? t(e) : n();
      });
    }))(l.resolve(m, e)),
    await M(m),
    await M(l.resolve(m, e)),
    i &&
      (await M(f),
      await ke("core/ApiError.ts", m),
      await ke("core/getFormData.ts", m),
      await ke("core/getQueryString.ts", m),
      await ke("core/isSuccess.ts", m),
      await ke("core/request.ts", m),
      await ke("core/RequestOptions.ts", m),
      await ke("core/requestUsingXHR.ts", m),
      await ke("core/Result.ts", m),
      await ke("core/ContentType.ts", m),
      await ke("useLoad.ts", m)),
    s &&
      (await M(y),
      await (async function (e, n, t, r, a) {
        await $(
          l.resolve(r, "settings.ts"),
          t.settings({ httpClient: a, server: e, version: n.version })
        );
      })(e, n, t, y, a),
      await (async function (e, n, t, r) {
        for (const a of e) {
          const e = l.resolve(t, a.name + ".ts"),
            o = a.operations.some((e) => e.errors.length),
            i = a.operations.some((e) => e.path.includes("OpenAPI.VERSION")),
            s = n.service(
              Object.assign(Object.assign({}, a), {
                hasApiErrors: o,
                hasApiVersion: i,
                useOptions: r,
              })
            );
          await $(e, ge(s));
        }
      })(n.services, t, y, o)),
    p &&
      (await M(h),
      await (async function (e, n, t) {
        for (const r of e) {
          const e = l.resolve(t, `$${r.name}.ts`),
            a = n.schema(r);
          await $(e, ge(a));
        }
      })(n.models, t, h)),
    c &&
      (await M(d),
      await (async function (e, n, t) {
        await D(l.resolve(__dirname, "../src/templates/" + e), l.resolve(n, t));
      })("models/Dictionary.ts", d, "Dictionary.ts"),
      await (async function (e, n, t) {
        for (const r of e) {
          const e = l.resolve(t, r.name + ".ts"),
            a = n.model(r);
          await $(e, ge(a));
        }
      })(n.models, t, d)),
    await (async function (e, n, t, r, a, o, i) {
      var s, u;
      await $(
        l.resolve(t, "index.ts"),
        n.index({
          exportCore: r,
          exportServices: a,
          exportModels: o,
          exportSchemas: i,
          server: e.server,
          version: e.version,
          models: ((u = e.models), u.map((e) => e.name).sort(H)),
          services: ((s = e.services), s.map((e) => e.name).sort(H)),
        })
      );
    })(n, t, l.resolve(m, e), i, s, c, p),
    await ((v = `prettier --write ${m}/**`),
    new Promise((e, n) => {
      we(v, (n, t, r) => {
        n && console.warn(n), e(t || r);
      });
    }));
}
var je;
((je = exports.HttpClient || (exports.HttpClient = {})).FETCH = "fetch"),
  (je.XHR = "xhr"),
  (exports.generate = async function ({
    envName: e,
    input: n,
    output: t,
    httpClient: r = exports.HttpClient.XHR,
    useOptions: o = !1,
    useUnionTypes: i = !1,
    exportCore: s = !0,
    exportServices: u = !0,
    exportModels: c = !0,
    exportSchemas: p = !0,
    write: m = !0,
  }) {
    if (!e) throw "No env name was provided, unable to continue";
    const f =
        "string" == typeof n
          ? await (async function (e) {
              const n = l.extname(e).toLowerCase(),
                t = await B(e);
              switch (n) {
                case ".yml":
                case ".yaml":
                  try {
                    return a.safeLoad(t);
                  } catch (n) {
                    throw new Error(`Could not parse OpenApi YAML: "${e}"`);
                  }
                default:
                  try {
                    return JSON.parse(t);
                  } catch (n) {
                    throw new Error(`Could not parse OpenApi JSON: "${e}"`);
                  }
              }
            })(n)
          : n,
      d = xe(),
      h = W(N(f), i);
    m && (await Ce(e, h, d, t, r, o, s, u, c, p));
  });
