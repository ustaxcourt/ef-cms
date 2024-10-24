import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const createPractitionerUserHelper = (get: Get): any => {
  const { barNumber, originalEmail, practiceType } = get(state.form);

  return {
    canEditAdmissionStatus: !!barNumber,
    canEditEmail: !barNumber,
    formattedOriginalEmail: originalEmail || 'Not provided',
    isAddingPractitioner: !barNumber,
    isEditingPractitioner: !!barNumber,
    showFirmName: practiceType === 'Private',
  };
};
