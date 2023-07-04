import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue } from 'discord-player';

@Injectable()
export class ShuffleCommand {
  @SlashCommand({
    name: 'shuffle',
    description: 'Shuffle the queue',
  })
  shuffle(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (queue.tracks.size < 2) {
      return interaction.reply({
        content: 'There are not **enough tracks** in queue to **shuffle**',
        ephemeral: true,
      });
    }

    queue.tracks.shuffle();

    return interaction.reply({
      content: 'I have **shuffled** the queue',
      ephemeral: true,
    });
  }
}
