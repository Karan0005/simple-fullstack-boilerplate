import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from '../../../utilities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromCookie]),
            ignoreExpiration: false,
            secretOrKey: configService.get('server.secret'),
            algorithms: ['HS256']
        });
    }

    private static extractJWTFromCookie(req: Request): string | null {
        if (req.cookies?.accessToken) {
            return req.cookies.accessToken;
        }
        return null;
    }

    /**
     *
     * @param payload  this jwt payload must have our designed payload
     * @returns here we should validate the token on the basis of its payload and should throw UnauthorizedException if something wrong
     */
    async validate(payload: IJWTPayload): Promise<IJWTPayload> {
        return {
            userId: payload.userId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email
        };
    }
}
