import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { RolesModule } from 'src/roles/roles.module';
import { MusicPlayerModule } from 'src/music-player/music-player.module';

@Module({
  imports: [RolesModule, MusicPlayerModule],
  providers: [GatewayService],
})
export class GatewayModule {}
