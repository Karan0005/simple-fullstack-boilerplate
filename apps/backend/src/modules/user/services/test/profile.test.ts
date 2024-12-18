import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { BaseMessage } from '../../../../utilities';
import { UserDocument, UserEntity } from '../../entities';
import { ProfileService } from './../profile.service';

/**
 * Mock for utility function.
 */
jest.mock('../../../../utilities', () => ({
    BaseMessage: {
        Error: {
            EmailNotAlreadyRegistered: 'Email not found.'
        }
    }
}));

/**
 * Mock the User Model for testing.
 */
const mockUserModel = (): Partial<Record<keyof Model<UserDocument>, jest.Mock>> => ({
    findById: jest.fn().mockReturnThis() // This returns the query object
});

describe('ProfileService', () => {
    let profileService: ProfileService;
    let userModel: Partial<Record<keyof Model<UserDocument>, jest.Mock>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                { provide: getModelToken(UserEntity.name), useValue: mockUserModel() }
            ]
        }).compile();

        profileService = module.get<ProfileService>(ProfileService);
        userModel = module.get<Partial<Record<keyof Model<UserDocument>, jest.Mock>>>(
            getModelToken(UserEntity.name)
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve user profile successfully', async () => {
        const userId = new Types.ObjectId().toString();
        const mockUser: Partial<UserDocument> = {
            _id: userId,
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com'
        };

        // Mock the exec method to resolve the mock user document
        userModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUser) // mock exec to resolve the mock user
        });

        // Call the getProfile method
        const result = await profileService.getProfile(userId);

        // Assertions
        expect(userModel.findById).toHaveBeenCalledWith({ _id: userId });
        expect(result).toEqual({
            userId: mockUser._id.toString(),
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email
        });
    });

    it('should throw BadRequestException if user is not found', async () => {
        const userId = new Types.ObjectId().toString();

        // Mock the exec method to resolve null (user not found)
        userModel.findById.mockReturnValue({
            exec: jest.fn().mockResolvedValue(null) // mock exec to resolve null (user not found)
        });

        // Assertions
        await expect(profileService.getProfile(userId)).rejects.toThrow(
            new BadRequestException(BaseMessage.Error.EmailNotAlreadyRegistered)
        );

        expect(userModel.findById).toHaveBeenCalledWith({ _id: userId });
    });
});
