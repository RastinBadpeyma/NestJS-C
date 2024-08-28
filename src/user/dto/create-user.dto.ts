import { IsDateString, IsString,Length  } from "class-validator";

export class CreateUserDto {
  @IsString()
  @Length(5, 255, { message: 'The username length is wrong' })   
  userName: string;
  @Length(5, 255) 
  lastName:string;
  @IsDateString()
   when: string;
}
