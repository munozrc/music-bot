import "dotenv/config"

const { TOKEN, CLIENTID, SERVERID } = process.env

if ((TOKEN == null) || (CLIENTID == null) || (SERVERID == null)) {
  throw new Error("Missing environment variables")
}

export {
  CLIENTID,
  SERVERID,
  TOKEN
}
