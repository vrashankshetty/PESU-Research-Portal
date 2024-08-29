import uniqid from 'uniqid';

export function generateRandomId() {
    const id = uniqid();
    return id;
}
