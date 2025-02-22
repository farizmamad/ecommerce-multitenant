import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MailerModule.forRootAsync({
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
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
