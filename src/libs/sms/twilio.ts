import { Twilio } from 'twilio';
import config from '#config';

export type T_SmsOptions = {
    to: string;
    body: string;
    from?: string;
};

type T_SendAutoSMS = (options: T_SmsOptions) => Promise<boolean>;

export const sendAutoSMS: T_SendAutoSMS = async (options) => {
    const transport = new Twilio(config.SMS.TWILIO.ACCOUNT_SID, config.SMS.TWILIO.TWILIO_AUTH_TOKEN, {
        lazyLoading: true,
    });

    try {
        await transport.messages.create({ ...options, from: options?.from || config.SMS.TWILIO.TWILIO_SENDER_PHONE });
        return true;
    } catch (error) {
        return false;
    }
};
