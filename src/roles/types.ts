import { GuildEmoji } from 'discord.js';

export enum ROLES {
  student = 'Student',
  gamer = 'Gamer',
  developer = 'Developer',
  noname = 'Noname',
}

export enum EMOJIS {
  stud = 'stud',
  game = 'game',
  dev = 'dev',
}

export enum REACTION_EVENT {
  add = 'add',
  remove = 'remove',
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
