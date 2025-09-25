import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { getDocumentTitleForNoticeOfChange } from '@shared/business/utilities/getDocumentTitleForNoticeOfChange';
import { DOCUMENT_RELATIONSHIPS } from '@shared/business/entities/EntityConstants';
import { dateStringsCompared } from '@shared/business/utilities/DateHandler';

export type OriginalNoticeValues = {
  documentTitleForNotice: string;
  filedBy?: string;
};

export const getOriginalNoticeValues = ({
  applicationContext,
  docketEntry,
}: {
  applicationContext: any;
  docketEntry: any;
}): OriginalNoticeValues => {
  let { filedBy } = docketEntry;
  let documentTitleForNotice = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry,
  });

  if (
    docketEntry.editState &&
    typeof docketEntry.editState === 'string' &&
    docketEntry.editState !== '{}'
  ) {
    try {
      const parsedEditState = JSON.parse(docketEntry.editState);

      if (parsedEditState && typeof parsedEditState === 'object') {
        const parsedTitle = getDocumentTitleForNoticeOfChange({
          applicationContext,
          docketEntry: parsedEditState,
        });

        if (parsedTitle) {
          documentTitleForNotice = parsedTitle;
        }

        const { filedBy: parsedFiledBy } = parsedEditState;
        if (parsedFiledBy) {
          filedBy = parsedFiledBy;
        }
      }
    } catch (err) {
      // ignore malformed editState data
    }
  }

  return { documentTitleForNotice, filedBy };
};

export const buildUpdatedPrimaryDocketEntry = ({
  authorizedUser,
  docketEntry,
  editableFields,
  petitioners,
}: {
  authorizedUser: any;
  docketEntry: any;
  editableFields: Record<string, unknown>;
  petitioners: any[];
}) =>
  new DocketEntry(
    {
      ...docketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { authorizedUser, petitioners },
  ).validate();

export const needsNewCoversheet = ({
  applicationContext,
  currentDocketEntry,
  updatedDocketEntry,
}: {
  applicationContext: any;
  currentDocketEntry: any;
  updatedDocketEntry: any;
}) => {
  const receivedAtUpdated =
    dateStringsCompared(
      currentDocketEntry.receivedAt,
      updatedDocketEntry.receivedAt,
    ) !== 0;
  const certificateOfServiceUpdated =
    currentDocketEntry.certificateOfService !==
    updatedDocketEntry.certificateOfService;
  const documentTitleUpdated =
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: currentDocketEntry,
    }) !==
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: updatedDocketEntry,
    });

  return (
    receivedAtUpdated || certificateOfServiceUpdated || documentTitleUpdated
  );
};
