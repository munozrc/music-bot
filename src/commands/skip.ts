import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { playNextSong } from "../libs/audio-player-controls"
import { getVoiceConnections } from "@discordjs/voice"

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip current song!")

export async function execute (interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const connections = getVoiceConnections()
  const numberOfConnections = connections.size

  if (numberOfConnections === 0) {
    console.error("[VOICE_CHANNEL_ERROR] Bot without voice channel")
    await interaction.reply("You must invite the bot to a voice channel")
    return
  }

  const nextSong = playNextSong()

  if (typeof nextSong === "undefined") {
    await interaction.reply("No songs")
    return
  }

  await interaction.reply("Skipped song")
}
