import { Body, Controller, Delete, Get, HttpCode, Inject, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

   constructor(
     @InjectRepository(Event)

     // Repository<Event> : its a class or interface that we can use Event CRUD 
     private readonly repository: Repository<Event> 
   ){}

   @Get()
   async findAll(){
    this.logger.log(`Hit the findAll route`);
    const events = await this.repository.find();
    this.logger.debug(`Found ${events.length} events`);
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

   @Get(':id')
   async findOne(@Param('id' , ParseIntPipe) id: number){
   const event = await this.repository.findOne({ where: { id } });

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
    const event = await this.repository.findOne({ where: { id } });

    if(!event){
      throw new NotFoundException();
    }

   return await this.repository.delete(event);
   }


}
