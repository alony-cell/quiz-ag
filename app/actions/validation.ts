'use server';

import { resolveMx } from 'dns/promises';

export async function validateEmail(email: string): Promise<{ valid: boolean; error?: string }> {
    try {
        // Basic format validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!emailRegex.test(email)) {
            return { valid: false, error: 'Invalid email format' };
        }

        // Extract domain
        const domain = email.split('@')[1];

        if (!domain) {
            return { valid: false, error: 'Invalid email format' };
        }

        // Check MX records
        try {
            const mxRecords = await resolveMx(domain);

            if (!mxRecords || mxRecords.length === 0) {
                return { valid: false, error: 'Email domain does not accept mail' };
            }

            return { valid: true };
        } catch (dnsError) {
            return { valid: false, error: 'Email domain does not exist' };
        }
    } catch (error) {
        console.error('Email validation error:', error);
        return { valid: false, error: 'Unable to verify email' };
    }
}
