import { NextResponse } from "next/server";
import getCurrentUser from "./getCurrentUser";
import { connectToDatabase } from "../lib/database";
import { listIPNs, transactionStatus } from "../lib/payment.server";


export default async function getListIpns(orderTrackingId: string) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return new NextResponse('Unauthorized', { status: 401 });
    }


    try {
        await connectToDatabase(); // Connect to MongoDB
        // Create a new reservation document
        const ipns = await listIPNs();

        return NextResponse.json(ipns);
    } catch (error) {
        console.log("Error updating listing:", error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}