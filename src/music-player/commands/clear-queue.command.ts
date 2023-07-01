import { Injectable } from '@nestjs/common';
import { useQueue } from 'discord-player';
import { Context, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class ClearQueueCommand {
  @SlashCommand({
    name: 'clear-queue',
    description: 'Clear queue',
  })
  clearQueue(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }
    if (!queue.tracks) {
      return interaction.reply({
        content: 'There is **nothing** to clear',
        ephemeral: true,
      });
    }

    queue.tracks.clear();
    queue.history.clear();

    return interaction.reply({
      content: 'I have **cleared** the queue',
      ephemeral: true,
    });
  }
}
