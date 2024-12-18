import { Body, Controller, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
    BaseMessage,
    ControllerExceptionProcessor,
    CryptoFactory,
    EnvironmentEnum
} from '../../../utilities';
import { SignUpDTO } from '../dto';
import { IGetUserProfileResponse } from '../interfaces';
import { SignUpService } from '../services';
import { SignUpResponse } from '../swagger';

@Controller('user')
@ApiTags('SignUp')
export class SignUpController {
    constructor(
        private readonly signUpService: SignUpService,
        private readonly configService: ConfigService
    ) {}

    @Post('signup/v1')
    @ApiOperation({ summary: 'User SignUp' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: SignUpResponse<IGetUserProfileResponse>
    })
    async signUp(
        @Res({ passthrough: true }) response: Response,
        @Body() params: SignUpDTO
    ): Promise<IGetUserProfileResponse> {
        try {
            const signUpResponse: { userProfile: IGetUserProfileResponse; accessToken: string } =
                await this.signUpService.signUp(params);

            if ('accessToken' in signUpResponse && signUpResponse.accessToken) {
                response.cookie('accessToken', signUpResponse.accessToken, {
                    httpOnly: true,
                    secure: this.configService.get('server.env') !== EnvironmentEnum.LOCAL,
                    sameSite: 'strict',
                    encode: (cookie: string) => {
                        return CryptoFactory.Encrypt(
                            this.configService.get('server.secret'),
                            cookie
                        );
                    },
                    path: '/',
                    expires: undefined
                });
            }

            return signUpResponse.userProfile;
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }
}
