import { NextResponse } from "next/server";

import { handleError } from "@/app/lib/utils";
import { getUserByEmail, getUserById } from "@/app/actions/user.actions";
import Suggestion from "@/app/lib/database/models/suggestion.model";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    request: Request,
) {
    try {
        const body = await request.json();
        const {
            urlPath,
            userId,
            message
        } = body;

        const currentUser = await getUserById(userId);

        if (!currentUser) {
            return console.error(new Error("Unauthorized"), { status: 401 });
        }


        // Check for missing fields in the request body
        const requiredFields = ["message", "urlPath"];
        for (const field of requiredFields) {
            if (!body[field]) {
                return console.error(`Missing field: ${field}`, { status: 400 });
            }
        }

        const listing = await Suggestion.create({
            urlPath,
            message,
            userId: currentUser._id,
        });

        return NextResponse.json(listing, {
            headers: corsHeaders
        });
    } catch (error) {
        console.log("LISTING_ERR", error)
        handleError(error)
    }
}
