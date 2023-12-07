declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENTID: string
      SERVERID: string
      BOT_TOKEN: string
      YT_API_KEY: string
    }
  }
}
