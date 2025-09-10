import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

import { ConfirmationTemplate } from '@/mail/templates/confirmation.template';
import { PasswordRecoveryTemplate } from '@/mail/templates/password-recovery.template';

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
	) {}
	private async sendMail(email: string, subject: string, html: string) {
		const name = this.configService.getOrThrow<string>('APPLICATION_NAME');
		const address = this.configService.getOrThrow<string>('MAIL_LOGIN');

		try {
			await this.mailerService.sendMail({
				from: { name, address },
				to: email,
				subject,
				html,
			});
			return { message: 'send email success' };
		} catch {
			throw new ServiceUnavailableException('send email failed');
		}
	}

	public async sendMailEmailConfirmation(email: string, subject: string, link: string) {
		const html = await render(ConfirmationTemplate(link));

		return await this.sendMail(email, subject, html);
	}

	public async sendMailPasswordRecovery(email: string, subject: string, link: string) {
		const html = await render(PasswordRecoveryTemplate(link));

		return await this.sendMail(email, subject, html);
	}
}
