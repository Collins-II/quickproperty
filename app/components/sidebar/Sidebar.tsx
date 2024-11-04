import { IUser } from "@/app/lib/database/models/user.model";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

interface SidebarProps {
  children: React.ReactNode;
  currentUser?: IUser;
}

function Sidebar({ children, currentUser }: SidebarProps) {
  return (
    <div className="h-full ">
      <DesktopSidebar currentUser={currentUser as IUser} />
      <MobileFooter />
      <main className="lg:pl-20 h-full bg-[#fff]">{children}</main>
    </div>
  );
}

export default Sidebar;
