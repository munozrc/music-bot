import "dotenv/config"

const { DISCORD_TOKEN, CLIENT_ID, SERVER_ID, YT_API_KEY } = process.env

if (
  DISCORD_TOKEN === undefined ||
  CLIENT_ID === undefined ||
  SERVER_ID === undefined ||
  YT_API_KEY === undefined
) {
  throw new Error("Missing environment variables")
}

export const config = { CLIENT_ID, SERVER_ID, DISCORD_TOKEN, YT_API_KEY }
