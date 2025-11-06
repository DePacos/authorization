export const PARAM = {
	PROVIDER: 'provider',
	CODE: 'code',
	STATE: 'state',
};

export const ROUTS_PATH = {
	AUTH: {
		ROOT: 'auth',
		REGISTER: 'register',
		LOGIN: 'login',
		LOGOUT: 'logout',
		ME: 'me',
		UPDATE_TOKEN: 'update-token',
		EMAIL_CONFIRMATION: 'email-confirmation',
		EMAIL_CONFIRMATION_RESEND: 'email-confirmation-resend',
		PASSWORD_RESET: 'password-reset',
		PASSWORD_RECOVERY: 'password-recovery',
		PASSWORD_RECOVERY_RESEND: 'password-recovery-resend',
		TWO_FACTOR_AUTH: 'two-factor-auth',
		TWO_FACTOR_AUTH_RESEND: 'two-factor-auth-resend',
		PROVIDER_CONNECT: '/oauth/connect/:' + PARAM.PROVIDER,
		PROVIDER_CALLBACK: '/oauth/callback/:' + PARAM.PROVIDER,
	},
	PROVIDER: {
		CALLBACK: '/auth/oauth/callback/',
	},
	REDIRECT: {
		ROOT: '/',
	},
};
