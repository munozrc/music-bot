import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { getVoiceConnections } from "@discordjs/voice"
import ytdl from "ytdl-core"

import { addSong, getNumberOfSongs } from "../libs/queue-manager"
import { playSong } from "../libs/audio-player-controls"
import { getSingleVideo } from "../services/single-video"

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

  if (/playlist?list/.test(URL)) {
    await interaction.reply("The bot does not yet support playlist URLs")
  }

  const id = ytdl.getVideoID(URL)
  const song = await getSingleVideo({ id })

  if (typeof song === "undefined") {
    console.error("[VOICE_CHANNEL_ERROR] Failed to add song: " + id)
    await interaction.reply("Failed to add song")
    return
  }

  const responseEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Added Song!")
    .setImage(song.thumbnail)
    .setDescription(`**${song.artist}** - ${song.title}`)
    .setURL(song.source)

  const newSong = addSong(song)
  isFirstSongAdded && playSong(newSong)
  await interaction.reply({ embeds: [responseEmbed] })
}
