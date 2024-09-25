import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { Event } from './event.entity';
import { EventsService } from './events.sevice';

@Module({
   imports: [
      TypeOrmModule.forFeature([Event,Attendee ]),
   ],
   controllers: [EventsController],
   providers: [EventsService]
 
})
export class EventsModule {}
