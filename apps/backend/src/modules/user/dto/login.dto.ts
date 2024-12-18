import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class LoginDTO {
    @ApiProperty()
    @IsEmail({}, { message: 'Invalid email format.' })
    @IsNotEmpty({ message: 'email is required.' })
    @Length(1, 200, { message: 'email must be between 1 and 200 characters.' })
    email!: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: 'password is required.' })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/, {
        message:
            'password must be between 8 and 20 characters long, include 1 letter, 1 number, and 1 special character.'
    })
    password!: string;
}
