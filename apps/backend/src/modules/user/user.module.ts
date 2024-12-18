import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConnectionFactory } from '../../utilities';
import {
    LoginController,
    LogoutController,
    ProfileController,
    SignUpController
} from './controllers';
import { UserEntity, UserSchema } from './entities';
import { LoginService, ProfileService, SignUpService } from './services';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
        MongooseModule.forRootAsync({ useFactory: MongoConnectionFactory, inject: [ConfigService] })
    ],
    controllers: [SignUpController, LoginController, ProfileController, LogoutController],
    providers: [SignUpService, LoginService, ProfileService]
})
export class UserModule {}
