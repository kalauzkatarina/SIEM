export function extractUsernameFromMessage(message: string): string {   // Returns username or empty string if username is not found
    const USERNAME_REGEX = /\b(user(name)?|account)\s*[:=]\s*"?([A-Za-z0-9._-]+)"?/i;

    const usernameMatch = USERNAME_REGEX.exec(message);
    return usernameMatch && usernameMatch[3] ? usernameMatch[3] : '';
}