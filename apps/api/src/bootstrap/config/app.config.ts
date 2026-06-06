export interface AppConfig {
  appName: string;
  port: number;
  apiPrefix: string;
}

export default (): { app: AppConfig } => ({
  app: {
    appName: process.env.APP_NAME ?? 'foodmesh-api',
    port: Number(process.env.PORT ?? 3000),
    apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  },
});
