import { Injectable } from '@nestjs/common';
import {
  Context,
  Options,
  SlashCommand,
  SlashCommandContext,
  StringOption,
} from 'necord';
import { useMainPlayer } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

import { fetchMember } from 'src/gateway/utils';

class QueryDto {
  @StringOption({
    name: 'query',
    description: 'Input music name, link, playlist',
    required: true,
  })
  query: string;
}

@Injectable()
export class PlayCommand {
  @SlashCommand({
    name: 'play',
    description: 'Play your song or playlist',
  })
  async play(
    @Context() [interaction]: SlashCommandContext,
    @Options() { query }: QueryDto
  ) {
    const member = await fetchMember(
      interaction.guild.members,
      interaction.member.user.id
    );

    if (!member.voice.channel) {
      return await interaction.reply({
        content: 'You must be in a **voice channel** to use this command',
        ephemeral: true,
      });
    }

    const player = useMainPlayer();
    const result = await player.search(query);

    if (!result.hasTracks()) {
      return interaction.reply({
        content: '**No** tracks were found for your query',
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const { track } = await player.play(member.voice.channel, result, {
        nodeOptions: {
          metadata: interaction,
          bufferingTimeout: 0,
          volume: 10,
          leaveOnEndCooldown: 1000 * 60 * 10,
          leaveOnEmptyCooldown: 1000 * 60 * 10,
        },
      });

      return interaction.followUp({
        embeds: track.playlist
          ? [
              new EmbedBuilder()
                .setColor('#ff8e21')
                .setDescription(
                  `**${track.playlist.tracks.length} songs from [${track.playlist.title}]** have been added to the Queue`
                )
                .setThumbnail(track.playlist.thumbnail)
                .setFooter({
                  text: `Duration: ${track.playlist.durationFormatted}`,
                }),
            ]
          : [
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
    } catch (e) {
      return interaction.reply({
        content: 'An error occurred while executing the request',
        ephemeral: true,
      });
    }
  }
}
