import { type CommandInteraction, SlashCommandBuilder, ChannelType } from "discord.js"
import { joinVoiceChannel } from "@discordjs/voice"

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
    await interaction.reply("Failed to join bot to voice channel.")
    return
  }

  joinVoiceChannel({
    guildId,
    adapterCreator,
    channelId: voiceChannel.id
  })

  await interaction.reply("The bot joined the voice channel.")
}
