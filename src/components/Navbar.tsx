'use client';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
  // This returns if the session is active or not
  const { data: session } = useSession();

  // This gives the session's user (defined in src/app/api/auth/[...nextauth]/options.ts)
  const currUser: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Hello
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome {currUser.username || currUser.email}
            </span>
            <Button onClick={() => signOut()}>Logout</Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
