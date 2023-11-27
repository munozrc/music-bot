import "dotenv/config"

const { DISCORD_TOKEN, CLIENT_ID, SERVER_ID } = process.env

if (DISCORD_TOKEN === undefined || CLIENT_ID === undefined || SERVER_ID === undefined) {
  throw new Error("Missing environment variables")
}

export const config = { CLIENT_ID, SERVER_ID, DISCORD_TOKEN }
