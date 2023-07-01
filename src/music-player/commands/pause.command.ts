import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue, useTimeline } from 'discord-player';

@Injectable()
export class PauseCommand {
  @SlashCommand({
    name: 'pause',
    description: 'Pause/Resume music',
  })
  pause(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);
    const timeline = useTimeline(interaction.guildId);

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

    timeline.paused ? timeline.resume() : timeline.pause();

    return interaction.reply({
      content: `**Playback** has been **${timeline.paused ? 'paused' : 'resumed'}**`,
      ephemeral: true,
    });
  }
}
