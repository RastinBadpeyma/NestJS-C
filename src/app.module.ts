import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import { SchoolModule } from './school/school.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      useFactory: process.env.NODE_ENV !== 'production'
        ? ormConfig : ormConfigProd
  }),
  AuthModule,
  EventsModule,
  SchoolModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
