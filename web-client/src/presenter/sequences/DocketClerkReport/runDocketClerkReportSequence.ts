import { chooseDocketClerkReportPageTypeAction } from '../../actions/DocketClerkReport/chooseDocketClerkReportPageTypeAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { commitDocketClerkReportSelectionAction } from '../../actions/DocketClerkReport/commitDocketClerkReportSelectionAction';
import { getDocketClerkReportDocumentQcAction } from '../../actions/DocketClerkReport/getDocketClerkReportDocumentQcAction';
import { getDocketClerkReportMessagesAction } from '../../actions/DocketClerkReport/getDocketClerkReportMessagesAction';
import { validateDocketClerkReportAction } from '../../actions/DocketClerkReport/validateDocketClerkReportAction';

export const runDocketClerkReportSequence = [
  validateDocketClerkReportAction,
  {
    error: [],
    success: [
      commitDocketClerkReportSelectionAction,
      clearScreenMetadataAction,
      chooseDocketClerkReportPageTypeAction,
      {
        documentQC: [getDocketClerkReportDocumentQcAction],
        messages: [getDocketClerkReportMessagesAction],
      },
    ],
  },
] as unknown as () => void;
