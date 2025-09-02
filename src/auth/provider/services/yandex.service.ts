import { OAuthService } from '@/auth/provider/services/oauth.service';
import { OAuthResponse } from '@/auth/provider/types/oauth-response.types';
import { ProviderOptions } from '@/auth/provider/types/provider-options.types';
import { UserInfo } from '@/auth/provider/types/user-info.types';
import { YANDEX_PROVIDER } from '@/constants/app.constant';

export class YandexService extends OAuthService {
	public constructor(options: ProviderOptions) {
		super({
			name: YANDEX_PROVIDER.name,
			authorizeUrl: YANDEX_PROVIDER.authorizeUrl,
			accessUrl: YANDEX_PROVIDER.accessUrl,
			profileUrl: YANDEX_PROVIDER.profileUrl,
			scopes: options.scopes,
			clientId: options.client_id,
			clientSecret: options.client_secret,
		});
	}

	public extractUserInfo(data: OAuthResponse): UserInfo {
		return super.extractUserInfo({
			name: data.display_name || '',
			email: data?.emails?.[0] || '',
			picture: data.default_avatar_id
				? `https://avatars.yandex.net/get-yapic/${data.default_avatar_id}/islands-200`
				: '',
		});
	}
}
