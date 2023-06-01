// Decode from base64 to string
export const decodeBase64 = (value: string | undefined | null) => {
    if (value === undefined || value === null) {
        return undefined;
    }

    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        // Browser environment
        return window.atob(value);
    } else {
        // Node.js environment
        // @ts-ignore
        return Buffer.from(value, 'base64').toString('utf-8');
    }
}

export const parseJSON = (value: string | undefined | null) => {
    if (value === undefined || value === null) {
        return undefined;
    }

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}

export const generateUUID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;
}