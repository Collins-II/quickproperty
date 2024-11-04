import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import User from '@/app/lib/database/models/user.model';

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const body = await req.json();
    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      currentUser.id,
      {
        name: name,
        image: image
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(updatedUser);

  } catch (error: unknown) {
    console.log(error, "ERROR_SETTINGS");
    return new NextResponse('Internal Error', { status: 500 });
  }
}
