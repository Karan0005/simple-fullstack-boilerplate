import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JWT from 'jsonwebtoken';
import { BaseMessage, IJWTPayload, IKeyValueString } from '../../../utilities';

@Injectable()
export class JWTService {
    constructor(private readonly configService: ConfigService) {}

    async generateToken(payload?: IJWTPayload): Promise<string> {
        try {
            return JWT.sign(payload ?? {}, this.configService.get('server.secret'), {
                expiresIn: '1d',
                algorithm: 'HS256'
            });
        } catch (error) {
            throw new BadRequestException(BaseMessage.Error.BackendGeneral);
        }
    }

    async verifyToken(token: string): Promise<IKeyValueString> {
        try {
            return JWT.verify(token, this.configService.get('server.secret')) as IKeyValueString;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async decodeToken(token: string): Promise<IKeyValueString> {
        try {
            return JWT.decode(token) as IKeyValueString;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
