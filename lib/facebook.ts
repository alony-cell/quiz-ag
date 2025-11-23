export async function sendFacebookEvent(
    pixelId: string,
    accessToken: string,
    eventName: string,
    userData: {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        country?: string;
        clientIp?: string;
        userAgent?: string;
        fbp?: string;
        fbc?: string;
    },
    customData?: Record<string, any>,
    testEventCode?: string
) {
    try {
        // Hash PII data
        const hash = async (text: string) => {
            const msgBuffer = new TextEncoder().encode(text.toLowerCase().trim());
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        };

        const payload: any = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    user_data: {
                        em: userData.email ? await hash(userData.email) : undefined,
                        ph: userData.phone ? await hash(userData.phone) : undefined,
                        fn: userData.firstName ? await hash(userData.firstName) : undefined,
                        ln: userData.lastName ? await hash(userData.lastName) : undefined,
                        country: userData.country ? await hash(userData.country) : undefined,
                        client_ip_address: userData.clientIp,
                        client_user_agent: userData.userAgent,
                        fbp: userData.fbp,
                        fbc: userData.fbc,
                    },
                    custom_data: customData,
                },
            ],
        };

        if (testEventCode) {
            payload.test_event_code = testEventCode;
        }

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error('Facebook CAPI Error:', data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Failed to send Facebook event:', error);
        return { success: false, error };
    }
}
