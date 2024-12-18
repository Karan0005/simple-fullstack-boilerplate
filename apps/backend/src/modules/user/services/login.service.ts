import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseMessage, ComparePassword } from '../../../utilities';
import { JWTService } from '../../shared/services';
import { LoginDTO } from '../dto';
import { UserDocument, UserEntity } from '../entities';
import { IGetUserProfileResponse } from '../interfaces';

/**
 * Service responsible for handling user login operations.
 *
 * @remarks
 * This service validates user credentials by verifying the email and password,
 * and generates an access token (JWT) upon successful authentication.
 */
@Injectable()
export class LoginService {
    /**
     * Constructor to inject dependencies.
     *
     * @param userModel - The Mongoose model for the User entity.
     * @param jwtService - Service to handle JWT generation.
     */
    constructor(
        @InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JWTService
    ) {}

    /**
     * Handles user login by verifying credentials.
     *
     * @param params - The login details provided by the user.
     * @returns A promise that resolves to an object containing user details and a JWT access token.
     * @throws BadRequestException if the email is not registered.
     * @throws UnauthorizedException if the password is invalid.
     *
     * @example
     * ```ts
     * const loginData: LoginDTO = {
     *   email: 'johndoe@example.com',
     *   password: 'SecurePassword123'
     * };
     *
     * const response = await loginService.login(loginData);
     * console.log(response);
     * ```
     */
    async login(
        params: LoginDTO
    ): Promise<{ userProfile: IGetUserProfileResponse; accessToken: string }> {
        // Find the user by email
        const user: UserDocument | null = await this.userModel.findOne({ email: params.email });

        if (!user) {
            // Throw exception if email is not registered
            throw new BadRequestException(BaseMessage.Error.EmailNotAlreadyRegistered);
        }

        // Validate the password
        const validPassword = await ComparePassword(params.password, user.hashedPassword);
        if (!validPassword) {
            // Throw exception if password is invalid
            throw new UnauthorizedException(BaseMessage.Error.InvalidPassword);
        }

        // Generate JWT access token
        const userId: string = (user._id as Types.ObjectId).toString();
        const accessToken: string = await this.jwtService.generateToken({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        // Return the user details and JWT token
        return {
            userProfile: {
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            },
            accessToken
        };
    }
}
