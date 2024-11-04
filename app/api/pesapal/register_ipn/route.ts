import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { connectToDatabase } from "@/app/lib/database";
import { orderProcess, registerIPN } from "@/app/lib/payment.server";
import { Currencies } from "flutterwave-node-v3-withtypes/utils/types";
import { MobileMoneyNetworks } from "flutterwave-node-v3-withtypes/services/mobile-money/types";

interface PaymentRequestBody {
    phone_number: string;
    amount: number;
    currency: Currencies;
    network: MobileMoneyNetworks;
    email: string;
}

export async function POST(
    request: Request,
) {
    const body = await request.json();
    const paymentData = body;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!paymentData) {
        return new NextResponse('Bad Request', { status: 400 });
    }


    try {
        await connectToDatabase(); // Connect to MongoDB
        // Create a new reservation document
        const { url } = body;
        const ipnResponse = await registerIPN(url);

        if (!ipnResponse) {
            return new NextResponse('Not Found', { status: 404 });
        }

        return NextResponse.json(ipnResponse);
    } catch (error) {
        console.log("Error updating listing:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
