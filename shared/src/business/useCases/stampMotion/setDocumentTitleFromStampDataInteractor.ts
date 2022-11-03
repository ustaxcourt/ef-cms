import { FORMATS, formatDateString } from '../../utilities/DateHandler';
import { MOTION_DISPOSITIONS } from '../../entities/EntityConstants';

/**
 * setDocumentTitleFromStampDataInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.stampMotionForm the stamp motion form
 * @returns {string} formattedDocumentTitle
 */
export const setDocumentTitleFromStampDataInteractor = ({
  stampMotionForm,
}: {
  stampMotionForm: {
    customText?: string;
    date?: string;
    deniedAsMoot?: boolean;
    deniedWithoutPrejudice?: boolean;
    disposition?: string;
    dueDateMessage?: string;
    jurisdictionalOption?: string;
    strickenFromTrialSession?: string;
  };
}) => {
  const {
    customText,
    date,
    deniedAsMoot,
    deniedWithoutPrejudice,
    disposition,
    dueDateMessage,
    jurisdictionalOption,
    strickenFromTrialSession,
  } = stampMotionForm;

  let formattedDraftDocumentTitle = `${disposition.toUpperCase()}`;

  if (disposition === MOTION_DISPOSITIONS.DENIED) {
    if (deniedAsMoot) {
      formattedDraftDocumentTitle =
        formattedDraftDocumentTitle.concat(' as moot');
    }

    if (deniedWithoutPrejudice) {
      formattedDraftDocumentTitle =
        formattedDraftDocumentTitle.concat(' without prejudice');
    }
  }

  if (strickenFromTrialSession) {
    formattedDraftDocumentTitle = formattedDraftDocumentTitle.concat(
      ` - ${strickenFromTrialSession.toLowerCase()}`,
    );
  }

  if (jurisdictionalOption) {
    formattedDraftDocumentTitle = formattedDraftDocumentTitle.concat(
      ` - ${jurisdictionalOption.toLowerCase()}`,
    );
  }

  let dateFormatted;
  if (date) {
    dateFormatted = formatDateString(date, FORMATS.MMDDYYYY);
    formattedDraftDocumentTitle = formattedDraftDocumentTitle.concat(
      ` - ${dueDateMessage?.toLowerCase()} ${dateFormatted}`,
    );
  }

  if (customText) {
    formattedDraftDocumentTitle = formattedDraftDocumentTitle.concat(
      ` - ${customText}`,
    );
  }

  return formattedDraftDocumentTitle;
};
