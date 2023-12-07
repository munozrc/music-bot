import { type CommandInteraction, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from "discord.js"
import { getVoiceConnections } from "@discordjs/voice"
import { searchSong } from "../services/search"
import { addSong, getNumberOfSongs } from "../libs/queue-manager"
import { playSong } from "../libs/audio-player-controls"

export const data = new SlashCommandBuilder()
  .setName("search")
  .setDescription("Search songs")
  .addStringOption((option) => {
    return option.setName("query")
      .setDescription("Search songs from YoutubeMusic")
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

  const query = interaction.options.getString("query")

  if (query === null) {
    console.error("[VOICE_CHANNEL_WARNING] query song is not valid")
    await interaction.reply("query song is not valid")
    return
  }

  const songs = await searchSong({ query })
  const normalizeSongs = songs.map((s, i) => `\`[${i + 1}]\` **${s.artist}** - ${s.title}`)

  if (songs.length === 0) {
    await interaction.reply("`No results`")
    return
  }

  const optionButtons = new Array(songs.length)
    .fill(0)
    .map((_, index) => (
      new ButtonBuilder()
        .setCustomId(`${index + 1}`)
        .setLabel(`${index + 1}`)
        .setStyle(ButtonStyle.Secondary)
    ))

  const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(...optionButtons)

  const response = await interaction.reply({
    content: normalizeSongs.join("\n"),
    components: [row]
  })

  const collectorFilter = (i: any): boolean => (i.user.id === interaction.user.id)

  try {
    const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })
    const isFirstSongAdded = getNumberOfSongs() === 0
    const song = songs.at(+confirmation.customId - 1)

    if (typeof song === "undefined") {
      await confirmation.update({
        content: "I couldn't add the song",
        components: []
      })
      return
    }

    const responseEmbed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle("Added Song!")
      .setImage(song.thumbnail)
      .setDescription(`${song.artist} - ${song.title}`)

    await confirmation.update({
      content: "",
      components: [],
      embeds: [responseEmbed]
    })

    const newSong = addSong(song)
    isFirstSongAdded && playSong(newSong)
  } catch (e) {
    await interaction.editReply({
      content: "Confirmation not received within 1 minute, cancelling",
      components: []
    })
  }
}
