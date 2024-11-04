import { PropertyType } from '@/app/data';
import Image from 'next/image';
import { FC } from 'react';

interface PropertyTypeCardProps {
  propertyType: PropertyType;
}

const PropertyTypeCard: FC<PropertyTypeCardProps> = ({ propertyType }) => {
  return (
    <div className="
                w-[100px]
                h-[180px]
                lg:h-[200px]
                max-h-[200px]
                overflow-hidden 
                rounded-xl
                relative
              "
      key={propertyType.id}
    >
      <Image
        src={propertyType.imageUrl as string}
        fill
        className="object-cover w-full h-full"
        alt="Image"
      />
    </div>
  );
};

export default PropertyTypeCard;
