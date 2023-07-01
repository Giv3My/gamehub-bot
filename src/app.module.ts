import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntentsBitField } from 'discord.js';
import { NecordModule } from 'necord';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    NecordModule.forRootAsync({
      useFactory: async () => ({
        token: process.env.BOT_TOKEN,
        intents: [
          IntentsBitField.Flags.Guilds,
          IntentsBitField.Flags.GuildMessages,
          IntentsBitField.Flags.DirectMessages,
          IntentsBitField.Flags.GuildMembers,
          IntentsBitField.Flags.GuildEmojisAndStickers,
          IntentsBitField.Flags.GuildMessageReactions,
          IntentsBitField.Flags.GuildVoiceStates,
        ],
      }),
    }),
    GatewayModule,
  ],
  providers: [AppService],
})
export class AppModule {}
