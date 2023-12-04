import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { getVoiceConnections } from "@discordjs/voice"
import ytdl from "ytdl-core"

import { audioPlayer, initAudioResource } from "../libs/audio-player"

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a song from URL")
  .addStringOption((option) => {
    return option.setName("url")
      .setDescription("Youtube URL")
      .setRequired(true)
  })

export async function execute (interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const connections = getVoiceConnections()
  const numberOfConnections = connections.size

  if (numberOfConnections === 0) {
    console.error("[VOICE_CHANNEL_ERROR] Bot without voice channel")
    await interaction.reply("You must invite the bot to a voice channel")
    return
  }

  const URL = interaction.options.getString("url")

  if (URL === null) {
    console.error("[VOICE_CHANNEL_WARNING] URL song is required")
    await interaction.reply("URL song is empty")
    return
  }

  if (!ytdl.validateURL(URL)) {
    console.error("[VOICE_CHANNEL_WARNING] URL song is not valid")
    await interaction.reply("URL song is not valid")
    return
  }

  const audioResource = initAudioResource(URL)
  audioPlayer?.play(audioResource)
  await interaction.reply("Playing!")
}
