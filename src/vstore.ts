import { VStoreOptions } from "./types";
import { VConfig } from "./vconfig";

export class VStore {
    private static readonly _logger = console;

    private static readonly NAME = 'vstore';
    private static readonly VERSION = '0.0.2';
    private static readonly VERSION_CODE = '2';

    private readonly _config: VConfig;

    constructor(options: VStoreOptions) {
        this._config = new VConfig(options);
    }

    config(): VConfig {
        return this._config;
    }

    static create(options: VStoreOptions): VStore {
        return new VStore(options);
    }

    static createWith(projectId: string, apiKey: string, url?: string): VStore {
        return this.create({
            projectId,
            apiKey,
            url,
        });
    }

    static getSDKOrigin(module: string, originId: string): string {
        return `${VStore.NAME}(${module})/${VStore.VERSION}-${VStore.VERSION_CODE}/sdk-id:${originId}`;
    }
}