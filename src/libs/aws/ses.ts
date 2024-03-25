import message from 'aws-sdk/lib/maintenance_mode_message.js';
message.suppress = true;

import config from '#config';
import * as AWS from 'aws-sdk';
import { SendEmailRequest } from 'aws-sdk/clients/ses';

const SES_CONFIG = {
    apiVersion: config.AWS.SES.API_VERSION,
    accessKeyId: config.AWS.SES.ACCESS_KEY_ID,
    secretAccessKey: config.AWS.SES.SECRET_ACCESS_KEY,
    region: config.AWS.SES.REGION,
} as const;
const AWSSendEmailService = new AWS.SES(SES_CONFIG);

type T_SendAutoEmail = (options: SendEmailRequest) => Promise<boolean>;

export const sendAutoEmail: T_SendAutoEmail = async (options) => {
    try {
        await AWSSendEmailService.sendEmail(options).promise();
        return true;
    } catch (err) {
        return false;
    }
};
