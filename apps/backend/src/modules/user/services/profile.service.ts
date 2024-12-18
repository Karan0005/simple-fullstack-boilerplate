import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseMessage } from '../../../utilities';
import { UserDocument, UserEntity } from '../entities';
import { IGetUserProfileResponse } from '../interfaces';

/**
 * Service responsible for retrieving user profile information.
 *
 * @remarks
 * This service fetches user profile details such as user ID, first name, last name, and email
 * based on the provided user ID.
 */
@Injectable()
export class ProfileService {
    /**
     * Constructor to inject the user model dependency.
     *
     * @param userModel - The Mongoose model for the User entity.
     */
    constructor(@InjectModel(UserEntity.name) private readonly userModel: Model<UserDocument>) {}

    /**
     * Retrieves the profile information of a user.
     *
     * @param userId - The unique identifier of the user.
     * @returns A promise that resolves to the user profile information.
     *
     * @example
     * ```ts
     * const userId = '609e1250b17d4b1a8c1b4567';
     * const profile = await profileService.getProfile(userId);
     * console.log(profile);
     * ```
     *
     * @throws Error if the user is not found or there is a database issue.
     */
    async getProfile(userId: string): Promise<IGetUserProfileResponse> {
        // Retrieve the user document from the database using the user ID
        const user: UserDocument = await this.userModel.findById({ _id: userId }).exec();

        // Check if user is null and throw an error with a proper message
        if (!user) {
            throw new BadRequestException(BaseMessage.Error.EmailNotAlreadyRegistered);
        }

        // Return user profile details
        return {
            userId: user._id as string,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }
}
