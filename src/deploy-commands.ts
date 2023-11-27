import { REST, Routes } from "discord.js"
import { TOKEN, CLIENTID, SERVERID } from "./config"
import { commands } from "./commands"

const commandsData = Object
  .values(commands)
  .map((command) => command.data)

const rest = new REST({ version: "10" }).setToken(TOKEN as string)

export async function deployCommands (): Promise<void> {
  try {
    console.log("Started refreshing application (/) commands.")

    if (typeof CLIENTID === "undefined" || typeof SERVERID === "undefined") {
      return
    }

    await rest.put(
      Routes.applicationGuildCommands(CLIENTID, SERVERID),
      { body: commandsData }
    )

    console.log("Successfully reloaded application (/) commands.")
  } catch (error) {
    console.error(error)
  }
}
