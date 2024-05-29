import { Module } from '@nestjs/common';
import { InfoModule } from './info/info.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Info } from './info/info.entity';

@Module({
  imports: [
    InfoModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 8889,
      username: 'root',
      password: 'password',
      database: 'test',
      entities: [Info],
      synchronize: false,
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
