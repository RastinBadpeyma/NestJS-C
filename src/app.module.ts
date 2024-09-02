import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    entities: [Event , User],
    //automatically updates the database schema
    synchronize: true,
  }),
 
  EventsModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
