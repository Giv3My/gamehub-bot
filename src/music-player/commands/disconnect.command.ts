import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue } from 'discord-player';

@Injectable()
export class DisconnectCommand {
  @SlashCommand({
    name: 'disconnect',
    description: 'Remove bot from your voice channel',
  })
  disconnect(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    queue.delete();

    return interaction.reply({
      content: 'I have **successfully disconnected** from the voice channel',
      ephemeral: true,
    });
  }
}
