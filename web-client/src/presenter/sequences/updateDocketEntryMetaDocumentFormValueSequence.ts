import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { generateTitlePreviewAction } from '../actions/EditDocketRecordEntry/generateTitlePreviewAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryMetaDocumentFormValueSequence = [
  setFileDocumentFormValueAction,
  updateDocketEntryWizardDataAction,
  chooseMetaTypePathAction,
  {
    courtIssued: [],
    document: [generateTitlePreviewAction],
    noDocument: [],
  },
];
