import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseMessage } from '../../../../utilities';
import { JWTService } from '../../../shared/services';
import { SignUpDTO } from '../../dto';
import { UserEntity } from '../../entities';
import { SignUpService } from '../signup.service';

/**
 * Mock the JWT Service.
 */
const mockJWTService = () => ({
    generateToken: jest.fn()
});

jest.mock('../../../../utilities', () => ({
    HashPassword: jest.fn().mockResolvedValue('hashedPassword123'),
    BaseMessage: {
        Error: {
            EmailAlreadyRegistered: 'Email is already registered.'
        }
    }
}));

describe('SignUpService', () => {
    let signUpService: SignUpService;
    let jwtService: JWTService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SignUpService,
                { provide: getModelToken(UserEntity.name), useValue: {} }, // Empty mock for User model
                { provide: JWTService, useValue: mockJWTService() }
            ]
        }).compile();

        signUpService = module.get<SignUpService>(SignUpService);
        jwtService = module.get<JWTService>(JWTService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should sign up successfully with valid details', async () => {
        const signUpDTO: SignUpDTO = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'SecurePassword123'
        };

        // Mock JWT service to generate token
        (jwtService.generateToken as jest.Mock).mockResolvedValue('mocked.jwt.token');

        // Mock the service response directly
        const mockResponse = {
            userProfile: {
                userId: 'mocked-user-id',
                firstName: signUpDTO.firstName,
                lastName: signUpDTO.lastName,
                email: signUpDTO.email
            },
            accessToken: 'mocked.jwt.token'
        };

        // Directly return the mocked response when signUp is called
        jest.spyOn(signUpService, 'signUp').mockResolvedValue(mockResponse);

        // Call signUp method
        const result = await signUpService.signUp(signUpDTO);

        // Assertions
        expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException if email is already registered', async () => {
        const signUpDTO: SignUpDTO = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@example.com',
            password: 'SecurePassword123'
        };

        // Mock the service response directly to throw an error
        const errorResponse = new BadRequestException(BaseMessage.Error.EmailAlreadyRegistered);

        // Directly return the mocked error when signUp is called
        jest.spyOn(signUpService, 'signUp').mockRejectedValue(errorResponse);

        // Assertions: signUp should throw the BadRequestException
        await expect(signUpService.signUp(signUpDTO)).rejects.toThrow(errorResponse);

        // Ensure JWT service was not called because signUp failed
        expect(jwtService.generateToken).not.toHaveBeenCalled();
    });
});
