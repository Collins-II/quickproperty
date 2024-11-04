'use client';

import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useRentModal from "@/app/hooks/useRentModal";
import { CreateUserParams, SafeUser } from "@/app/types";

import MenuItem from "./MenuItem";
import Avatar from "../Avatar";
import Search from "./Search";
import { IoChatbubblesOutline } from "react-icons/io5";
import { RiArrowDropDownFill } from "react-icons/ri";
import useChatModal from "@/app/hooks/useChatModal";
import Button from "../Button";
import UserProfile from "@/app/components/ui/UserProfile"
import { BsThreeDotsVertical } from "react-icons/bs";
import Menu from "../ui/Menu";
import { useRouter } from "next-nprogress-bar";

interface UserMenuProps {
  CurrentUser?: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({
  CurrentUser
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const chatModal = useChatModal();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenu, setIsMenu] = useState(false);


  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
    setIsMenu(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenu((value) => !value);
    setIsOpen(false);
  }, []);


  const onRent = useCallback(() => {
    if (!user) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [loginModal, rentModal, user]);

  const onChat = useCallback(() => {
    router.push("/conversations")
    //chatModal.onOpen();
  }, [router]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <Search />
        <div
          onClick={onRent}
          className="
            hidden
            md:block
            text-sm 
            font-semibold 
            py-2 
            px-3
            rounded-full 
            bg-rose-500
            text-white
            hover:bg-rose-600 
            transition 
            cursor-pointer
          "
        >
          List your property
        </div>
        {user ? (<div

          className="
px-2
md:py-1
sm:px-2
border-[1px] 
border-neutral-200 
flex 
flex-row 
items-center 
gap-5 
rounded-full 
cursor-pointer 
hover:shadow-md 
transition
"
        >
          <IoChatbubblesOutline size={24} onClick={onChat} />
          <div onClick={toggleOpen} className="flex flex-row items-center">
            <Avatar src={user?.image as string} />
            <RiArrowDropDownFill />
          </div>

        </div>) : (<div

          className="
px-2
md:py-1
sm:px-2
border-[1px] 
border-neutral-200 
flex 
flex-row 
items-center 
gap-5 
rounded-full 
cursor-pointer 
hover:shadow-md 
transition
"
        >
          <Button label="SignIn" small={true} onClick={() => signIn("google")} />
        </div>
        )}
        <div onClick={toggleMenu} className="flex flex-row items-center">
          <BsThreeDotsVertical size={24} />
        </div>

      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
            z-50
          "
        >
          <div className="flex flex-col cursor-pointer">
            {user ? <UserProfile user={user as CreateUserParams} setOpenProfile={setIsOpen} /> : null}
          </div>
        </div>
      )}
      {isMenu && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
            z-50
          "
        >
          <div className="flex flex-col cursor-pointer">
            {user ? <Menu user={user as CreateUserParams} setOpenProfile={setIsMenu} /> : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;