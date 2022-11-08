import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class SendMailService {
    private logger: Logger = new Logger(SendMailService.name);
    constructor(private readonly mailerService: MailerService) { }
    
    async sendMail(email: string, code: string) {
        this.mailerService.sendMail({
            to: email,
            from: 'binhtruong9418@gmail.com ',
            subject: 'Verify your email',
            text: "Confirm your email",
            html: `<b>${code}</b>`,
        })
            .then((res) => {
                this.logger.log(res);
            })
            .catch((err) => {
                this.logger.error(err);
            })
    }
}