import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BaseMessage, CryptoFactory, EnvironmentEnum } from '../../../utilities';
import { LoginDTO } from '../dto';
import { IGetUserProfileResponse } from '../interfaces';
import { LoginService } from '../services';
import { LoginResponse } from '../swagger';

@Controller('user')
@ApiTags('Login')
export class LoginController {
    constructor(
        private readonly loginService: LoginService,
        private readonly configService: ConfigService
    ) {}

    @Post('login/v1')
    @ApiOperation({ summary: 'User Login' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: LoginResponse<IGetUserProfileResponse>
    })
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() params: LoginDTO
    ): Promise<IGetUserProfileResponse> {
        try {
            const loginResponse: { userProfile: IGetUserProfileResponse; accessToken: string } =
                await this.loginService.login(params);

            if ('accessToken' in loginResponse && loginResponse.accessToken) {
                response.cookie('accessToken', loginResponse.accessToken, {
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

            return loginResponse.userProfile;
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
