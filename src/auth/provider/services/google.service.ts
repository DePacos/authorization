import { OAuthService } from '@/auth/provider/services/oauth.service';
import { OAuthResponse } from '@/auth/provider/types/oauth-response.types';
import { ProviderOptions } from '@/auth/provider/types/provider-options.types';
import { UserInfo } from '@/auth/provider/types/user-info.types';
import { GOOGLE_PROVIDER } from '@/constants/app.constant';

export class GoogleService extends OAuthService {
	public constructor(options: ProviderOptions) {
		super({
			name: GOOGLE_PROVIDER.name,
			authorizeUrl: GOOGLE_PROVIDER.authorizeUrl,
			accessUrl: GOOGLE_PROVIDER.accessUrl,
			profileUrl: GOOGLE_PROVIDER.profileUrl,
			scopes: options.scopes,
			clientId: options.client_id,
			clientSecret: options.client_secret,
		});
	}

	public extractUserInfo(data: OAuthResponse): UserInfo {
		return super.extractUserInfo({
			name: data.name,
			email: data.email,
			picture: data.picture,
		});
	}
}
