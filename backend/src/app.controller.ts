import {  Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MailService } from './mailer/mailer.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService, 
    private mailService: MailService
  ) {}



 




  





}
