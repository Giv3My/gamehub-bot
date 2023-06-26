import { Controller } from '@nestjs/common';
import { GatewayService } from './gateway.service';

@Controller('bot-gateway')
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}
}
