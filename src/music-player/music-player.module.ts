import { Module } from '@nestjs/common';
import { MusicPlayerService } from './music-player.service';
import { commands } from './commands';

@Module({
  providers: [MusicPlayerService, ...commands],
})
export class MusicPlayerModule {}
