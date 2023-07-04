import { GuildMemberManager, GuildChannelManager } from 'discord.js';

export const fetchMember = async (memberManager: GuildMemberManager, userId: string) => {
  return (await memberManager.fetch()).find((member) => member.id === userId);
};

export const findChannel = (channelManager: GuildChannelManager, channelName: string) => {
  return channelManager.cache.find((channel) => channel.name === channelName);
};
