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
    description: 'Track number to jump to',
    min_value: 1,
    required: true,
  })
  trackNumber: number;
}

@Injectable()
export class JumpCommand {
  @SlashCommand({
    name: 'jump',
    description: 'Jump to the specific track',
  })
  jump(
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
        content: 'There are **no tracks** to **jump** to',
        ephemeral: true,
      });
    }

    const jumpTo = trackNumber - 1;
    const trackResolvable = queue.tracks.at(jumpTo);

    if (!trackResolvable) {
      return interaction.reply({
        content: "The **requested track** doesn't **exist**",
        ephemeral: true,
      });
    }

    queue.node.jump(trackResolvable);

    return interaction.reply({
      content: `⏩ | I have **jumped** to the track: **${trackResolvable.author} - ${trackResolvable.title}**`,
      ephemeral: true,
    });
  }
}
