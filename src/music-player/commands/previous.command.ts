import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import { useHistory, useQueue } from 'discord-player';

@Injectable()
export class PreviousCommand {
  @SlashCommand({
    name: 'previous',
    description: 'Go back to previous track',
  })
  async previous(@Context() [interaction]: SlashCommandContext) {
    const queue = useQueue(interaction.guildId);
    const history = useHistory(interaction.guildId);

    if (!queue) {
      return interaction.reply({
        content: 'I am **not** in a voice channel',
        ephemeral: true,
      });
    }

    if (!history?.previousTrack)
      return interaction.reply({
        content: 'There is **no** previous track in the **history**',
        ephemeral: true,
      });

    await history.previous();

    return interaction.reply({
      content: '🔁 | I am **replaying** the previous track',
      ephemeral: true,
    });
  }
}
