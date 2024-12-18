/* eslint-disable no-console */
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import basicAuth from 'express-basic-auth';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { LoggerTransports } from './config';
import { AppModule } from './modules/app.module';
import { BaseMessage, CryptoFactory, ExceptionProcessor, ResponseProcessor } from './utilities';

async function bootstrap() {
    // Initialize a Winston logger for the application
    const appLogger = WinstonModule.createLogger({
        format: winston.format.uncolorize(),
        transports: LoggerTransports
    });

    // Create a new NestJS Express application
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: true,
        rawBody: true
    });

    // Fetch configuration values for routes and server settings
    const configService = app.get(ConfigService);
    const routePrefix = configService.get('server.routePrefix') || 'api';
    const serverSecret: string = configService.get('server.secret');
    const apiBaseURL: string = configService.get('server.apiBaseURL');

    // Enable CORS with allowed origins, methods, and headers
    app.enableCors({
        origin: configService.get('server.appBaseURL'),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true
    });

    // Allow URL-encoded data parsing for incoming requests
    app.use(express.urlencoded({ extended: true }));

    // Setting Up Access Token from Cookie
    app.use(
        cookieParser(undefined, {
            decode: (encryptedCookie: string) => {
                return CryptoFactory.Decrypt(configService.get('server.secret'), encryptedCookie);
            }
        })
    );

    // Apply global exception filter and response interceptor
    app.useGlobalFilters(new ExceptionProcessor(appLogger));
    app.useGlobalInterceptors(new ResponseProcessor());

    // Use custom logger for logging across the app
    app.useLogger(appLogger);

    // Set a global route prefix (e.g., '/api')
    app.setGlobalPrefix(routePrefix);

    // Apply global validation with transformation and strict whitelisting
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );

    // Set up basic authentication for accessing Swagger documentation
    app.use(
        ['/' + routePrefix + '/swagger', '/' + routePrefix + '/swagger-json'],
        basicAuth({
            users: {
                developer: serverSecret
            },
            challenge: true
        })
    );

    // Configure Swagger documentation settings
    const options = new DocumentBuilder()
        .setTitle('Backend App')
        .setDescription('API Documentation')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addServer(apiBaseURL)
        .build();

    // Generate the Swagger document and set up the endpoint
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(routePrefix + '/swagger', app, document);

    // Apply Helmet for security (e.g., XSS prevention, frameguard, HSTS)
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'default-src': ["'none'"],
                    'script-src': ["'self'"],
                    'style-src': ["'self'", "'unsafe-inline'"],
                    'img-src': ["'self'", 'data:'],
                    'font-src': ["'self'"],
                    'connect-src': ["'self'"],
                    'media-src': ["'self'"],
                    'object-src': ["'none'"],
                    'base-uri': ["'self'"],
                    'form-action': ["'self'"],
                    'frame-ancestors': ["'none'"],
                    'upgrade-insecure-requests': [],
                    'block-all-mixed-content': [],
                    sandbox: ['allow-scripts', 'allow-same-origin']
                }
            },
            frameguard: { action: 'deny' },
            hidePoweredBy: true,
            hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
            noSniff: true,
            xssFilter: true,
            referrerPolicy: { policy: 'same-origin' },
            crossOriginEmbedderPolicy: true,
            crossOriginOpenerPolicy: { policy: 'same-origin' }
        })
    );

    // Start the server and listen on the configured port
    const port = configService.get('server.port');
    await app.listen(port);
    appLogger.log(BaseMessage.Success.ServerStartUp + port);

    // Return the server and related instances
    return { appLogger, apiBaseURL, routePrefix };
}

bootstrap()
    .then(({ appLogger, apiBaseURL, routePrefix }) => {
        appLogger.log(BaseMessage.Success.BackendBootstrap(apiBaseURL + '/' + routePrefix));
    })
    .catch((error) => {
        console.error(JSON.stringify(error));
    });
