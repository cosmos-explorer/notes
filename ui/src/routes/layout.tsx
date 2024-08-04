import { useAuth, useEmail } from '@/context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import { CircleUser } from "lucide-react";
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Logo from "@/components/icons/logo.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => {
  const {signout} = useAuth();
  const navigate = useNavigate();
  const user = useEmail();

  const handleSignout = () => {
    signout();
    navigate('/signin');
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex justify-between h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav
          className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Logo className="h-6 w-6"/>
            <div>Allobrain Notes</div>
          </Link>
        </nav>
        <div className="flex items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{ user }</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="cursor-pointer" onClick={ handleSignout }>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="min-h-[calc(100vh_-_theme(spacing.16))] bg-muted/40 p-4 md:p-4">
        { children }
      </main>
    </div>
  );
};

export default Layout;
