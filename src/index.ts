import { Client, GatewayIntentBits, type Interaction } from "discord.js"
import { deployCommands } from "./deploy-commands"
import { commands } from "./commands"
import "dotenv/config"

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

function handleAppIsReady (): void {
  console.log(`Logged in as ${client.user?.tag}`)
}

async function handleInteractionCreate (interaction: Interaction): Promise<void> {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  if (commandName in commands) {
    const keyCommnad = commandName as keyof typeof commands
    void commands[keyCommnad].execute(interaction)
  }
}

client.once("ready", handleAppIsReady)
client.on("interactionCreate", handleInteractionCreate)

void deployCommands()
void client.login(process.env.TOKEN)
