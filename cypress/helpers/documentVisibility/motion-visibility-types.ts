import { PublicDocketEntry } from '@shared/business/entities/cases/PublicDocketEntry';

export type MotionVisibilityPublicDocketEntry = {
  docketEntryId: string;
  index: number;
  eventCode?: string;
};

export type MotionVisibilityDocketEntries = {
  briefInSupport: MotionVisibilityPublicDocketEntry;
  memorandaInSupport: MotionVisibilityPublicDocketEntry;
  motion: MotionVisibilityPublicDocketEntry;
};

export type MotionVisibilityCaseFixture = {
  docketNumber: string;
  entries: MotionVisibilityDocketEntries;
};

export type UnassociatedExternalRole = {
  login: () => void;
  role: string;
};

export type MotionForLeaveDocketEntries = {
  motionForLeave: MotionVisibilityPublicDocketEntry;
  lodgedSecondary: MotionVisibilityPublicDocketEntry;
  primarySupportingEntries: MotionVisibilityPublicDocketEntry[];
  lodgedSecondarySupportingEntries: MotionVisibilityPublicDocketEntry[];
};

export function getMotionVisibilityPublicDocketEntry(
  docketEntry: PublicDocketEntry,
): MotionVisibilityPublicDocketEntry {
  const { docketEntryId, index, eventCode } = docketEntry;

  if (docketEntryId === undefined || index === undefined) {
    throw new Error(`Docket entry ${eventCode} is missing id or index`);
  }

  return { docketEntryId, index, eventCode };
}
