import { DisconnectCommand } from './disconnect.command';
import { NowPlayingCommand } from './now-playing.command';
import { PauseCommand } from './pause.command';
import { PlayCommand } from './play.command';
import { PlayForceCommand } from './play-force.command';
import { QueueCommand } from './queue.command';
import { VolumeCommand } from './volume.command';
import { SkipCommand } from './skip.command';
import { ClearQueueCommand } from './clear-queue.command';
import { SkipToCommand } from './skip-to.command';
import { JumpCommand } from './jump.command';
import { ShuffleCommand } from './shuffle.command';
import { PreviousCommand } from './previous.command';
import { RemoveCommand } from './remove.command';

export const commands = [
  PlayCommand,
  PlayForceCommand,
  QueueCommand,
  PauseCommand,
  SkipCommand,
  SkipToCommand,
  JumpCommand,
  PreviousCommand,
  NowPlayingCommand,
  VolumeCommand,
  ShuffleCommand,
  RemoveCommand,
  ClearQueueCommand,
  DisconnectCommand,
];
