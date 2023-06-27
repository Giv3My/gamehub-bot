import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';
import {
  EmbedBuilder,
  Guild,
  GuildBasedChannel,
  GuildMemberResolvable,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  TextBasedChannel,
  User,
} from 'discord.js';

import { getRolesEmoji, findRole } from './utils';
import { ROLE_BY_EMOJI } from './data';

import { isEmoji } from './guards';
import { RoleObject, ROLES, EMOJIS } from './types';

@Injectable()
export class RolesService {
  @On('ready')
  async generateRolesMessage(@Context() [interaction]: ContextOf<'ready'>) {
    const roles_emoji = getRolesEmoji(interaction.emojis, [
      EMOJIS.stud,
      EMOJIS.game,
      EMOJIS.dev,
    ]);

    const roles = Object.keys(ROLES).reduce(
      (roles, role: keyof typeof ROLES, index) => ({
        ...roles,
        [role]: {
          name: ROLES[role],
          emoji: roles_emoji[index],
        },
      }),
      {} as RoleObject
    );

    const guild = interaction.guilds.cache.reduce((_, guild) => guild, {} as Guild);
    const rolesChannel = guild.channels.cache.find(
      (channel) => channel.name === 'roles'
    ) as TextBasedChannel;
    const isChannelEmpty = (await rolesChannel.messages.fetch()).size === 0;

    if (!isChannelEmpty) {
      return;
    }

    const message = await rolesChannel.send({
      embeds: [
        new EmbedBuilder()
          .setColor('DarkPurple')
          .setTitle('Click on the emojis to take the role')
          .addFields(
            ...Object.entries(roles).map((field) => ({
              name: `${field[1].emoji} - ${field[1].name}`,
              value: '\n',
            }))
          ),
      ],
    });

    Object.values(roles).forEach((role) => {
      message.react(role.emoji);
    });
  }

  private toggleRole = (
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    roleName: ROLES,
    action: 'add' | 'remove'
  ) => {
    const role = findRole(reaction.message.guild.roles, roleName);

    if (action == 'add') {
      reaction.message.guild.members.addRole({
        role,
        user: user as GuildMemberResolvable,
      });
    } else {
      reaction.message.guild.members.removeRole({
        role,
        user: user as GuildMemberResolvable,
      });
    }
  };

  @On('messageReactionAdd')
  roleReactionAdd(@Context() [reaction, user]: ContextOf<'messageReactionAdd'>) {
    if (user.bot || (reaction.message.channel as GuildBasedChannel).name !== 'roles') {
      return;
    }

    if (isEmoji(reaction.emoji.name)) {
      this.toggleRole(reaction, user, ROLE_BY_EMOJI[reaction.emoji.name], 'add');
    }
  }

  @On('messageReactionRemove')
  roleReactionRemove(@Context() [reaction, user]: ContextOf<'messageReactionRemove'>) {
    if (user.bot || (reaction.message.channel as GuildBasedChannel).name !== 'roles') {
      return;
    }

    if (isEmoji(reaction.emoji.name)) {
      this.toggleRole(reaction, user, ROLE_BY_EMOJI[reaction.emoji.name], 'remove');
    }
  }
}
