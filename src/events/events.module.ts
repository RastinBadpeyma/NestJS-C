import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      TypeOrmModule.forFeature([Event ]),
   ],
   controllers: [EventsController] 
 
})
export class EventsModule {}
