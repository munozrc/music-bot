import { type CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js"
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
    title: "MY EYES",
    artist: "Travis Scott",
    thumbnail: "https://lh3.googleusercontent.com/eBvJuWpjg0Mx8DBa5WIhCzEopXyMnxkjWSU895BDGjTpNeqrliLrv3zGqNNuCUoXL1EkEAr5VQ3cx2pW=w544-h544-l90-rj",
    source: URL
  })

  const responseEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle("Added Song!")
    .setImage(song.thumbnail)
    .setDescription(`${song.artist} - ${song.title}`)

  if (!isFirstSongAdded) {
    await interaction.reply({ embeds: [responseEmbed] })
    return
  }

  playSong(song)
  await interaction.reply({ embeds: [responseEmbed] })
}
