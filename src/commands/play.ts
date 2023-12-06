import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { getVoiceConnections } from "@discordjs/voice"
import ytdl from "ytdl-core"

import { addSong, getNumberOfSongs } from "../libs/queue-manager"
import { playSong } from "../libs/audio-player-controls"

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
  const isFirstSongAdded = getNumberOfSongs() === 0

  if (URL === null || !ytdl.validateURL(URL)) {
    console.error("[VOICE_CHANNEL_WARNING] URL song is not valid")
    await interaction.reply("URL song is not valid")
    return
  }

  const song = addSong({
    title: "",
    artist: "",
    thumbnail: "",
    source: URL
  })

  if (!isFirstSongAdded) {
    await interaction.reply("Add new song")
    return
  }

  playSong(song)
  await interaction.reply("Now playing!")
}
