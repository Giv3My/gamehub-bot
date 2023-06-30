import {
  BaseGuildEmojiManager,
  GuildMember,
  GuildMemberManager,
  RoleManager,
} from 'discord.js';

import { EMOJIS, ROLES } from './types';

export const getRolesEmoji = (emojiManager: BaseGuildEmojiManager, emojis: EMOJIS[]) => {
  return emojis.map((emoji) => emojiManager.cache.find((item) => item.name === emoji));
};

export const findRole = (roles: RoleManager, roleName: ROLES) => {
  return roles.cache.find((role) => role.name.split(' ')[1] === roleName);
};

export const fetchMember = async (memberManager: GuildMemberManager, userId: string) => {
  return (await memberManager.fetch()).find((member) => member.id === userId);
};

export const getMemberRoles = (member: GuildMember) => {
  return member.roles.cache.filter((role) => !role.name.includes('everyone'));
};
