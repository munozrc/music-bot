import { type CommandInteraction, SlashCommandBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong!")

export async function execute (interaction: CommandInteraction): Promise<void> {
  await interaction.reply("Pong!")
}
