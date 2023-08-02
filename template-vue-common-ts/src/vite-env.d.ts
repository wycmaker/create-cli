/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    readonly NODE_ENV: string,
    readonly VITE_APP_MODE: string,
    readonly VITE_API_ROOT: string,
    readonly VITE_PUBLISH_PATH: string,
    readonly VITE_OUTPUT_DIR: string,
    readonly VITE_SERVER_URL: string
  }
}
