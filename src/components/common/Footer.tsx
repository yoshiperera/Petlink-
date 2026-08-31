import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-teal text-teal-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-white" />
            <span className="text-lg font-extrabold">Petlink</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/75">
            Community-powered platform helping reunite lost pets with their families.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/lost-pets" className="hover:text-white">
                Lost Pets
              </Link>
            </li>
            <li>
              <Link to="/found-pets" className="hover:text-white">
                Found Pets
              </Link>
            </li>
            <li>
              <Link to="/happy-tails" className="hover:text-white">
                Happy Tails
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Resources</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>
              <Link to="/report-lost" className="hover:text-white">
                Report Lost Pet
              </Link>
            </li>
            <li>
              <Link to="/report-found" className="hover:text-white">
                Report Found Pet
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-white">
                Sign In
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15 py-5 text-center text-xs text-white/70">
        Â© {new Date().getFullYear()} Petlink. Made with love for pets and their families.
      </div>
    </footer>
  );
}

