import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { setAudioPlayerVolume } from "../libs/audio-player"

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Change audio player volume!")
  .addNumberOption((option) => {
    return option.setName("value")
      .setDescription("Value 0 to 100")
      .setRequired(true)
  })

export async function execute (interaction: CommandInteraction): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const value = interaction.options.getNumber("value")

  if (typeof value !== "number" || !setAudioPlayerVolume(value)) {
    await interaction.reply("Value not valid")
    console.error("[VOICE_CHANNEL_WARNING] Volume value is invalid")
    return
  }

  await interaction.reply("Audio player volume changed")
}
