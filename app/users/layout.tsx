import getUsers from "../actions/getUsers";
import ClientOnly from "../components/ClientOnly";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  if (!users) {
    return <div>Loading...</div>; // Handle the case where the current user is not available
  }

  return (
    <ClientOnly>
      <div className="pt-24">
        <Sidebar>
          <div className="h-full">
            <UserList items={users} />
            {children}
          </div>
        </Sidebar>
      </div>
    </ClientOnly>
  );
}
