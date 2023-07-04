import { EMOJIS } from './types';

export const isEmoji = (emoji: EMOJIS | string): emoji is EMOJIS => {
  return emoji in EMOJIS;
};
