// components/Sidebar.js
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar() {
  const { pathname } = useRouter();

  const linkBase =
    "flex items-center gap-3 px-4 py-2 rounded-md transition hover:bg-gray-800";
  const active = "bg-gray-800 text-white";
  const inactive = "text-gray-300";

  return (
    <aside className="h-screen w-56 bg-gray-900 text-gray-100 flex flex-col">
      <h1 className="text-2xl font-semibold px-6 py-5">Menu</h1>

      <nav className="flex-1 space-y-2 px-2">
        <Link href="/" className={`${linkBase} ${pathname === "/" ? active : inactive}`}>
          Beranda
        </Link>

        <Link
          href="/profile"
          className={`${linkBase} ${pathname.startsWith("/profile") ? active : inactive}`}
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}
