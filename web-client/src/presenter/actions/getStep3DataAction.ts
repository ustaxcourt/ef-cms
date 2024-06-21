import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { state } from '@web-client/presenter/app.cerebral';

export const getStep3DataAction = ({
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const { caseType, hasIrsNotice, irsNoticesRedactionAcknowledgement } = get(
    state.form,
  );
  const irsNotices = get(state.irsNoticeUploadFormInfo);
  const hasUploadedIrsNotice = irsNotices?.some(notice => 'file' in notice);
  const irsNoticesWithFormattedDate = irsNotices.map(irsNotice => {
    return {
      ...irsNotice,
      noticeIssuedDateFormatted:
        irsNotice.noticeIssuedDate &&
        formatDateString(irsNotice.noticeIssuedDate, FORMATS.MMDDYY),
    };
  });

  const step3Data = {
    caseType: hasIrsNotice ? irsNotices[0].caseType : caseType,
    hasIrsNotice,
    hasUploadedIrsNotice,
    irsNotices: irsNoticesWithFormattedDate,
    irsNoticesRedactionAcknowledgement,
  };

  return {
    step3Data,
  };
};
