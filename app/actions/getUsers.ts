import User from '../lib/database/models/user.model'; // Adjust the path as necessary
import getCurrentUser from './getCurrentUser';

const getUsers = async () => {
  const session = await getCurrentUser();

  if (!session || !session.email) {
    return null;
  }

  try {
    const users = await User.find({
      email: { $ne: session.email }
    })
      .sort({ createdAt: -1 });
    console.log("GET_USERS", users);
    return JSON.parse(JSON.stringify(users))
  } catch (error) {
    console.log("GET_USER_ERR", error);
    return [];
  }
};

export default getUsers;
