"use client";

import clsx from "clsx";
import Button from "~/components/Button";
import { useAppStore } from "~/stores";

const isMobile = process.env.NEXT_PUBLIC_DEPLOY_ENV === "mobile";

export default function LoadMore({ loadMore }: { loadMore: () => void }) {
  const [premium, setOpen] = useAppStore(({ config, ui }) => [
    config.premium,
    ui.setShowInAppPurchasesDialog,
  ]);

  return (
    <>
      <div
        className={clsx(
          "relative",
          isMobile ? (premium ? "hidden" : "block") : "hidden"
        )}
      >
        <div className="absolute inset-0 top-auto h-16 bg-gradient-to-t from-gray-950 to-gray-950/0"></div>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={() => loadMore()}
          className={clsx(
            "text-brand-300 hover:underline",
            isMobile ? (premium ? "block" : "hidden") : "block"
          )}
        >
          Load more
        </button>
        <Button
          variant="premium"
          onClick={() => setOpen(true)}
          className={clsx(isMobile ? (premium ? "hidden" : "block") : "hidden")}
        >
          Unlock to view more!
        </Button>
      </div>
    </>
  );
}
