import { Injectable } from '@nestjs/common';
import {
  Context,
  NumberOption,
  Options,
  SlashCommand,
  SlashCommandContext,
} from 'necord';
import { useQueue } from 'discord-player';

class TrackNumberDto {
  @NumberOption({
    name: 'track-number',
    description: 'Track number to skip to',
    min_value: 1,
    required: true,
  })
  trackNumber: number;
}

@Injectable()
export class SkipToCommand {
  @SlashCommand({
    name: 'skip-to',
    description: 'Skip to the specific track',
  })
  skipTo(
    @Context() [interaction]: SlashCommandContext,
    @Options() { trackNumber }: TrackNumberDto
  ) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (!queue.tracks) {
      return interaction.reply({
        content: 'There are **no tracks** to **skip** to',
        ephemeral: true,
      });
    }

    const skipTo = trackNumber - 1;
    const trackResolvable = queue.tracks.at(skipTo);

    if (!trackResolvable) {
      return interaction.reply({
        content: "The **requested track** doesn't **exist**",
        ephemeral: true,
      });
    }

    queue.node.skipTo(trackResolvable);

    return interaction.reply({
      content: `⏩ | I have **skipped** to the track: **${trackResolvable.author} - ${trackResolvable.title}**`,
      ephemeral: true,
    });
  }
}
