import { Body, Controller, Delete, Get, HttpCode, Inject, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe   } from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './input/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, RelationId, Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { EventsService } from './events.service';
import { ListEvents } from "./input/list.events";

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

   constructor(
     @InjectRepository(Event)
     private readonly repository: Repository<Event>,
     @InjectRepository(Attendee)
     private readonly AttendeeRepository: Repository<Attendee>,
     private readonly eventsService: EventsService
   ){}

   @Get()
   @UsePipes(new ValidationPipe({ transform: true }))
   async findAll(@Query() filter: ListEvents){
    const events = await this.eventsService
    .getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 2
      }
    );
  return events;
   }

   @Get('/practice')
   async practice() {
     return await this.repository.find({
       select: ['id', 'when'],
       where: [{
        //select * FROM event WHERE event.id >  3
         id: MoreThan(3),
         when: MoreThan(new Date('2021-02-12T13:00:00'))
       }, {
         description: Like('%meet%')
       }],
       take: 2,
       order: {
         id: 'DESC'
       }
     });
   }

   @Get('practice2')
   async practice2(){
       // return await this.repository.findOne(
    //   1,
    //   { relations: ['attendees'] }
    // );
  
    // const event = new Event();
    // event.id = 1;

    // const attendee = new Attendee();
    // attendee.name = 'Using cascade';
    // attendee.event = event;

    // event.attendees.push(attendee);
    // event.attendees = [];

    // await this.attendeeRepository.save(attendee);
    // await this.repository.save(event);

    // return event;

     return await this.repository.createQueryBuilder('e')
     .select(['e.id' , 'e.name'])
     .orderBy('e.id' , 'ASC')
     .take(3)
     .getMany();
   }

   @Get(':id')
   async findOne(@Param('id' , ParseIntPipe) id: number){
   const event = await this.eventsService.getEvent(id);

     if(!event){
         throw new NotFoundException();
     }

     return event;
   }

   // You can also use the @UsePipes decorator to enable pipes.
  // It can be done per method, or for every method when you
  // add it at the controller level.
  //new ValidationPipe({ groups: ['create'] })
   @Post()
  async create(@Body() input: CreateEventDto) {
      return await this.repository.save( {
         ...input,
         when: new Date(input.when),
       
      })
   }

  // Create new ValidationPipe to specify validation group inside @Body
  // new ValidationPipe({ groups: ['update'] })
   @Patch(':id')
   async update(@Param('id') id:number , @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne({ where: { id } });

    if(!event){
      throw new NotFoundException();
  }

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });
   }
   @Delete(':id')
   @HttpCode(204)
   async remove(@Param('id') id : number){
    const result = await this.eventsService.deleteEvent(id);

    if(result?.affected !== 1){   
      // ?. => it's Optional Chaining
      throw new NotFoundException();
    }
   }


}
