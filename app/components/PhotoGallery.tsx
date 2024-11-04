"use client";
import { FC, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import 'swiper/css/autoplay';
import Image from 'next/image';
import 'swiper/css/autoplay';

interface PhotoGalleryProps {
    images: string[];
}

const PhotoGallery: FC<PhotoGalleryProps> = ({ images }) => {
    const [isFullscreen, setFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setFullscreen(!isFullscreen);
    };

    return (
        <div className={`${isFullscreen ? 'fixed inset-0 bg-black z-50 flex items-center justify-center' : 'w-full max-w-5xl mx-auto'}`}>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, Zoom]}
                spaceBetween={20}
                slidesPerView={2}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                zoom
                className={`rounded-lg ${isFullscreen ? 'h-screen w-full' : 'h-auto'}`}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="swiper-zoom-container relative w-full h-[400px] md:h-[500px]">
                            <img
                                src={image}
                                alt={`Property Image ${index + 1}`}
                                className="rounded-lg cursor-pointer object-cover w-full h-full"
                                onClick={toggleFullscreen}  // Click to toggle fullscreen
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {isFullscreen && (
                <button
                    className="absolute top-4 right-4 text-white text-xl font-bold bg-black p-2 rounded-full shadow-md hover:bg-gray-700 transition"
                    onClick={toggleFullscreen}
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default PhotoGallery;
