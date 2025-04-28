export class ServiceError extends Error {
    constructor(message: string, originalError?: Error) {
        super(originalError ? `${message} - ${originalError.message}` : message);
        this.name = 'ServiceError';
    }
}

