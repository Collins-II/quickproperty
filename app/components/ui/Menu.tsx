"use client"

import React from 'react';
import { MdOutlineCancel, MdOutlineConstruction, MdOutlineElectricalServices } from 'react-icons/md';
import { CreateUserParams } from '@/app/types';
import { useRouter } from "next-nprogress-bar";
import { TbBuildingBank, TbShieldLockFilled } from 'react-icons/tb';
import useRentModal from '@/app/hooks/useRentModal';
import Image from 'next/image';
import { RiMedalLine } from "react-icons/ri";
import { FaKissWinkHeart, FaUsersCog } from 'react-icons/fa';
import { IoMdCloudUpload } from 'react-icons/io';
import { signOut } from 'next-auth/react';
import { BsPersonWorkspace } from 'react-icons/bs';

interface ProfileProps {
  user: CreateUserParams;
  setOpenProfile: any
}

const Menu = ({ user, setOpenProfile }: ProfileProps) => {
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

  const services = [
    { name: 'Construction Services', link: '/services/construction' },
    { name: 'Metal Fabrication Services', link: '/services/metal-fabrication' },
    { name: 'Electrical Services', link: '/services/electrical' },
    { name: 'Job Opportunities', link: '/services/jobs' },
  ];

  const MenuData = [
    {
      icon: <MdOutlineConstruction />,
      title: 'Construction Services',
      desc: 'Your listed properties',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      link: "construction"
    },
    {
      icon: <RiMedalLine />,
      title: 'Metal Fabrication Services',
      desc: 'Your listed property favorites',
      iconColor: 'rgb(0, 194, 146)',
      iconBg: 'rgb(235, 250, 242)',
      link: "metal-fabrication"
    },
    {
      icon: <MdOutlineElectricalServices />,
      title: 'Electrical Services',
      desc: 'Your reserved properties',
      iconColor: 'rgb(255, 244, 229)',
      iconBg: 'rgb(254, 201, 15)',
      link: "electrical"
    },
    {
      icon: <BsPersonWorkspace />,
      title: 'Job Opportunities',
      desc: 'Edit profile details',
      iconColor: '#03C9D7',
      iconBg: '#E5FAFB',
      link: "jobs"
    },
  ];

  const contactInfo = [
    { type: 'Phone', value: '+260 973 302063' },
    { type: 'Email', value: 'info@homes.com' },
  ];

  return (
    <div className="nav-item fixed right-1 top-16 bg-white shadow-lg  text-yellow-900  dark:bg-[#42464D] pt-2 px-4 pb-6 rounded-lg sm:w-full md:w-80 h-auto z-[250] overflow-y-scroll showed-scroll-bar">
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
      <div className="flex gap-5 items-center border-color border-b-1 pb-2 pl-5">
        <div>
          <p className="font-semibold text-xl dark:text-white-200"> Services </p>
          {/*<p className="text-white-500 text-sm dark:text-white-400">  Marketing Manager   </p>*/}
        </div>
      </div>
      <div>
        {MenuData.map((item, index) => (
          <div onClick={() => handlePath(item.link)} key={index} className="flex items-center gap-5 border-b-1 border-color p-4 hover:bg-light-white cursor-pointer  dark:hover:bg-[#42464D]">
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className=" text-lg rounded-lg p-2 hover:bg-light-white"
            >
              {item.icon}
            </button>

            <div>
              <p className="font-semibold dark:text-white-200 ">{item.title}</p>
            </div>
          </div>
        ))}
        <hr className='mb-4' />
        <div className="flex gap-5 items-center border-color border-b-1 pb-2 pl-5">
          <div>
            <p className="font-semibold text-lg dark:text-white-200"> Contact Information </p>
            {/*<p className="text-white-500 text-sm dark:text-white-400">  Marketing Manager   </p>*/}
          </div>
        </div>
        <div className="flex flex-col justify-start space-y-2 pl-5">
          {contactInfo.map((contact) => (
            <div key={contact.type} className="text-gray-800">
              <span className="font-semibold">{contact.type}:</span> {contact.value}
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Menu;
