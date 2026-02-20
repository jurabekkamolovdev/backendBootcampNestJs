import { Module } from '@nestjs/common';
import { WebModule } from './modules/web/game/web.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameModel } from './modules/datasource/game/model/game.entity';
import { AuthModule } from './modules/web/auth/auth.module';
import { UserModel } from './modules/datasource/user/model/user.entity';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'turnerko',
      password: '2002',
      database: 'games',
      models: [GameModel, UserModel],
      autoLoadModels: true,
      synchronize: true,
    }),
    WebModule,
    AuthModule,
  ],
})
export class AppModule {}
