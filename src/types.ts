export interface VStoreOptions {
    url?: string;
    organizationId?: string;
    projectId: string;
    apiKey: string;
    namespace?: string;
    retryConfig?: RetryConfig;
}

export interface RetryConfig {
    retryCount?: number;
    retryDelay?: number;
}

export class VStoreOptionsBuilder {
    private options: VStoreOptions;

    constructor() {
        this.options = {
            url: '',
            organizationId: '',
            projectId: '',
            apiKey: '',
            namespace: '',
            retryConfig: {
                retryCount: -1,
                retryDelay: 1000
            }
        };
    }

    setUrl(url: string): VStoreOptionsBuilder {
        this.options.url = url;
        return this;
    }

    setOrganizationId(organizationId: string): VStoreOptionsBuilder {
        this.options.organizationId = organizationId;
        return this;
    }

    setProjectId(projectId: string): VStoreOptionsBuilder {
        this.options.projectId = projectId;
        return this;
    }

    setApiKey(apiKey: string): VStoreOptionsBuilder {
        this.options.apiKey = apiKey;
        return this;
    }

    setNamespace(namespace: string): VStoreOptionsBuilder {
        this.options.namespace = namespace;
        return this;
    }

    setRetryCount(retryCount: number): VStoreOptionsBuilder {
        if (this.options.retryConfig === undefined || this.options.retryConfig === null) {
            this.options.retryConfig = {}
        }

        this.options.retryConfig.retryCount = retryCount;
        return this;
    }

    setRetryDelay(retryDelay: number): VStoreOptionsBuilder {
        if (this.options.retryConfig === undefined || this.options.retryConfig === null) {
            this.options.retryConfig = {}
        }

        this.options.retryConfig.retryDelay = retryDelay;
        return this;
    }

    build(): VStoreOptions {
        return this.options;
    }
}