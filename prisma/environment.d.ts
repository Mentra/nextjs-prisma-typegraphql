declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_SECRET: string;
      DATASCIENCE_URL: string;
      NODE_ENV: "dev" | "production";
      PORT?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
