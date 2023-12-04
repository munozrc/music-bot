import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { getVoiceConnections } from "@discordjs/voice"

import { destroyAudioPlayer } from "../libs/audio-player"

export const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leave the voice channel bot.")

export async function execute (interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return

  const connections = getVoiceConnections()
  const numberOfConnections = connections.size

  if (numberOfConnections === 0) {
    await interaction.reply("There is no bot on call")
    return
  }

  connections.forEach((voiceConnection) => {
    voiceConnection.destroy()
    destroyAudioPlayer()
  })

  await interaction.reply("The bot leaves the voice channel.")
}
