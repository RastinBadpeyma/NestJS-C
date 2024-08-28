import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events/events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './events/event.entity';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { EventsModule } from './events/events.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'example',
    database: 'nest-events',
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
