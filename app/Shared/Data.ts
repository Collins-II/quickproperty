import { IconType } from 'react-icons';
import { FaSwimmingPool, FaParking, FaWifi, FaTree, FaDumbbell } from 'react-icons/fa';
import { MdKitchen, MdOutlineBalcony, MdPets } from 'react-icons/md';
import { AiOutlineCar, AiOutlineFire } from 'react-icons/ai';
import { BiBath, } from 'react-icons/bi';
import { TbToolsKitchen2 } from 'react-icons/tb';

export interface Category {
  id: number;
  name: string;
  value: string;
  icon: IconType;
}

export const CategoryListData: Category[] = [
  {
    id: 1,
    name: 'Swimming Pool',
    value: 'swimming_pool',
    icon: FaSwimmingPool,
  },
  {
    id: 2,
    name: 'Parking',
    value: 'parking',
    icon: FaParking,
  },
  {
    id: 3,
    name: 'Wi-Fi',
    value: 'wifi',
    icon: FaWifi,
  },
  {
    id: 4,
    name: 'Balcony',
    value: 'balcony',
    icon: MdOutlineBalcony,
  },
  {
    id: 5,
    name: 'Garden',
    value: 'garden',
    icon: FaTree,
  },
  {
    id: 6,
    name: 'Pets Allowed',
    value: 'pets_allowed',
    icon: MdPets,
  },
  {
    id: 7,
    name: 'Gym',
    value: 'gym',
    icon: FaDumbbell,
  },
  {
    id: 8,
    name: 'Fireplace',
    value: 'fireplace',
    icon: AiOutlineFire,
  },
  {
    id: 10,
    name: 'Kitchen',
    value: 'kitchen',
    icon: MdKitchen,
  },
  {
    id: 11,
    name: 'Car Garage',
    value: 'car_garage',
    icon: AiOutlineCar,
  },
  {
    id: 12,
    name: 'Bathroom',
    value: 'bathroom',
    icon: BiBath,
  },
  {
    id: 13,
    name: 'Furnished Kitchen',
    value: 'furnished_kitchen',
    icon: TbToolsKitchen2,
  },
];


const ratingList=[
    {
        id:1,
        name:1,
        icon:'⭐'      
    },
    {
        id:2,
        name:2,
        icon:'⭐⭐'      
    },
    {
        id:3,
        name:3,
        icon:'⭐⭐⭐'      
    },
    {
        id:4,
        name:4,
        icon:'⭐⭐⭐⭐'      
    },
    {
        id:5,
        name:5,
        icon:'⭐⭐⭐⭐⭐'      
    },
]

export default{
    CategoryListData,
    ratingList
}