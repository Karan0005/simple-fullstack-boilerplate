import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseMessage, ControllerExceptionProcessor, IRequestContext } from '../../../utilities';
import { AuthenticationGuard } from '../../shared/services';
import { IGetUserProfileResponse } from '../interfaces';
import { ProfileService } from '../services';
import { GetUserProfileResponse } from '../swagger';

@Controller('user')
@ApiTags('Profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get('profile/v1')
    @ApiBearerAuth()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'User Login' })
    @ApiResponse({
        status: BaseMessage.SwaggerMessage.Response.Ok.Status,
        description: BaseMessage.SwaggerMessage.Response.Ok.Description,
        type: GetUserProfileResponse<IGetUserProfileResponse>
    })
    async getProfile(@Req() request: IRequestContext): Promise<IGetUserProfileResponse> {
        try {
            return await this.profileService.getProfile(request.user.userId);
        } catch (error) {
            throw ControllerExceptionProcessor(error);
        }
    }
}
