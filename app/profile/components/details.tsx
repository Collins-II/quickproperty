interface UserDetailsProps {
    user: {
        phone: string;
        address: string;
        city: string;
        country: string;
    };
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
    return (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">User Details</h2>
            <div className="space-y-2">
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <p><strong>City:</strong> {user.city}</p>
                <p><strong>Country:</strong> {user.country}</p>
            </div>
        </div>
    );
};

export default UserDetails;
