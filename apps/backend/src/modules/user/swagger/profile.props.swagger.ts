import { ApiProperty } from '@nestjs/swagger';
import { APISuccessResponse, BaseMessage, IBaseResponse } from '../../../utilities';

export class GetUserProfileResponse<T> extends APISuccessResponse<T> implements IBaseResponse<T> {
    @ApiProperty({
        example: {
            userId: '67614952ff5ca27de5f655b2',
            firstName: 'Sam',
            lastName: 'Crist',
            email: 'sam.crist@fullstack.com'
        },
        description: BaseMessage.SwaggerMessage.Property.Description.Data
    })
    Data: T;
}
