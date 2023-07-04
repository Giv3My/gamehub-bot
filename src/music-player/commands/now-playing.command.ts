import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue, useTimeline } from 'discord-player';
import { EmbedBuilder } from 'discord.js';

@Injectable()
export class NowPlayingCommand {
  @SlashCommand({
    name: 'now-playing',
    description: 'Show which music currently playing',
  })
  nowPlaying(@Context() [interaction]: SlashCommandContext) {
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

    const track = queue.currentTrack;

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setColor('#ff8e21')
          .setTitle('💿 Now Playing')
          .setDescription(`[${track.title}](${track.url})`)
          .setThumbnail(track.thumbnail ?? interaction.user.displayAvatarURL())
          .addFields([
            { name: 'Author', value: track.author },
            {
              name: 'Progress',
              value: `${queue.node.createProgressBar()} (${
                timeline.timestamp?.progress
              }%)`,
            },
          ]),
      ],
    });
  }
}
