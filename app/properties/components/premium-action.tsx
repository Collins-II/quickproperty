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

interface PremiumActionsProps {
  disabled: boolean;
  listingId: string;
  isPremium: boolean;
};

export const PremiumActions = ({
  disabled,
  listingId,
  isPremium
}: PremiumActionsProps) => {
  const { data: session } = useSession();
  const user = session?.user
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);


  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPremium) {
        await axios.patch(`/api/properties/${listingId}/unpremier`, { user });
        toast.success("Property premium unlisted succesfully!");
      } else {
        await axios.patch(`/api/properties/${listingId}/premier`, { user });
        toast.success("Property premium listed succesfully!");
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
      >
        {isPremium ? "Remove From Premium" : "Add To Premium"}
      </Button>
    </div>
  )
}