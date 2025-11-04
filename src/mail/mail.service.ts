import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

import { SentMailResponseDto } from '@/auth/dto';
import { ConfirmationTemplate, PasswordRecoveryTemplate, TwoFactorAuthentication } from '@/mail/templates';

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService,
	) {}
	private async sendMail(email: string, subject: string, html: string): Promise<SentMailResponseDto> {
		const name = this.configService.getOrThrow<string>('APPLICATION_NAME');
		const address = this.configService.getOrThrow<string>('MAIL_LOGIN');

		try {
			await this.mailerService.sendMail({
				from: { name, address },
				to: email,
				subject,
				html,
			});
			return { sentMessage: true };
		} catch {
			return { sentMessage: false };
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

	public async sendMailTwoFactorAuth(email: string, subject: string, token: string) {
		const html = await render(TwoFactorAuthentication(token));

		return await this.sendMail(email, subject, html);
	}
}
