"use client";

import Section from "~/components/Section";
import DetailCard from "~/components/data/DetailCard";
import { Icon } from "~/types";
import {
  ArrowTopRightOnSquareIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { SimpleIconsDiscord, SimpleIconsGithub } from "~/components/icons";
import { BASE_URL, VERSION } from "~/constants";
import useCopy from "../_hooks/use-copy";

function LeftIcon({ icon: Icon }: { icon: Icon }) {
  return <Icon className="h-8 w-8" />;
}

export default function About() {
  const copy = useCopy();

  return (
    <Section title="About">
      <div className="grid grid-cols-1 gap-2 px-2 sm:grid-cols-2">
        <DetailCard
          title={VERSION}
          description="Version"
          onClick={() => copy(VERSION)}
          reverseTexts
          leftSlot={<LeftIcon icon={InformationCircleIcon} />}
          rightIcon={ClipboardDocumentIcon}
        />
        <DetailCard
          href={BASE_URL}
          noI18n
          target="_blank"
          title={new URL(BASE_URL).hostname}
          description="Web application"
          reverseTexts
          leftSlot={<LeftIcon icon={GlobeAltIcon} />}
          rightIcon={ArrowTopRightOnSquareIcon}
        />
        <DetailCard
          href="https://androz2091.fr/discord"
          noI18n
          target="_blank"
          title="Discord"
          description="Community"
          reverseTexts
          leftSlot={<LeftIcon icon={SimpleIconsDiscord} />}
          rightIcon={ArrowTopRightOnSquareIcon}
        />
        <DetailCard
          href="https://github.com/dumpus-app/dumpus-app"
          noI18n
          target="_blank"
          title="GitHub"
          description="Contribute"
          reverseTexts
          leftSlot={<LeftIcon icon={SimpleIconsGithub} />}
          rightIcon={ArrowTopRightOnSquareIcon}
        />
        <DetailCard
          href="/credits"
          title="Credits"
          description="Project's contributors"
          reverseTexts
          leftSlot={<LeftIcon icon={UserGroupIcon} />}
          rightIcon={ChevronRightIcon}
        />
      </div>
    </Section>
  );
}
