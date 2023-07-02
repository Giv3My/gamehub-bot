import {
  BaseGuildEmojiManager,
  GuildMember,
  GuildMemberRoleManager,
  RoleManager,
} from 'discord.js';

import { EMOJIS, ROLES } from './types';

export const getRolesEmoji = (emojiManager: BaseGuildEmojiManager, emojis: EMOJIS[]) => {
  return emojis.map((emoji) => emojiManager.cache.find((item) => item.name === emoji));
};

export const findRole = (
  roles: RoleManager | GuildMemberRoleManager,
  roleName: ROLES,
  withEmoji?: boolean
) => {
  return roles.cache.find((role) => {
    return (withEmoji ? role.name.split(' ')[1] : role.name) === roleName;
  });
};

export const getMemberRoles = (member: GuildMember, excludeRoles: string[]) => {
  return member.roles.cache.filter(
    (role) => !excludeRoles.some((roleName) => role.name.includes(roleName))
  );
};
