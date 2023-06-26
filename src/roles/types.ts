import { GuildEmoji } from 'discord.js';

export enum ROLES {
  student = 'Student',
  gamer = 'Gamer',
  developer = 'Developer',
}

export enum EMOJIS {
  stud = 'stud',
  game = 'game',
  dev = 'dev',
}

export type RolesByReactionsType = {
  [K in keyof typeof EMOJIS]: ROLES;
};

export type RoleObject = {
  [K in keyof typeof ROLES]: {
    name: (typeof ROLES)[K];
    emoji: GuildEmoji;
  };
};
