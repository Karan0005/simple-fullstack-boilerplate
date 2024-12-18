import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseMessage, HashPassword } from '../../../utilities';
import { JWTService } from '../../shared/services';
import { SignUpDTO } from '../dto';
import { UserDocument, UserEntity } from '../entities';
import { IGetUserProfileResponse } from '../interfaces';

/**
 * Service responsible for handling user signup operations.
 *
 * @remarks
 * This service validates user details, ensures the email is unique, hashes the password,
 * and stores the user data in the database. It also generates an access token (JWT)
 * for authenticated sessions upon successful signup.
 */
@Injectable()
export class SignUpService {
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
     * Handles the basic signup functionality for a new user.
     *
     * @param params - The signup details provided by the user.
     * @returns A promise that resolves to an object containing user details and a JWT access token.
     * @throws BadRequestException if the email provided is already registered.
     *
     * @example
     * ```ts
     * const signUpData: SignUpDTO = {
     *   firstName: 'John',
     *   lastName: 'Doe',
     *   email: 'johndoe@example.com',
     *   password: 'SecurePassword123'
     * };
     *
     * const response = await signUpService.basicSignUp(signUpData);
     * console.log(response);
     * ```
     */
    async signUp(
        params: SignUpDTO
    ): Promise<{ userProfile: IGetUserProfileResponse; accessToken: string }> {
        // Check if the user already exists
        const existingUser: UserDocument | null = await this.userModel.findOne({
            email: params.email
        });

        if (existingUser) {
            // Throw exception if email is already registered
            throw new BadRequestException(BaseMessage.Error.EmailAlreadyRegistered);
        }

        // Hash the user password
        const hashedPassword = await HashPassword(params.password);

        // Create and save the new user document
        const newUser = await new this.userModel({
            firstName: params.firstName,
            lastName: params.lastName,
            email: params.email,
            hashedPassword: hashedPassword
        }).save();

        // Generate JWT access token
        const userId: string = (newUser._id as Types.ObjectId).toString();
        const accessToken: string = await this.jwtService.generateToken({
            userId,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email
        });

        // Return the user details and JWT token
        return {
            userProfile: {
                userId,
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email
            },
            accessToken
        };
    }
}
