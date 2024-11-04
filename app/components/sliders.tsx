// components/Sliders.tsx
"use client"
import React, { useRef } from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Image from 'next/image';
import { HiChevronRight } from 'react-icons/hi';

interface SlidersProps {
    banners: string[];// Array of image URLs
    speed?: number;
    slidesToShow?: number;
    rtl?: boolean;
    dots: boolean
}

const Sliders: React.FC<SlidersProps> = ({ banners, speed, slidesToShow, rtl, dots }) => {
    const sliderRef = useRef<Slider | null>(null);

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };


    const settings = {
        infinite: banners && banners.length > 1,
        speed: speed,
        slidesToShow: slidesToShow,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000, // Adjust the duration as needed
        rtl: rtl // Set RTL (right to left) mode to make the slides move to the right
    };

    return (
        <Slider ref={sliderRef} {...settings}>
            {banners?.map((banner, index) => (
                <div className="
                w-full
                h-[188px]
                max-h-[188px]
                overflow-hidden 
                rounded-xl
                relative
              "
                    key={index}
                >
                    <Image
                        src={banner}
                        fill
                        className="object-cover"
                        alt="Image"
                    />
                    {banners.length > 1 && (<div
                        className="
              bg-white
              rounded-full
              p-2
              absolute
             bottom-3
    right-3
              cursor-pointer
              "
                    >
                        <HiChevronRight onClick={handleNext} />
                    </div>)}
                </div>
            ))}

        </Slider>
    );
};

export default Sliders;
