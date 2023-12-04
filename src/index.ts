import { Client, GatewayIntentBits, type Interaction } from "discord.js"
import { generateDependencyReport } from "@discordjs/voice"
import { deployCommands } from "./deploy-commands"
import { commands } from "./commands"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates
  ]
})

async function handleAppIsReady (): Promise<void> {
  await deployCommands()
  console.log(`Logged in as ${client.user?.tag}`)
  console.log(generateDependencyReport())
}

async function handleInteractionCreate (interaction: Interaction): Promise<void> {
  if (!interaction.isCommand()) return
  const { commandName } = interaction

  if (!(commandName in commands)) return
  const keyCommnad = commandName as keyof typeof commands
  void commands[keyCommnad].execute(interaction)
}

client.once("ready", handleAppIsReady)
client.on("interactionCreate", handleInteractionCreate)

void client.login(process.env.TOKEN)
