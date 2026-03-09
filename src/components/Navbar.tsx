import CustomConnectButton from "@/components/dao/CustomConnectButton";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";

export default function Navbar(): JSX.Element {
  return (
    <nav className="sticky top-4 flex items-center justify-between py-3 px-5 rounded-full mt-4 w-full max-w-[1200px] mx-auto bg-gray-600/20 backdrop-blur-lg z-[100]" aria-label="Main navigation">
      <Link to="/" aria-label="Collective DAO home" className="focus:outline-none focus:ring-2 focus:ring-[#FF9100] focus:ring-offset-2 rounded-full">
        <Logo className="w-[150px] h-[50px]" />
      </Link>
      <CustomConnectButton />
    </nav>
  );
}
