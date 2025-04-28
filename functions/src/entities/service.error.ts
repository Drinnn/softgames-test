export class ServiceError extends Error {
    constructor(message: string, originalError?: Error) {
        super(`${message} - ${originalError?.message}`);
        this.name = 'ServiceError';
    }
}

