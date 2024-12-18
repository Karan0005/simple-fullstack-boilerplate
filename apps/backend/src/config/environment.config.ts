import { EnvironmentEnum, IApplicationConfiguration } from '../utilities';

const appEnv: string = process.env.APP_ENV ?? EnvironmentEnum.LOCAL;

const portBackend = process.env['PORT_BACKEND'] ? +process.env['PORT_BACKEND'] : 8000;
const portFrontend = process.env['PORT_FRONTEND'] ? +process.env['PORT_FRONTEND'] : 4200;

export function environment(): IApplicationConfiguration {
    return {
        server: {
            env: appEnv,
            port: portBackend,
            routePrefix: process.env.ROUTE_PREFIX ?? 'api',
            apiBaseURL: getAPIBaseURL(appEnv),
            appBaseURL: getAPPBaseURL(appEnv),
            secret: process.env.SERVER_SECRET
        },
        mongodb: {
            uri: process.env.MONGO_CONNECTION_URI ?? 'mongodb://localhost:27017/',
            dbName: process.env.MONGO_DB_NAME ?? 'local-fullstack-app'
        }
    };
}

function getAPIBaseURL(environment: string | undefined) {
    switch (environment) {
        case EnvironmentEnum.LOCAL: {
            return 'http://localhost:' + portBackend;
        }
        case EnvironmentEnum.DEV: {
            return 'http://128.199.31.53:8000'; //Replace it with your dev server url
        }
        case EnvironmentEnum.UAT: {
            return 'http://128.199.31.53:8000'; //Replace it with your uat server url
        }
        case EnvironmentEnum.PROD: {
            return 'http://128.199.31.53:8000'; //Replace it with your prod server url
        }
        default: {
            return 'http://localhost:' + portBackend;
        }
    }
}

function getAPPBaseURL(environment: string | undefined) {
    switch (environment) {
        case EnvironmentEnum.LOCAL: {
            return 'http://localhost:' + portFrontend;
        }
        case EnvironmentEnum.DEV: {
            return 'http://128.199.31.53'; //Replace it with your dev server url
        }
        case EnvironmentEnum.UAT: {
            return 'http://128.199.31.53'; //Replace it with your uat server url
        }
        case EnvironmentEnum.PROD: {
            return 'http://128.199.31.53'; //Replace it with your prod server url
        }
        default: {
            return 'http://localhost:' + portFrontend;
        }
    }
}
