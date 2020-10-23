import * as OpenAPI from ".";

describe("index", () => {
  it("parses v3 without issues", async () => {
    await OpenAPI.generate({
      envName: "testService",
      input: "./test/mock/v3/spec.json",
      output: "./test/result/",
      useOptions: true,
      useUnionTypes: true,
      write: false,
    });
  });
});
