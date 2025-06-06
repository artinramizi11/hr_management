import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mailer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from 'src/common/db/entities/schedule.entity';
import { Attendance } from 'src/common/db/entities/attendance.entity';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[
        TypeOrmModule.forFeature([Schedule,Attendance]),
        MailerModule.forRootAsync({
            inject:[ConfigService],
            useFactory: (configService: ConfigService) => ({
            transport: {
                host: "smtp.gmail.com",
                auth: {
                    user: configService.get("mailer").user,
                    pass: configService.get("mailer").pass
                },
            },
            defaults: {
                from:'"No Reply" <artin.ramizi123@gmail.com>'
            }
        })
        })
    ],
    providers:[MailService],
    exports:[MailService]
})
export class MailModule {}
