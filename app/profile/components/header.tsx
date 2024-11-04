import Image from 'next/image';

interface ProfileHeaderProps {
    user: {
        name: string;
        image: string;
        email: string;
    };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
    return (
        <div className="flex items-center space-x-4 p-4 bg-white shadow rounded-lg">
            <div className="relative w-24 h-24">
                <Image
                    src={user.image}
                    alt={user.name}
                    className="rounded-full object-cover"
                    layout="fill"
                />
            </div>
            <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
            </div>
        </div>
    );
};

export default ProfileHeader;
