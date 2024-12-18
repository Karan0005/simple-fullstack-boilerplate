import { ApiProperty } from '@nestjs/swagger';
import { APISuccessResponse, BaseMessage, IBaseResponse } from '../../../utilities';

export class LogoutResponse<T> extends APISuccessResponse<T> implements IBaseResponse<T> {
    @ApiProperty({
        example: {},
        description: BaseMessage.SwaggerMessage.Property.Description.Data
    })
    Data: T;
}
