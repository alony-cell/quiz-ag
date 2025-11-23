// List of common free email providers
const FREE_EMAIL_PROVIDERS = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'live.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'yandex.com',
    'zoho.com',
    'gmx.com',
    'mail.ru',
];

export function isBusinessEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
        return false;
    }

    return !FREE_EMAIL_PROVIDERS.includes(domain);
}
