import { Injectable } from '@nestjs/common';
import { useQueue, useTimeline } from 'discord-player';
import {
  Context,
  IntegerOption,
  Options,
  SlashCommand,
  SlashCommandContext,
} from 'necord';

class VolumeDto {
  @IntegerOption({
    name: 'amount',
    description: 'Set the player volume',
    min_value: 0,
    max_value: 200,
  })
  volume: number;
}

@Injectable()
export class VolumeCommand {
  @SlashCommand({
    name: 'volume',
    description: "Set bot's audio volume",
  })
  setVolume(
    @Context() [interaction]: SlashCommandContext,
    @Options() { volume }: VolumeDto
  ) {
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

    if (!volume) {
      return interaction.reply({
        content: `🔊 | **Current** volume is **${timeline.volume}%**`,
      });
    }

    timeline.setVolume(volume!);

    return interaction.reply({
      content: `I **changed** the volume to: **${timeline.volume}%**`,
    });
  }
}
