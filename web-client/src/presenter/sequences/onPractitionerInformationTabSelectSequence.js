import { getPractitionerDocumentsAction } from '../actions/getPractitionerDocumentsAction';
import { handlePractitionerInformationTabSelectAction } from '../actions/handlePractitionerInformationTabSelectAction';
import { setPractitionerDocumentsAction } from '../actions/setPractitionerDocumentsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const onPractitionerInformationTabSelectSequence = [
  handlePractitionerInformationTabSelectAction,
  {
    details: [],
    documentation: showProgressSequenceDecorator([
      getPractitionerDocumentsAction,
      setPractitionerDocumentsAction,
    ]),
  },
];
