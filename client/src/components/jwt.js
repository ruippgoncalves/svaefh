// Returns the JWT payload
export default function decode(token) {
    // Replaces - to + and _ to / and converts from base 64 to a string
    const parts = token.split('.').map(part => Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());

    return JSON.parse(parts[1]);
}
