"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/app/components/ui/button";
import { ConfirmModal } from "@/app/components/modals/confirm-modal";
import { useConfettiStore } from "@/app/hooks/use-confetti-store";
import { useSession } from "next-auth/react";

interface ActionsProps {
  disabled: boolean;
  listingId: string;
  isReserved: boolean;
};

export const Actions = ({
  disabled,
  listingId,
  isReserved
}: ActionsProps) => {
  const { data: session } = useSession();
  const user = session?.user
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);


  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isReserved) {
        await axios.patch(`/api/properties/${listingId}/unpublish`, { user });
        toast.success("Property listing unpublished succesfully!");
      } else {
        await axios.patch(`/api/properties/${listingId}/publish`, { user });
        toast.success("Property listing published succesfully!");
        confetti.onOpen();
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/listings/${listingId}`);

      toast.success("Property deleted");
      router.refresh();
      router.push(`/properties`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="text-white"
      >
        {isReserved ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading} variant="destructive">
          <Trash className="h-4 w-4 text-white" />
        </Button>
      </ConfirmModal>
    </div>
  )
}