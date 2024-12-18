export interface IApplicationConfiguration {
    server: {
        port: number;
        env: string;
        routePrefix: string;
        apiBaseURL: string;
        appBaseURL: string;
        secret: string;
    };
    mongodb: {
        uri: string;
        dbName: string;
    };
}
