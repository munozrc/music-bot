import { type CommandInteraction, SlashCommandBuilder } from "discord.js"
import { queue } from "../libs/queue-manager"

export const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Show play queue")

export async function execute (interaction: CommandInteraction): Promise<void> {
  const isEmptyQueue = queue.length === 0
  const parseQueue = queue.map((s, i) => `\`[${i + 1}]\` **${s.artist}** - ${s.title}`)
  await interaction.reply(isEmptyQueue ? "`No songs`" : parseQueue.join("\n"))
}
