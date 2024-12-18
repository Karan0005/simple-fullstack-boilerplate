import { Controller, Post, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BaseMessage, EnvironmentEnum } from '../../../utilities';
import { AuthenticationGuard } from '../../shared/services';
import { LogoutResponse } from '../swagger';

@Controller('user')
@ApiTags('Logout')
export class LogoutController {
    constructor(private readonly configService: ConfigService) {}

    @Post('logout/v1')
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'User Logout' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: LogoutResponse
    })
    async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
        try {
            response.clearCookie('accessToken', {
                sameSite: 'strict',
                httpOnly: true,
                secure: this.configService.get('server.env') !== EnvironmentEnum.LOCAL,
                path: '/'
            });
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }
}
