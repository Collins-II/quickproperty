import Image from 'next/image';
import { FC } from 'react';

interface PhotoGalleryProps {
    photos: string[];
}

const PhotoGallery: FC<PhotoGalleryProps> = ({ photos }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
                <div key={index} className="relative w-full h-64">
                    <Image
                        src={photo}
                        alt={`Property Photo ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            ))}
        </div>
    );
};

export default PhotoGallery;
