import { SafeListing } from '@/app/types';
import { MdOutlineMyLocation } from 'react-icons/md';
import Badge from './badge';
import { CiBadgeDollar } from 'react-icons/ci';

interface LocationHeaderProps {
    location: SafeListing;
}

const LocationHeader: React.FC<LocationHeaderProps> = ({ location }) => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-1 rounded-lg shadow-lg ">
            <div className="flex items-center space-x-2">
                {location?.isPremium ? (
                    <CiBadgeDollar className="h-4 w-4 text-white " />
                ) : (<MdOutlineMyLocation className="h-4 w-4 text-white" />)
                }
                <div>
                    <p className="text-sm text-white">{`${location?.compound}`}</p>
                </div>
            </div>
        </div>
    );
};

export default LocationHeader;
