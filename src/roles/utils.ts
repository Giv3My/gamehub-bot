import { BaseGuildEmojiManager, Role, RoleManager } from 'discord.js';

import { EMOJIS, ROLES } from './types';

export const getRolesEmoji = (emojiManager: BaseGuildEmojiManager, emojis: EMOJIS[]) => {
  return emojis.map((emoji) => emojiManager.cache.find((item) => item.name === emoji));
};

export const findRole = (roles: RoleManager, roleName: ROLES): Role => {
  return roles.cache.find((role) => role.name.split(' ')[1] === roleName);
};
