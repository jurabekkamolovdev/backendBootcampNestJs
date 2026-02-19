import { Module } from '@nestjs/common';
import { WebModule } from './modules/web/game/web.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameModel } from './modules/datasource/game/model/game.entity';
import { UserModule } from './modules/domain/user/user.module';
import { AuthModule } from './modules/web/auth/auth.module';

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
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
