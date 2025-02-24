"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import Button from "~/components/Button";
import { BASE_URL } from "~/constants";
import useTopDMsData from "~/hooks/data/use-top-dms-data";
import useTopGuildsData from "~/hooks/data/use-top-guilds-data";
import useUsageStatsData from "~/hooks/data/use-usage-stats-data";
import useUserData from "~/hooks/data/use-user-data";
import useGenerateImg from "~/hooks/use-generate-img";
import { useAppStore } from "~/stores";
import { avatarURLFallback } from "~/utils/discord";
import { formatDuration, formatNumber } from "~/utils/format";

export default function SharePopup() {
  const [open, setOpen, generatingShareImage, setGeneratingShareImage] =
    useAppStore(({ ui }) => [
      ui.showSharePopup,
      ui.setShowSharePopup,
      ui.generatingShareImage,
      ui.setGeneratingShareImage,
    ]);

  const { init, generate, width, height } = useGenerateImg();
  const [url, setUrl] = useState<string>();
  const [file, setFile] = useState<File>();

  const data = useUserData();
  const { messageCount, totalSessionDuration, appStarted, networkSize } =
    useUsageStatsData(true);
  const { getData: getDMsData } = useTopDMsData();
  const { getData: getGuildsData } = useTopGuildsData();

  useEffect(() => {
    if (!open || !generatingShareImage) return;

    async function gen() {
      const { svgURL, file } = await generate({
        user: {
          displayName: data.package_owner_display_name,
          avatarURL: data.package_owner_avatar_url.replace(
            /.webp|.gif/,
            ".png"
          ),
        },
        stats: {
          messagesSent: formatNumber(messageCount(), { notation: "standard" }),
          timeSpent: formatDuration((totalSessionDuration() || 0) * 60_000),
          appOpenings: formatNumber(appStarted(), { notation: "standard" }),
          networkSize: formatNumber(networkSize(), { notation: "standard" }),
        },
        topDMS: (getDMsData({}) || []).slice(0, 3).map((dm) => {
          return {
            name: dm.user_name,
            // TODO: get latest url
            url: avatarURLFallback(dm.user_avatar_url, dm.dm_user_id).replace(
              /.webp|.gif/,
              ".png"
            ),
            count: formatNumber(dm.message_count),
          };
        }),
        topGuilds: (getGuildsData({}) || []).slice(0, 3).map((guild) => {
          return {
            name: guild.guild_name,
            url: "https://cdn.discordapp.com/embed/avatars/0.png",
            count: formatNumber(guild.message_count),
          };
        }),
      });
      setUrl(svgURL);
      setFile(file);
      setGeneratingShareImage(false);
    }

    init().then(() => {
      gen();
    });
  }, [
    appStarted,
    data.package_owner_avatar_url,
    data.package_owner_display_name,
    generate,
    generatingShareImage,
    getDMsData,
    getGuildsData,
    init,
    messageCount,
    networkSize,
    open,
    setGeneratingShareImage,
    totalSessionDuration,
  ]);

  const canShare = !!navigator.share;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-950 bg-opacity-80 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 bottom-safe-area-bottom-inset z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-2xl border border-gray-800 bg-gray-900 p-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div>
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: `${width}/${height}` }}
                  >
                    {url ? (
                      <Image
                        src={url || ""}
                        alt={``}
                        fill
                        className="rounded-lg object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full rounded-lg bg-gray-800"></div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-bold text-white sm:text-2xl"
                    >
                      Share your recap
                    </Dialog.Title>
                    <div className="space-y-2 px-4 text-base text-gray-400">
                      <p className="mt-2 text-gray-400">
                        Share your recap with your friends on Twitter,
                        Instagram, Reddit, Discord...! :)
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="brand"
                  className="mt-4 w-full"
                  onClick={async () => {
                    // TODO: detect os as well
                    try {
                      await navigator.share({
                        title: "Here is my Discord recap!",
                        text: "Generated on https://dumpus.app, try it yourself!",
                        url: BASE_URL,
                        files: [file!],
                      });
                    } catch (err: DOMException | any) {
                      if (err.name === "AbortError") {
                        // user aborted share intentionnally
                        return;
                      }
                      console.error(err);
                      const a = document.createElement("a");
                      document.body.appendChild(a);
                      a.setAttribute("style", "display: none");
                      a.setAttribute("href", url!);
                      a.download = "dumpus-share.png";
                      a.click();
                      a.remove();
                    }
                    setOpen(false);
                  }}
                  disabled={generatingShareImage}
                >
                  {generatingShareImage
                    ? "Generating..."
                    : canShare
                    ? "Share!"
                    : "Download!"}
                </Button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
