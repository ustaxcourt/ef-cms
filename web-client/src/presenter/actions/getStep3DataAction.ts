import { state } from '@web-client/presenter/app.cerebral';

export const getStep3DataAction = ({
  get,
}: ActionProps<{ selectedPage: number }>) => {
  const { caseType, hasIrsNotice, irsNoticesRedactionAcknowledgement } = get(
    state.form,
  );
  const irsNotices = get(state.irsNoticeUploadFormInfo);

  const step3Data = {
    caseType,
    hasIrsNotice,
    irsNotices,
    irsNoticesRedactionAcknowledgement,
  };

  return {
    step3Data,
  };
};
