import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailerModule as NestJSMailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    NestJSMailerModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          transport: {
            host: configService.getOrThrow('EMAIL_HOST'),
            port: configService.getOrThrow('EMAIL_PORT'),
            auth: {
              user: configService.getOrThrow('EMAIL_USERNAME'),
              pass: configService.getOrThrow('EMAIL_PASSWORD'),
            },
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}
