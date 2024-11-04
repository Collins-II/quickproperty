"use client"

import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { CreateUserParams } from '@/app/types';
import { useRouter } from "next-nprogress-bar";
import { TbBuildingBank, TbShieldLockFilled } from 'react-icons/tb';
import useRentModal from '@/app/hooks/useRentModal';
import Image from 'next/image';
import { RiBuilding2Fill } from 'react-icons/ri';
import { FaKissWinkHeart, FaUsersCog } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { signOut } from 'next-auth/react';

interface ProfileProps {
  user: CreateUserParams;
  setOpenProfile: any
}

const UserProfile = ({ user, setOpenProfile }: ProfileProps) => {
  const router = useRouter();
  const rentModal = useRentModal();

  const handleLogOut = () => {
    signOut()
    setOpenProfile(false)
  }

  const handleModal = () => {
    rentModal.onOpen();
    setOpenProfile(false)
  }

  const handlePath = (path: string) => {
    router.push(`/${path}`)
    setOpenProfile(false)
  }

  const userProfileData = [
    {
      icon: <RiBuilding2Fill />,
      title: 'View Properties',
      desc: 'Your listed properties',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      link: "properties"
    },
    {
      icon: <FaKissWinkHeart />,
      title: 'My Favorites',
      desc: 'Your listed property favorites',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      link: "favorites"
    },
    {
      icon: <TbShieldLockFilled />,
      title: 'My Reservations',
      desc: 'Your reserved properties',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      link: "reservations"
    },
    {
      icon: <FaUsersCog />,
      title: 'My Profile',
      desc: 'Edit profile details',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      link: "profile"
    },
  ];

  return (
    <div className="nav-item fixed right-1 top-16 bg-white shadow-lg  text-yellow-900  dark:bg-[#42464D] pt-2 px-8 pb-6 rounded-lg sm:w-full md:w-96 h-auto z-[250] overflow-y-scroll showed-scroll-bar">
      <div className="flex justify-end items-center">
        <button
          type="button"
          onClick={() => setOpenProfile(false)}
          style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
          className={` text-2xl p-3 text-slate-900 hover:drop-shadow-xl hover:bg-light-white`}
        >
          {<MdOutlineCancel className='text-slate-900' />}
        </button>
      </div>
      <div className="flex gap-5 items-center border-color border-b-1 pb-6">
        <Image
          height={44}
          width={44}
          className="rounded-full object-cover"
          src={user.image || '/images/placeholder.jpg'}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-white-200"> {user.name} </p>
          {/*<p className="text-white-500 text-sm dark:text-white-400">  Marketing Manager   </p>*/}
          <p className="text-white-500 text-sm font-semibold dark:text-white-400"> {user.email} </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div onClick={() => handlePath(item.link)} key={index} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-white cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-xl rounded-lg p-3 hover:bg-light-white"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-white-200 ">{item.title}</p>
              <p className="text-white-500 text-sm dark:text-white-400"> {item.desc} </p>
            </div>
          </div>
        ))}
        <div onClick={() => handleModal()} className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-white cursor-pointer  dark:hover:bg-[#42464D]">
          <button
            type="button"
            style={{ color: 'rgb(255, 244, 229)', backgroundColor: 'rgb(254, 201, 15)' }}
            className=" text-xl rounded-lg p-3 hover:bg-light-white"
          >
            {<IoMdCloudUpload />}
          </button>

          <div>
            <p className="font-semibold dark:text-white-200 ">List your property</p>
            <p className="text-white-500 text-sm dark:text-white-400"> Upload property </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button
          type="button"
          onClick={() => handleLogOut()}
          style={{ backgroundColor: "red", color: "white", borderRadius: "10px" }}
          className={`p-3 w-full hover:drop-shadow-xl hover:bg-white-400`}
        >
          Logout
        </button>
      </div>
    </div>

  );
};

export default UserProfile;
