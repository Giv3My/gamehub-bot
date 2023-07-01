import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useQueue } from 'discord-player';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';

@Injectable()
export class QueueCommand {
  @SlashCommand({
    name: 'queue',
    description: 'Show the queue',
  })
  async queue(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (!queue.tracks || !queue.currentTrack) {
      return interaction.reply({
        content: 'There is **no** queue to **display**',
        ephemeral: true,
      });
    }

    const tracksPerPage = 20;
    const totalPages = Math.ceil(queue.tracks.size / tracksPerPage) || 1;

    const tracks = queue.tracks.map(
      (track, idx) => `**${++idx})** [${track?.author} - ${track.title}](${track.url})`
    );

    const paginatedMessage = new PaginatedMessage();

    for (let i = 0; i < totalPages; i++) {
      const list = tracks
        .slice(i * tracksPerPage, i * tracksPerPage + tracksPerPage)
        .join('\n');

      paginatedMessage.addPageEmbed((embed) =>
        embed
          .setColor('#ff8e21')
          .setDescription(
            `**Now Playing:** [${queue.currentTrack?.author} - ${
              queue.currentTrack?.title
            }](${queue.currentTrack?.url})\n\n**QUEUE**\n${
              list === '' ? '\n*• No more queued tracks*' : `\n${list}`
            }`
          )
          .setThumbnail(queue.currentTrack.thumbnail)
          .setFooter({
            text: `${queue.tracks.size} track(s) in queue`,
          })
      );
    }

    return paginatedMessage.run(interaction);
  }
}
