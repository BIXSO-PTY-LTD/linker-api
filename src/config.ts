const config: any = {
    IS_DEV: process.env.NODE_ENV === 'development',
    IS_STAG: process.env.NODE_ENV === 'production' && process.env.ENV === 'staging',
    IS_PROD: process.env.NODE_ENV === 'production' && process.env.ENV === 'production',
    BODY_PARSER_LIMIT: process.env.BODY_PARSER_LIMIT || '50mb',
    HOST_NAME: process.env.HOST_NAME || 'localhost',
    PORT: process.env.PORT || 8000,
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT || '/graphql',
    RESTAPI_ENDPOINT: process.env.RESTAPI_ENDPOINT || '/rest',
    MONGO_PORT: process.env.DB_PORT || 27017,
    MONGO_NAME: process.env.DB_NAME || 'linker-api',
    MONGO_USERNAME: process.env.MONGO_USERNAME || '',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
    SESSION: process.env.SESSION || {
        COLLECTION_NAME: 'sessions',
        SECRET: 'linker-api-session',
        MAX_AGE: 24 * 60 * 60 * 1000, // 24h
        TTL: 24 * 60 * 60,
    },
    WS_PORT: process.env.WS_PORT || 7999,
    SECRET: process.env.SECRET || 'ixN0-Vqnj9JAQzE(u*Z59xj#8ZKujr%w', // 32 chars required
    UPLOAD_FOLDER: process.env.UPLOAD_FOLDER || 'bixso',
    DATABASE_COLLECTIONS: {
        USER: process.env.USER_COLLECTION_NAME || 'users',
        USER_VERIFICATION: process.env.USER_VERIFICATION_COLLECTION_NAME || 'user-verifications',
    },
    SMS: {
        TWILIO: {
            ACCOUNT_SID: process.env.TWILIO_SID || '',
            AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
            SENDER: process.env.TWILIO_SENDER_PHONE || '',
        },
    },
    AWS: {
        SES: {
            API_VERSION: '2010-12-01',
            ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
            SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
            REGION: process.env.AWS_REGION || '',
        },
    },
};

config.getCurrentEnvironment = () => {
    if (config.IS_PROD) {
        return 'PRODUCTION';
    }

    if (config.IS_STAG) {
        return 'STAGING';
    }

    return 'DEVELOPMENT';
};

config.USER_PORT = process.env.USER_PORT || (config.IS_STAG ? '' : config.IS_PROD ? '' : `:${8001}`);

config.API_PORT = process.env.API_PORT || (config.IS_STAG ? '' : config.IS_PROD ? '' : `:${config.PORT}`);

config.WEB_PROTOCOL = process.env.WEB_PROTOCOL || `http${config.IS_STAG || config.IS_PROD ? 's' : ''}`;

config.API_HOST_NAME =
    process.env.API_HOST_NAME ||
    (config.IS_STAG ? 'apistaging.coachlinker.com' : config.IS_PROD ? 'api.coachlinker.com' : 'localhost');

config.USER_HOST_NAME =
    process.env.USER_HOST_NAME ||
    (config.IS_STAG ? 'staging.coachlinker.com' : config.IS_PROD ? 'coachlinker.com' : 'localhost');

config.USER_HTTP_URI =
    process.env.USER_HTTP_URI || `${config.WEB_PROTOCOL}://${config.USER_HOST_NAME}${config.USER_PORT}`;

config.RESTAPI_HTTP_URI =
    process.env.RESTAPI_HTTP_URI ||
    `${config.WEB_PROTOCOL}://${config.API_HOST_NAME}${config.API_PORT}${config.RESTAPI_ENDPOINT}`;

config.CORS_WHITELIST =
    process.env.CORS_WHITELIST || config.IS_DEV
        ? ['https://studio.apollographql.com', 'http://localhost:8001']
        : config.IS_STAG
          ? ['https://studio.apollographql.com', 'http://localhost:8001', 'https://staging.coachlinker.com']
          : ['https://studio.apollographql.com'];

config.MONGO_URI =
    process.env.MONGO_URI || config.IS_DEV
        ? 'mongodb://0.0.0.0:27017/bixso-linker'
        : config.IS_STAG
          ? `mongodb://apistaging.orderhanquoc.com:27017/bixso-linker`
          : `mongodb://api.orderhanquoc.com:27017/bixso-linker`;

export default config;
