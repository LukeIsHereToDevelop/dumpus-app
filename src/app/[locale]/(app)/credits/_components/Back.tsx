"use client";

import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Link from "~/components/Link";

export default function Back() {
  return (
    <div className="hidden px-4 pt-4 desktop-container sm:block">
      <Link
        href="/settings"
        className="-ml-2 inline-flex items-center rounded-md p-2 transition-colors hover:bg-gray-800 hover:text-white"
      >
        <ChevronLeftIcon className="-ml-1 mr-2 h-6 w-6" />
        <span>Back to Settings</span>
      </Link>
    </div>
  );
}
