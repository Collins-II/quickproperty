// services/flutterwaveService.ts
import Flutterwave from 'flutterwave-node-v3-withtypes';
import { MobileMoneyNetworks } from 'flutterwave-node-v3-withtypes/services/mobile-money/types';
import { Currencies } from 'flutterwave-node-v3-withtypes/utils/types';

// services/dpoService.ts

import axios from 'axios';

// lib/pesapalService.ts


const PESA_CONSUMER_KEY = 'v988cq7bMB6AjktYo/drFpe6k2r/y7z3';
const PESA_CONSUMER_SECRET = '3p0F/KcY8WAi36LntpPf/Ss0MhQ=';

const BASE_URL = '	https://cybqa.pesapal.com/pesapalv3';

interface PesapalAuthResponse {
    success: boolean;
    message: string
    token: string;
}

interface OrderProcessPayload {
    amount: number;
    phone: string;
    callback: string;
    updatePesapalIPNID: string;
}

export const getOAuthToken = async (): Promise<PesapalAuthResponse> => {
    //const { PESA_CONSUMER_KEY, PESA_CONSUMER_SECRET } = process.env;

    if (!PESA_CONSUMER_KEY || !PESA_CONSUMER_SECRET) {
        throw new Error('Consumer Key and Consumer Secret must be set');
    }

    const response = await axios.post(`${BASE_URL}/api/Auth/RequestToken`, {
        consumer_key: PESA_CONSUMER_KEY,
        consumer_secret: PESA_CONSUMER_SECRET,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    });

    return response.data;
};

export const registerIPN = async (url: string): Promise<any> => {
    const tokenResponse = await getOAuthToken();

    if (!tokenResponse) {
        throw new Error('Failed to obtain Token');
    }

    const response = await axios.post(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
        'url': `https://${url}`,
        'ipn_notification_type': 'GET',
    }, {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenResponse.token}`
        }
    });

    return response.data;
};

export const listIPNs = async (): Promise<any> => {
    const tokenResponse = await getOAuthToken();

    if (!tokenResponse) {
        throw new Error('Failed to obtain Token');
    }

    const response = await axios.get(`${BASE_URL}/api/URLSetup/GetIpnList`, {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenResponse.token}`
        }
    });

    return response.data;
};

export const orderProcess = async (payload: OrderProcessPayload): Promise<any> => {
    const tokenResponse = await getOAuthToken();

    if (!tokenResponse) {
        throw new Error('Failed to obtain Token');
    }

    const orderPayload = {
        id: Math.floor(Math.random() * 10000000000),
        currency: 'ZMW',
        amount: payload.amount,
        description: 'testApi',
        redirect_mode: 'TOP_WINDOW',
        callback_url: payload.callback,
        notification_id: payload.updatePesapalIPNID,
        billing_address: {
            phone_number: payload.phone
        }
    };

    const response = await axios.post(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, orderPayload, {
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenResponse.token}`
        }
    });

    return response.data;
};

export const transactionStatus = async (orderTrackingId: string): Promise<any> => {
    if (!orderTrackingId) {
        throw new Error('Missing Transaction ID');
    }

    const tokenResponse = await getOAuthToken();

    if (!tokenResponse) {
        throw new Error('Failed to obtain Token');
    }

    const response = await axios.get(`${BASE_URL}/api/Transactions/GetTransactionStatus`, {
        params: { orderTrackingId },
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'Authorization': `Bearer ${tokenResponse.token}`
        }
    });

    return response.data;
};
/*const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY as string, process.env.FLW_SECRET_KEY as string);

interface Payload {
    phone_number: string;
    amount: number;
    currency: Currencies;
    network: MobileMoneyNetworks;
    email: string;
    tx_ref: string;
}

const generateTransactionReference = (): string => {
    return `tx-ref-${Date.now()}`;
}

export const initiateMobileMoneyPayment = async (payload: Omit<Payload, 'tx_ref'>) => {
    const fullPayload: Payload = {
        ...payload,
        tx_ref: generateTransactionReference(),
    };

    try {
        const response = await flw.MobileMoney.zambia(fullPayload);
        return response;
    } catch (error) {
        throw new Error(`Payment initiation failed: ${error}`);
    }
};*/
