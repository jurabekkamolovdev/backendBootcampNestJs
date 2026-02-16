import { Module } from '@nestjs/common';
import { WebModule } from './modules/web/web.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameModel } from './modules/datasource/model/game.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'turnerko',
      password: '2002',
      database: 'games',
      models: [GameModel],
      autoLoadModels: true,
      synchronize: true,
    }),
    WebModule,
  ],
})
export class AppModule {}
