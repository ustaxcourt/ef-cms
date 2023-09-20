import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { generateTitlePreviewAction } from '../actions/EditDocketRecordEntry/generateTitlePreviewAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryMetaDocumentFormValueSequence = [
  setFileDocumentFormValueAction,
  updateDocketEntryWizardDataAction,
  chooseMetaTypePathAction,
  {
    courtIssued: [],
    document: [
      getComputedFormDateFactoryAction('serviceDate'),
      setComputeFormDateFactoryAction('serviceDate'),
      generateTitlePreviewAction,
    ],
    noDocument: [],
  },
];
