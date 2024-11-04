// lib/mtnApi.ts
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const MTN_SUB_KEY = "e615e6e35bd843b5a09543f8b2850c35";

const MTN_API_URL = "https://sandbox.momodeveloper.mtn.com";
const MTN_API_KEY = process.env.NEXT_PUBLIC_MTN_API_KEY;
const CALLBACK_URL = 'https://webhook.site/6185b0b3-8eb2-46fb-b17a-4f029124b482';

export const createMtnApiUser = async () => {
    const headers = {
        'Content-Type': 'application/json',
        "Ocp-Apim-Subscription-Key": MTN_SUB_KEY,
        "X-Reference-Id": uuidv4(),
    };

    const data = {
        providerCallbackHost: CALLBACK_URL,
    };

    try {
        const res = await axios.post(`${MTN_API_URL}/v1_0/apiuser`, {
            'Content-Type': 'application/json',
            "Ocp-Apim-Subscription-Key": MTN_SUB_KEY,
            "X-Reference-Id": uuidv4(),
        });
        console.log('API User Created:', res.data);
        return res.data;
    } catch (error) {
        console.log('Error creating API user:', error);
        throw error;
    }
};

export const createMtnApiKey = async (apiUserId: string): Promise<any> => {

    try {
        const response = await axios.post(`${MTN_API_URL}/v1_0/apiuser/${apiUserId}/apikey`, {}, {
            headers: {
                'Content-Type': 'application/json',
                "Ocp-Apim-Subscription-Key": MTN_SUB_KEY,
            }
        });
        console.log('API Key Created:', response.data);
        return response.data.apiKey;
    } catch (error) {
        console.log('Error creating API key:', error ? error : error);
        throw error;
    }
};

export const createMtnApiToken = async (): Promise<any> => {
    // const apiUser = await createMtnApiUser();
    const apiUser = "66366418-e654-43f7-8e63-12b9fcf45bae"
    const apiKey = await createMtnApiKey(apiUser);

    const encodedCredentials = Buffer.from(`${apiUser}:${apiKey}`).toString('base64');

    try {
        const apiToken = await axios.post(`${MTN_API_URL}/collection/token/`, {}, {
            headers: {
                'Authorization': `Basic ${encodedCredentials}`,
                "Ocp-Apim-Subscription-Key": MTN_SUB_KEY,
                'Content-Type': 'application/json',
            }
        });
        console.log('API Token Created:', apiToken.data);
        return apiToken.data.access_token;
    } catch (error) {
        console.log('Error creating API token:', error ? error : error);
        throw error;
    }
};

export const initiateMtnPayment = async (amount: number, mobileNumber: number) => {
    const accessToken = await createMtnApiToken();

    if (!accessToken) {
        throw "No token is available."
    }

    const transactionReference = uuidv4();

    try {
        const response = await axios.post(`https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay`, {
            amount: amount,
            currency: "EUR",
            externalId: "0769537411",
            payer: {
                partyIdType: "MSISDN",
                partyId: mobileNumber,
            },
            payerMessage: "Succesful purchase of these goods",
            payeeNote: "Received payment for these goods"
        }, {
            headers: {
                "X-Reference-Id": transactionReference,
                "X-Target-Environment": "sandbox",
                "Ocp-Apim-Subscription-Key": MTN_SUB_KEY,
                "Authorization": `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Cache-Control': "no-cache"
            }
        });

        console.log('Payment Initiated:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error initiating payment:', error);
        throw error;
    }
};

export const verifyPayment = async (transactionId: string) => {
    try {
        const response = await axios.get(`${MTN_API_URL}/collection/v1_0/requesttopay/${transactionId}`, {
            headers: {
                'Ocp-Apim-Subscription-Key': MTN_SUB_KEY,
                'X-Target-Environment': 'sandbox',
                'Content-Type': 'application/json',
            },
        });

        console.log('Payment Verification:', response.data);
        return response.data;
    } catch (error) {
        console.log('Error verifying payment:', error ? error : error);
        throw error;
    }
};

const generateTransactionReference = (): string => {
    return `txn_${Math.floor(Math.random() * 1000000)}`;
};
