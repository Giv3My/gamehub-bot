import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On, SlashCommand, SlashCommandContext } from 'necord';
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

import { getRolesEmoji, findRole, fetchMember, getMemberRoles } from './utils';
import { ROLE_BY_EMOJI } from './data';

import { isEmoji } from './guards';
import { RoleObject, ROLES, EMOJIS, REACTION_EVENT } from './types';

@Injectable()
export class RolesService {
  @On('guildMemberAdd')
  addInitialRole(@Context() [member]: ContextOf<'guildMemberAdd'>) {
    if (member.user.bot) {
      return;
    }

    const role = findRole(member.guild.roles, ROLES.noname);
    member.roles.add(role);
  }

  @On('ready')
  async generateRolesMessage(@Context() [interaction]: ContextOf<'ready'>) {
    const roles_emoji = getRolesEmoji(interaction.emojis, [
      EMOJIS.stud,
      EMOJIS.game,
      EMOJIS.dev,
    ]);

    const roles = Object.keys(ROLES)
      .filter((key: keyof typeof ROLES) => key !== 'noname')
      .reduce(
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
            ...Object.values(roles).map((role) => ({
              name: `${role.emoji} - ${role.name}`,
              value: '\n',
            }))
          ),
      ],
    });

    Object.values(roles).forEach((role) => {
      message.react(role.emoji);
    });
  }

  private async toggleRole(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    roleName: ROLES,
    event: REACTION_EVENT
  ) {
    const role = findRole(reaction.message.guild.roles, roleName);

    if (event == REACTION_EVENT.add) {
      await reaction.message.guild.members.addRole({
        role,
        user: user as GuildMemberResolvable,
      });
    } else {
      await reaction.message.guild.members.removeRole({
        role,
        user: user as GuildMemberResolvable,
      });
    }
  }

  private async handleReactionEvent(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
    event: REACTION_EVENT
  ) {
    if (user.bot || (reaction.message.channel as GuildBasedChannel).name !== 'roles') {
      return;
    }

    if (isEmoji(reaction.emoji.name)) {
      const member = await fetchMember(reaction.message.guild.members, user.id);
      const userRoles = getMemberRoles(member);

      if (userRoles.size === 1) {
        await this.toggleRole(
          reaction,
          user,
          ROLES.noname,
          event === REACTION_EVENT.remove ? REACTION_EVENT.add : REACTION_EVENT.remove
        );
      }

      await this.toggleRole(reaction, user, ROLE_BY_EMOJI[reaction.emoji.name], event);
    }
  }

  @On('messageReactionAdd')
  async roleReactionAdd(@Context() [reaction, user]: ContextOf<'messageReactionAdd'>) {
    this.handleReactionEvent(reaction, user, REACTION_EVENT.add);
  }

  @On('messageReactionRemove')
  async roleReactionRemove(
    @Context() [reaction, user]: ContextOf<'messageReactionRemove'>
  ) {
    this.handleReactionEvent(reaction, user, REACTION_EVENT.remove);
  }
}
