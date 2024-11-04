import ProfileHeader from '../components/header';
import UserDetails from '../components/details';
import PropertyListings from '../components/listings';
import UserSettings from '../components/settings';
import { getUserById } from '@/app/actions/user.actions';
import getListings from '@/app/actions/getListings';

interface IParams {
    userId: string;
}

const Profile = async ({ params }: { params: IParams }) => {
    const user = await getUserById(params.userId);
    const properties = await getListings({ userId: user._id });

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <ProfileHeader user={user} />
            <UserDetails user={user} />
            <PropertyListings properties={properties} />
            <UserSettings user={user} />
        </div>
    );
};

export default Profile;
