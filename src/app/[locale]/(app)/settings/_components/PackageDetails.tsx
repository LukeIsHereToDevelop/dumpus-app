"use client";

import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import Section from "~/components/Section";
import DetailCard from "~/components/data/DetailCard";
import { useSelectedPackage } from "~/stores";
import { formatDate } from "~/utils/format";
import useCopy from "../_hooks/use-copy";

export default function PackageDetails() {
  const selectedPackage = useSelectedPackage();
  const copy = useCopy();

  // During reset
  if (!selectedPackage) return null;

  return (
    <Section title="Package details">
      <div className="grid grid-cols-1 gap-2 px-2 sm:grid-cols-2">
        <DetailCard
          onClick={() => copy(selectedPackage.UPNKey)}
          title={selectedPackage.UPNKey}
          description="UPN Key"
          reverseTexts
          rightIcon={ClipboardDocumentIcon}
        />
        <DetailCard
          onClick={() =>
            copy(
              formatDate(selectedPackage.dateAdded, {
                hour: false,
                minute: false,
              })
            )
          }
          title={formatDate(selectedPackage.dateAdded, {
            hour: false,
            minute: false,
          })}
          description="Added on"
          reverseTexts
          rightIcon={ClipboardDocumentIcon}
        />
        <DetailCard
          onClick={() => copy(selectedPackage.package_id)}
          title={selectedPackage.package_id}
          description="Package ID"
          reverseTexts
          rightIcon={ClipboardDocumentIcon}
        />
        <DetailCard
          onClick={() => copy(selectedPackage.package_owner_name)}
          title={selectedPackage.package_owner_name}
          description="Discord user"
          reverseTexts
          rightIcon={ClipboardDocumentIcon}
        />
        <DetailCard
          onClick={() => copy(selectedPackage.backendURL)}
          title={selectedPackage.backendURL}
          description="Backend URL"
          reverseTexts
          rightIcon={ClipboardDocumentIcon}
        />
      </div>
    </Section>
  );
}
