import axios, { AxiosRequestConfig } from 'axios';
import { VConfigResponse } from './types';

export class VConfigService {
    private readonly _axios?: AxiosRequestConfig;

    constructor(axiosConfig?: AxiosRequestConfig) {
        this._axios = axiosConfig;
    }

    async get(url: string): Promise<VConfigResponse> {
        const response = await axios.get<VConfigResponse>(url, this._axios);
        return response.data;
    }
}