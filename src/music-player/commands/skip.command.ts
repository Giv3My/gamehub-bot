import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue } from 'discord-player';

@Injectable()
export class SkipCommand {
  @SlashCommand({
    name: 'skip',
    description: 'Skip current track',
  })
  skip(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (!queue.currentTrack) {
      return interaction.reply({
        content: 'There is no track **currently** playing',
        ephemeral: true,
      });
    }

    queue.node.skip();

    return interaction.reply({
      content: 'I have **skipped** to the next track',
      ephemeral: true,
    });
  }
}
