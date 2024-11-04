"use client";

interface UserSettingsProps {
    user: {
        email: string;
        notifications: boolean;
    };
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
    const handleToggleNotifications = () => {
        // Handle notification toggle logic
    };

    return (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span>Email: {user.email}</span>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Change Email</button>
                </div>
                <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <button
                        onClick={handleToggleNotifications}
                        className={`px-4 py-2 rounded-lg ${user.notifications ? 'bg-green-500' : 'bg-red-500'} text-white`}
                    >
                        {user.notifications ? 'Enabled' : 'Disabled'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
