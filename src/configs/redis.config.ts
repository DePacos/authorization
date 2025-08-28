import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

export const getRedisConfig = async (configService: ConfigService) => {
	const client = createClient({ url: configService.getOrThrow<string>('REDIS_URI') });
	await client.connect();

	return new RedisStore({
		client,
		prefix: configService.getOrThrow<string>('SESSION_PREFIX'),
	});
};
