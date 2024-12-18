export const BaseMessage = {
    Exception: {
        Unauthorized: 'Unauthorized',
        AccessTokenExpired: 'AccessTokenExpired'
    },
    Error: {
        InvalidInput: 'Invalid input provided',
        SomethingWentWrong: 'Something went wrong.',
        BackendBootstrap: 'Backend bootstrapped failed.',
        BackendGeneral: 'Backend internal server error',
        DatabaseGeneral:
            'Error occurred at database layer, it might be because of invalid request body.',
        RouteNotFound: 'Cannot GET /',
        SecretKeyNotFound: 'Secret key not found',
        EmailAlreadyRegistered: 'Email is already registered with us.',
        EmailNotAlreadyRegistered: 'Email is not registered with us.',
        InvalidPassword: 'Invalid Password'
    },
    Success: {
        RootRoute: (environment: string) =>
            `Backend application starts successfully for ${environment} environment`,
        BackendBootstrap: (url: string) =>
            `Backend bootstrapped successfully, open your browser on ${url}`,
        SuccessGeneral: 'Success',
        ServerStartUp: 'Application started on port number :: '
    },
    SwaggerMessage: {
        Property: {
            Description: {
                IsSuccess: 'Response status',
                Message: 'Response message',
                Data: 'Entity response',
                Errors: 'Response errors if any'
            }
        },
        Response: {
            Ok: {
                Status: 200,
                Description: 'Success response'
            },
            ServiceUnavailable: {
                Status: 503,
                Description: 'Service unavailable response.'
            }
        }
    },
    Information: {},
    Warning: {},
    Description: {}
};
