import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitlePreviewAction } from '../actions/EditDocketRecordEntry/generateTitlePreviewAction';
import { setFormValueAction } from '../actions/setFormValueAction';
import { updateDocketEntryWizardDataAction } from '../actions/DocketEntry/updateDocketEntryWizardDataAction';

export const updateDocketEntryMetaDocumentFormValueSequence = [
  setFormValueAction,
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
