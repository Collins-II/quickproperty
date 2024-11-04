import { IListing } from "@/app/lib/database/models/listing.model";

interface PropertyListingsProps {
    properties: IListing[];
}

const PropertyListings: React.FC<PropertyListingsProps> = ({ properties }) => {
    return (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">My Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                    <div key={property._id} className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="relative w-full h-48">
                            <img
                                src={property.imageSrc[0]}
                                alt={property.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold">{property.title}</h3>
                            <p className="text-gray-600">{property.compound}</p>
                            <p className="text-rose-500 font-bold">${property.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyListings;
