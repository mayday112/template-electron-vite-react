import path from "node:path";
import fs from "node:fs";
import { app } from "electron";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { entities } from "./entities/entities.js";
import { migrations } from "./migrations/migrations.js";

let datasourceInstance = null;

export const initializeDatasource = async () => {
  if (datasourceInstance) return datasourceInstance;

  try {
    const userDataPath = app.getPath("userData");
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    const dbPath = path.join(userDataPath, "database.sqlite");

    console.log("Initializing database at:", dbPath);

    datasourceInstance = new DataSource({
      type: "better-sqlite3",
      database: dbPath,
      entities: entities,
      migrations: migrations,
      synchronize: false,
      logging: true,
    });

    await datasourceInstance.initialize();
    return datasourceInstance;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

// Use a Proxy to delegate calls to the datasourceInstance once it's created
const datasourceProxy = new Proxy(
  {},
  {
    get(target, prop) {
      if (prop === "initialize") return initializeDatasource;

      if (!datasourceInstance) {
        if (prop === "isInitialized") return false;
        // Some TypeORM logic might check for 'then' or other props
        if (prop === "then") return undefined;

        throw new Error(
          `Property '${String(prop)}' accessed on datasource before initialization. Call initializeDatasource() first.`,
        );
      }

      const value = datasourceInstance[prop];
      if (typeof value === "function") {
        return value.bind(datasourceInstance);
      }
      return value;
    },
  },
);

export default datasourceProxy;
