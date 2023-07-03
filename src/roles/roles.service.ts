import { Injectable } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';
import {
  EmbedBuilder,
  GuildBasedChannel,
  GuildChannelManager,
  GuildMemberResolvable,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  RoleManager,
  TextBasedChannel,
  User,
} from 'discord.js';

import { findChannel, fetchMember } from 'src/gateway/utils';
import { getRolesEmoji, findRole, getMemberRoles } from './utils';

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

    const role = findRole(member.guild.roles, ROLES.noname, true);
    member.roles.add(role);
  }

  private async createRolesChannel(
    channelManager: GuildChannelManager,
    roleManager: RoleManager
  ) {
    const role = findRole(roleManager, '@everyone' as ROLES);

    return channelManager.create({
      name: 'roles',
      position: 1,
      permissionOverwrites: [
        {
          id: role.id,
          deny: 'AddReactions',
        },
      ],
    });
  }

  @On('guildCreate')
  async generateRolesMessage(@Context() [guild]: ContextOf<'guildCreate'>) {
    const roles_emoji = getRolesEmoji(guild.emojis, [
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

    let rolesChannel = findChannel(guild.channels, 'roles') as TextBasedChannel;

    if (!rolesChannel) {
      rolesChannel = await this.createRolesChannel(guild.channels, guild.roles);
    }

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
    const role = findRole(reaction.message.guild.roles, roleName, true);

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
      const userRoles = getMemberRoles(member, ['everyone']);
      const isMemberAdmin = findRole(member.roles, 'Admin' as ROLES, true);

      if (userRoles.size === 1 && !isMemberAdmin) {
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
