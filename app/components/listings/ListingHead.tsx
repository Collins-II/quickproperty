'use client';

import { useRef, useState } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from "next/image";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";

import Heading from "../Heading";
import HeartButton from "../HeartButton";
import dynamic from 'next/dynamic';
import PhotoGallery from '../PhotoGallery';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import clsx from 'clsx';
import { TfiZoomIn, TfiZoomOut } from "react-icons/tfi";
import NearProperty from '../near-property';

interface ListingHeadProps {
  title: string | undefined;
  district: string | undefined;
  compound: string | undefined;
  imageSrc: string[];
  id: string;
  currentUser?: SafeUser | null,
  locationValue: string;
}

const Map = dynamic(() => import('../Map'), {
  ssr: false
});

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  district,
  compound,
  imageSrc,
  id,
  currentUser,
  locationValue
}) => {
  const [index, setIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setFullscreen(!isFullscreen);
  };

  const handleDotClick = (dotIndex: number) => {
    setIndex(dotIndex);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: dotIndex * 150, // Adjust scroll position based on image size
        behavior: "smooth",
      });
    }
  };

  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng

  return (
    <>
      <Heading
        title={title as string}
        subtitle={`${district}, ${compound}`}
      />
      <NearProperty />
      <Heading
        title="Photos"
        subtitle=''
      />
      {/*<div className="rounded-lg overflow-hidden shadow-lg bg-white">
        <PhotoGallery images={imageSrc as string[]} />
      </div>*/}
      <div className={`${isFullscreen ? 'fixed inset-0 bg-black z-50 flex items-center justify-center w-full ' : ' w-full  max-w-5xl mx-auto'}`}>
        <div className={`overflow-hidden relative w-full ${isFullscreen ? 'h-[300px] md:h-[400px] lg:h-[500px]' : 'h-[300px]'} `}
          key={index}
        >
          <Image
            src={imageSrc && imageSrc[index] as string}
            fill
            className="object-cover w-full rounded-md"
            alt="Image"
          />
          {!isFullscreen && (<TfiZoomOut size={28} className='text-white absolute bottom-4 right-4' onClick={toggleFullscreen} />)}
        </div>
        {isFullscreen && (
          <button
            className="absolute top-4 right-4 text-white text-xl font-bold bg-black p-2 rounded-full shadow-md hover:bg-gray-700 transition"
            onClick={toggleFullscreen}
          >
            <TfiZoomIn size={28} className="text-white" />
          </button>
        )}
      </div>
      <div className="relative flex flex-col justify-center items-center ">
        <div
          ref={scrollContainerRef}
          className="
                    flex flex-row
                    gap-3
                    overflow-x-auto
                    hide-scroll-bar
                    pr-2
                    mb-4
                    w-full
                    scroll-smooth
                    translate
            duration-600
                "
        >
          {imageSrc?.map((item, i) => (
            <div key={i} className="col-span-1">
              <div
                className={`
        rounded-xl
        border-2
        w-[100px]
        h-[140px]
        px-1
        py-2
        relative
        flex
        justify-center
        items-start
        gap-3
        hover:border-neutral-200
        transition
        cursor-pointer
        overflow-hidden
        ${i === index ? "opacity-70 scale-90" : "opacity-100"}
      `}
              >
                <Image
                  src={item}
                  fill
                  className={clsx(`object-cover w-full rounded-md`

                  )}
                  alt="Image"
                  onMouseEnter={() => setIndex(i)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dots for image index */}
        <div className="flex justify-center space-x-2">
          {imageSrc?.map((_, dotIndex) => (
            <div
              key={dotIndex}
              className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300
              ${index === dotIndex ? "bg-gray-600 scale-110" : "bg-gray-300"}`}
              onClick={() => handleDotClick(dotIndex)}
            />
          ))}
        </div>
      </div>
      {/*<Slider {...settings}>
        {imageSrc?.map((banner, i) => (
          <div className="
          w-full
          h-[80px]
          overflow-hidden 
          relative
        "
            key={i}
          >
            <Image
              src={banner}
              fill
              className="object-cover w-full rounded-md mr-2"
              alt="Image"
              onMouseEnter={() => setIndex(i)}
            />
          </div>
        ))}
      </Slider>*/}
    </>
  );
}

export default ListingHead;