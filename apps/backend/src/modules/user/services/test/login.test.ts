import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { BaseMessage, ComparePassword } from '../../../../utilities';
import { JWTService } from '../../../shared/services';
import { LoginDTO } from '../../dto';
import { UserDocument, UserEntity } from '../../entities';
import { LoginService } from './../login.service';

/**
 * Mock the User Model for testing.
 */
const mockUserModel = (): Partial<Record<keyof Model<UserDocument>, jest.Mock>> => ({
    findOne: jest.fn()
});

/**
 * Mock the JWTService.
 */
const mockJWTService = () => ({
    generateToken: jest.fn()
});

/**
 * Mock for utility function.
 */
jest.mock('../../../../utilities', () => ({
    ComparePassword: jest.fn(),
    BaseMessage: {
        Error: {
            EmailNotAlreadyRegistered: 'Email not found.',
            InvalidPassword: 'Invalid password.'
        }
    }
}));

describe('LoginService', () => {
    let loginService: LoginService;
    let userModel: Partial<Record<keyof Model<UserDocument>, jest.Mock>>;
    let jwtService: JWTService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginService,
                { provide: getModelToken(UserEntity.name), useValue: mockUserModel() },
                { provide: JWTService, useValue: mockJWTService() }
            ]
        }).compile();

        loginService = module.get<LoginService>(LoginService);
        userModel = module.get<Partial<Record<keyof Model<UserDocument>, jest.Mock>>>(
            getModelToken(UserEntity.name)
        );
        jwtService = module.get<JWTService>(JWTService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should log in successfully with valid credentials', async () => {
        const loginDTO: LoginDTO = {
            email: 'johndoe@example.com',
            password: 'SecurePassword123'
        };

        const mockUser: Partial<UserDocument> = {
            _id: new Types.ObjectId(),
            email: 'johndoe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            hashedPassword: 'hashedpassword123'
        };

        // Mock dependencies
        userModel.findOne.mockResolvedValue(mockUser);
        (ComparePassword as jest.Mock).mockResolvedValue(true);
        (jwtService.generateToken as jest.Mock).mockResolvedValue('mocked.jwt.token'); // Cast to jest.Mock

        // Call the login method
        const result = await loginService.login(loginDTO);

        // Assertions
        expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDTO.email });
        expect(ComparePassword).toHaveBeenCalledWith(loginDTO.password, mockUser.hashedPassword);
        expect(jwtService.generateToken).toHaveBeenCalledWith({
            userId: mockUser._id.toString(),
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email
        });
        expect(result).toEqual({
            userProfile: {
                userId: mockUser._id.toString(),
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                email: mockUser.email
            },
            accessToken: 'mocked.jwt.token'
        });
    });

    it('should throw BadRequestException if email is not registered', async () => {
        const loginDTO: LoginDTO = {
            email: 'notfound@example.com',
            password: 'InvalidPassword'
        };

        // Mock no user found
        userModel.findOne.mockResolvedValue(null);

        // Assertions
        await expect(loginService.login(loginDTO)).rejects.toThrow(
            new BadRequestException(BaseMessage.Error.EmailNotAlreadyRegistered)
        );

        expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDTO.email });
        expect(ComparePassword).not.toHaveBeenCalled();
        expect(jwtService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
        const loginDTO: LoginDTO = {
            email: 'johndoe@example.com',
            password: 'WrongPassword'
        };

        const mockUser: Partial<UserDocument> = {
            _id: new Types.ObjectId(),
            email: 'johndoe@example.com',
            hashedPassword: 'hashedpassword123'
        };

        // Mock user found but password is invalid
        userModel.findOne.mockResolvedValue(mockUser);
        (ComparePassword as jest.Mock).mockResolvedValue(false);

        // Assertions
        await expect(loginService.login(loginDTO)).rejects.toThrow(
            new UnauthorizedException(BaseMessage.Error.InvalidPassword)
        );

        expect(userModel.findOne).toHaveBeenCalledWith({ email: loginDTO.email });
        expect(ComparePassword).toHaveBeenCalledWith(loginDTO.password, mockUser.hashedPassword);
        expect(jwtService.generateToken).not.toHaveBeenCalled();
    });
});
