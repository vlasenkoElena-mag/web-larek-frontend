export class EmptyCartOrderCreationError extends Error {
    constructor() {
        super('Cannot create order with empty cart.');
    }
}