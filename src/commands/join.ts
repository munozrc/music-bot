import { type CommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js"
import { joinVoiceChannel, getVoiceConnections, VoiceConnectionStatus } from "@discordjs/voice"
import { initAudioPlayer } from "../libs/audio-player"

export const data = new SlashCommandBuilder()
  .setName("join")
  .setDescription("Join bot to a voice channel")
  .addChannelOption((option) => {
    return option.setName("channel")
      .setDescription("The channel to join")
      .addChannelTypes(ChannelType.GuildVoice)
      .setRequired(true)
  })

export async function execute (interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return

  const voiceChannel = interaction.options.getChannel("channel")
  const adapterCreator = interaction.guild?.voiceAdapterCreator
  const guildId = interaction.guildId

  if (
    voiceChannel === null ||
    typeof guildId !== "string" ||
    typeof adapterCreator === "undefined"
  ) {
    console.error("[VOICE_CHANNEL_ERROR] Failed to join bot to voice channel.")
    void interaction.reply("Failed to join bot to voice channel.")
    return
  }

  const connections = getVoiceConnections()
  const numberOfConnections = connections.size

  if (numberOfConnections > 0) {
    console.error("[VOICE_CHANNEL_WARNING] Bot is already in the voice channel.")
    void interaction.reply("The bot is already in the voice channel.")
    return
  }

  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    adapterCreator,
    guildId
  })

  voiceConnection.on(VoiceConnectionStatus.Connecting, () => {
    console.log(`[VOICE_CHANNEL] Connecting to ${voiceChannel.name}...`)
  })

  voiceConnection.on(VoiceConnectionStatus.Ready, () => {
    console.log(`[VOICE_CHANNEL] connection success to ${voiceChannel.name}`)
    void interaction.reply(`Joined to ${voiceChannel.name}`)
    initAudioPlayer(voiceConnection)
  })
}
