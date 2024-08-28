import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Controller('user')
export class UserController {
  
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>
    ){}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.UserRepository.save({
      ...createUserDto,
      when: new Date(createUserDto.when),
    });
  }

  @Get()
  findAll() {
     return this.UserRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id' , ParseIntPipe) id: number) {
     return await this.UserRepository.findOne({where: {id} });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.UserRepository.findOne({where: {id}});
    return await this.UserRepository.save({
      ...user,
      ...updateUserDto,
      when: updateUserDto.when ? new Date(updateUserDto.when) : user.when
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    const user = await this.UserRepository.findOne({where: {id}})
     return await this.UserRepository.delete(user);
  }
}
