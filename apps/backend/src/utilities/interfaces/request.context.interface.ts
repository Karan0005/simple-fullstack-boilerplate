import { Request } from 'express';
import { IJWTPayload } from './jwt.payload.interface';

export interface IRequestContext extends Request {
    user: IJWTPayload;
}
