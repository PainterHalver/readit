// ts is build into js in build folder
const rootDir = process.env.NODE_ENV === "development" ? "src" : "build";

module.exports = {
  type: "mongodb",
  url: process.env.MONGODB_URL,

  synchronize: true,
  useNewUrlParser: true,
  logging: process.env.NODE_ENV === "development",
  useUnifiedTopology: true,
  useFindAndModify: false,

  autoIndex: false,
  entities: [rootDir + "/entities/**/*{.ts,.js}"],
  migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
  subscribers: [rootDir + "/subscribers/**/*{.ts,.js}"],
  seeds: [rootDir + "/seeds/**/*{.ts,.js}"],
  cli: {
    entitiesDir: rootDir + "/entities",
    migrationsDir: rootDir + "/migrations",
    subscribersDir: rootDir + "/subscribers",
  },
};
