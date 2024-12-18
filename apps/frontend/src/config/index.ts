import { IConfig } from '@/utils/types';
import devConfig from './development.json';
import localConfig from './local.json';
import prodConfig from './production.json';

const configs: Record<'LOCAL' | 'DEV' | 'PROD', IConfig> = {
    LOCAL: localConfig,
    DEV: devConfig,
    PROD: prodConfig
};

const ENV = (process.env.APP_ENV as keyof typeof configs) ?? 'LOCAL';

export const APP_CONFIG = configs[ENV];
