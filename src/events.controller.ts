import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post } from '@nestjs/common';
import { CreateEventDto } from './create-event.dto';
import { Event } from './event.entity';
import { UpdateEventDto } from './update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
   @Get(':id')
   async findOne(@Param('id') id){
     return await this.repository.findOne(id);
   }
   @Post()
  async create(@Body() input: CreateEventDto) {
      return await this.repository.save( {
         ...input,
         when: new Date(input.when),
       
      })
   }
   @Patch(':id')
   async update(@Param('id') id , @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);
    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    });
   }
   @Delete(':id')
   @HttpCode(204)
   async remove(@Param('id') id){
    const event = await this.repository.findOne(id);
   return await this.repository.delete(event);
   }
}
