interface Config {
  BASE: string;
  VERSION: string;
}

export const OpenAPI: Config = {
  BASE: `${process.env.CABINIZERAPIURL}`,
  VERSION: '1.0',
};
