import Image from 'next/image';
import Link from 'next/link';

const Nav = () => {
  return (
    <nav className="shadow-md">
      <div className="flex container px-2 py-3 mx-auto justify-between items-center">
        <Link href="/" className="w-40 relative">
          <Image
            src="/pokemon-logo.png"
            alt="pokemon-logo"
            width="0"
            height="0"
            sizes="100vw"
            className="w-full h-auto"
          />
        </Link>

        <ul className="space-x-8 flex">
          <li>
            <Link href="/" className="font-semibold">
              Home
            </Link>
          </li>
          <li>
            <Link href="/gatcha" className="font-semibold">
              Gatcha
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
