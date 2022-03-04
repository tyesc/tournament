const env = process.env;

export const environment = {
  production: false,
  TEST: env.TEST,

  // Databases
  MONGODB_URI: env.MONGODB_URI,
};
