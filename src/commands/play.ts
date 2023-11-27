import { type CommandInteraction, SlashCommandBuilder } from "discord.js"

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
  const URL = interaction.options.getString("url")
  await interaction.reply(`Playing ${URL}`)
}
