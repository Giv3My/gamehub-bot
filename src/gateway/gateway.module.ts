import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [RolesModule],
  providers: [GatewayService],
})
export class GatewayModule {}
