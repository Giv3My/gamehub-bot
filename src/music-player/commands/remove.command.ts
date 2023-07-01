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
    description: 'Track number to remove',
    min_value: 1,
    required: true,
  })
  trackNumber: number;
}

@Injectable()
export class RemoveCommand {
  @SlashCommand({
    name: 'remove',
    description: 'Remove track from queue',
  })
  remove(
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
        content: 'There are **no tracks** to **remove**',
        ephemeral: true,
      });
    }

    const remove = trackNumber - 1;
    const trackResolvable = queue.tracks.at(remove);

    if (!trackResolvable) {
      return interaction.reply({
        content: "The **requested track** doesn't **exist**",
        ephemeral: true,
      });
    }

    queue.node.remove(trackResolvable);

    return interaction.reply({
      content: `I have **removed** the track: **${trackResolvable.author} - ${trackResolvable.title}**`,
      ephemeral: true,
    });
  }
}
