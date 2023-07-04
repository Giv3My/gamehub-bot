import { Injectable } from '@nestjs/common';
import {
  Context,
  Options,
  SlashCommand,
  SlashCommandContext,
  StringOption,
} from 'necord';
import { useMainPlayer, useQueue } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

class QueryDto {
  @StringOption({
    name: 'query',
    description: 'Input music name, link, playlist',
    required: true,
  })
  query: string;
}

@Injectable()
export class PlayForceCommand {
  @SlashCommand({
    name: 'play-force',
    description: 'Play force your song',
  })
  async playForce(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query }: QueryDto
  ) {
    const player = useMainPlayer();
    const result = await player.search(query);

    if (!result.hasTracks()) {
      return interaction.reply({
        content: '**No** tracks were found for your query',
        ephemeral: true,
      });
    }

    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (!queue.tracks.data.length) {
      return interaction.reply({
        content: 'There are **no tracks** to **force play**',
        ephemeral: true,
      });
    }

    const track = result.tracks.shift();

    if (track.playlist) {
      return interaction.reply({
        content: 'You can only add **one** track',
        ephemeral: true,
      });
    }

    queue.insertTrack(track);
    queue.node.skip();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#ff8e21')
          .setDescription(
            `**[${track.author} - ${track.title}]** have been added to the Queue`
          )
          .setThumbnail(track.thumbnail)
          .setFooter({
            text: `Duration: ${track.duration}`,
          }),
      ],
    });
  }
}
