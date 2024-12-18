import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard, JWTService, JwtStrategy } from './services';

@Global()
@Module({
    imports: [JwtModule],
    providers: [JwtStrategy, AuthenticationGuard, JWTService],
    exports: [JwtStrategy, AuthenticationGuard, JWTService]
})
export class SharedModule {}
