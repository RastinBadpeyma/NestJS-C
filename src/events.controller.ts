import { Body, Controller, Delete, Get, HttpCode, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';

@Controller('/events')
export class EventsController {

   constructor(
     @InjectRepository(Event)

     // Repository<Event> : its a class or interface that we can use Event CRUD 
     private readonly repository: Repository<Event> 
   ){}

   @Get()
   async findAll(){
     return await this.repository.find();
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
     return await this.repository.findOne({ where: { id } });
   }
   @Post()
  async create(@Body() input: CreateEventDto) {
      return await this.repository.save( {
         ...input,
         when: new Date(input.when),
       
      })
   }
   @Patch(':id')
   async update(@Param('id') id:number , @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne({ where: { id } });
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
   return await this.repository.delete(event);
   }


}
