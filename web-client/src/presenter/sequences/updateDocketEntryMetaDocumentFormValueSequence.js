import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitlePreviewAction } from '../actions/EditDocketRecordEntry/generateTitlePreviewAction';
import { setFileDocumentFormValueAction } from '../actions/setFileDocumentFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryMetaDocumentFormValueSequence = [
  setFileDocumentFormValueAction,
  updateDocketEntryWizardDataAction,
  chooseMetaTypePathAction,
  {
    courtIssued: [],
    document: [
      computeCertificateOfServiceFormDateAction,
      generateTitlePreviewAction,
    ],
    noDocument: [],
  },
];
