import { DisconnectCommand } from './disconnect.command';
import { PauseCommand } from './pause.command';
import { PlayCommand } from './play.command';
import { QueueCommand } from './queue.command';
import { SkipCommand } from './skip.command';

export const commands = [
  PlayCommand,
  QueueCommand,
  PauseCommand,
  SkipCommand,
  DisconnectCommand,
];
