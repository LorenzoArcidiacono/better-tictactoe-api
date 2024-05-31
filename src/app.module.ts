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
					host: config.get<string>('DB_HOST'),
					port: config.get<number>('DB_PORT'),
					username: config.get<string>('DB_USER'),
					password: config.get<string>('DB_PWD'),
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
