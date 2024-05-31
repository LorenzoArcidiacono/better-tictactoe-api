import { Module } from '@nestjs/common';
import { InfoModule } from './info/info.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './info/info.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'process';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
		}),
		InfoModule,
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: 'mysql',
					host: 'localhost',
					port: 8889,
					username: 'root',
					password: 'password',
					database: config.get<string>('DB_NAME'),
					entities: [Info],
					synchronize: false,
				};
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
