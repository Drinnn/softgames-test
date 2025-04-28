export class EntityError extends Error {
    constructor(entityName: string, message: string) {
        super(`${entityName}: ${message}`);
        this.name = 'EntityError';
    }
}
