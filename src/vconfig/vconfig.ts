import { API_KEY_HEADER_PREFIX, DEFAULT_VSTORE_URL, PROJECT_ID_HEADER_PREFIX, SDK_ORIGIN_HEADER_PREFIX } from "../constants";
import { VStoreOptions } from "../types";
import { decodeBase64, generateUUID, parseJSON } from "../util";
import { VStore } from "../vstore";
import { VConfigService } from "./service";

declare const process: any;

export class VConfig {
    private static readonly _logger = console;
    private static readonly NAME = 'vconfig';

    private static readonly cache: Map<string, any> = new Map();
    private readonly _id: string;
    private readonly _options: VStoreOptions;
    private readonly _service: VConfigService;
    private _isReady: boolean = false;

    constructor(options: VStoreOptions) {
        const start = Date.now();

        this._id = generateUUID();
        this._options = options;

        this._service = new VConfigService({
            baseURL: options.url || DEFAULT_VSTORE_URL,
            headers: {
                [PROJECT_ID_HEADER_PREFIX]: options.projectId,
                [API_KEY_HEADER_PREFIX]: options.apiKey,
                [SDK_ORIGIN_HEADER_PREFIX]: VStore.getSDKOrigin(VConfig.NAME, this.getId()),
                'Content-Type': 'application/json',
            },
        });

        VConfig._logger.log(`[${VConfig.NAME}] initialized with instance id: ${this.getId()} in ${Date.now() - start}ms`);

        // Start download configs
        this.download();
    }

    public getId() {
        return this._id;
    }

    public async download() {
        const start = Date.now();
        VConfig._logger.log(`[${VConfig.NAME}] Downloading configs...`);
        await this._service.get('/sdk/vconfig/kv').then((res) => {
            const keys = Object.keys(res.namespaces);
            for (const key of keys) {
                VConfig.cache.set(key, res.namespaces[key]);
            }

            this._isReady = true;
        });

        VConfig._logger.log(`[${VConfig.NAME}] Downloaded configs in ${Date.now() - start}ms`);
    }

    public async refresh() {
        const start = Date.now();
        VConfig._logger.log(`[${VConfig.NAME}] Refreshing configs...`);
        this._isReady = false;
        await this.download();
        VConfig._logger.log(`[${VConfig.NAME}] Refreshed configs in ${Date.now() - start}ms`);
    }

    public async waitForReady() {
        if (this._isReady) {
            return Promise.resolve(true);
        }

        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this._isReady) {
                    clearInterval(interval);
                    resolve(true);
                }
            }, 100);
        });
    }

    public isReady() {
        return this._isReady;
    }

    public get(namespace?: string, key?: string, defaultValue?: any) {
        namespace = namespace || this._options.namespace || 'default';

        if (key) {
            const namespaceConfig = VConfig.cache.get(namespace);
            if (namespaceConfig) {
                return decodeBase64(namespaceConfig[key]) || defaultValue;
            }
        } else {
            const values = VConfig.cache.get(namespace)
            if (typeof values === 'object') {
                const result: any = {};
                Object.keys(values).forEach((key) => {
                    result[key] = decodeBase64(values[key]);
                });
                return result;
            } else {
                return values;
            }
        }
    }

    public getByKey(key: string, defaultValue?: any) {
        return this.get(this._options.namespace || 'default', key, defaultValue);
    }

    public getJSON(namespace: string, key?: string, defaultValue?: any) {
        const value = this.get(namespace, key, defaultValue);
        if (typeof value === 'string') {
            return parseJSON(value);
        } else {
            return value;
        }
    }

    public getJSONByKey(key: string, defaultValue?: any) {
        return this.getJSON(this._options.namespace || 'default', key, defaultValue);
    }

    public async loadToEnv(namespace?: string, key?: string) {
        const start = Date.now();
        await this.waitForReady();

        if (process?.env === undefined) {
            throw new Error('process.env is not defined');
        }

        const values = this.get(namespace, key);
        if (typeof values === 'object') {
            Object.keys(values).forEach((key) => {
                process.env[key] = values[key];
            });
        } else {
            console.warn(`[${VConfig.NAME}] loanToEnv failed, namespace: ${namespace}, key: ${key}`);
        }

        VConfig._logger.log(`[${VConfig.NAME}] loanToEnv done in ${Date.now() - start}ms`);
    }
}