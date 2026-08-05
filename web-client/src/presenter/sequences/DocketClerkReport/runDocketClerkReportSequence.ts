import { chooseDocketClerkReportPageTypeAction } from '../../actions/DocketClerkReport/chooseDocketClerkReportPageTypeAction';
import { clearScreenMetadataAction } from '../../actions/clearScreenMetadataAction';
import { commitDocketClerkReportSelectionAction } from '../../actions/DocketClerkReport/commitDocketClerkReportSelectionAction';
import { getDocketClerkReportDocumentQcAction } from '../../actions/DocketClerkReport/getDocketClerkReportDocumentQcAction';
import { getDocketClerkReportMessagesAction } from '../../actions/DocketClerkReport/getDocketClerkReportMessagesAction';
import { resetSelectedMessageAction } from '@web-client/presenter/actions/Messages/resetSelectedMessageAction';
import { setDocketClerkReportMessagesTableSortAction } from '../../actions/DocketClerkReport/setDocketClerkReportMessagesTableSortAction';
import { validateDocketClerkReportAction } from '../../actions/DocketClerkReport/validateDocketClerkReportAction';

export const runDocketClerkReportSequence = [
  validateDocketClerkReportAction,
  {
    error: [],
    success: [
      commitDocketClerkReportSelectionAction,
      clearScreenMetadataAction,
      resetSelectedMessageAction,
      chooseDocketClerkReportPageTypeAction,
      {
        documentQC: [getDocketClerkReportDocumentQcAction],
        messages: [
          setDocketClerkReportMessagesTableSortAction,
          getDocketClerkReportMessagesAction,
        ],
      },
    ],
  },
] as unknown as () => void;
