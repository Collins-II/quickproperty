import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import Property from "./Property";
import Dropdown from "../ui/dropdown";
import { IListingsParams } from "@/app/actions/getListings";

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
}) => {
  return (
    <div className="fixed w-full bg-white z-40 ">
      <div
        className="
          py-2
        "
      >
        <Container>
          <div
            className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
          >
            <Logo />
            <div className="hidden lg:block">
              <Property />
            </div>
            <UserMenu />
          </div>
        </Container>
      </div>
      <div className="lg:hidden flex justify-center px-10">
        <Property />
      </div>
      <Dropdown />
    </div>
  );
}


export default Navbar;