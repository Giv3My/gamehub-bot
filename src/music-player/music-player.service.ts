import { Injectable } from '@nestjs/common';
import { Context, ContextOf, Once, StringOption } from 'necord';
import { Player } from 'discord-player';
import { VoiceConnectionStatus } from '@discordjs/voice';

@Injectable()
export class MusicPlayerService {
  @Once('ready')
  onReady(@Context() [client]: ContextOf<'ready'>) {
    const player = new Player(client, {
      ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      },
    });

    player.extractors.loadDefault();

    player.events.on('connection', (queue) => {
      queue.dispatcher.voiceConnection.on('stateChange', (oldState, newState) => {
        if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
        ) {
          queue.dispatcher.voiceConnection.configureNetworking();
        }
      });
    });
  }
}
