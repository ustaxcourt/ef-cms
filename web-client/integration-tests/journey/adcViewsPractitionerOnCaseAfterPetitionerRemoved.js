import { partiesInformationHelper } from '../../src/presenter/computeds/partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { viewCounselHelper } from '../../src/presenter/computeds/viewCounselHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export const adcViewsPractitionerOnCaseAfterPetitionerRemoved =
  cerebralTest => {
    return it('adc views practitioner modal on case after petitioner has been removed during petition QC', async () => {
      await cerebralTest.runSequence('gotoCaseDetailSequence', {
        docketNumber: cerebralTest.docketNumber,
      });

      expect(cerebralTest.getState('currentPage')).toEqual(
        'CaseDetailInternal',
      );

      const partiesInformationHelperComputed = runCompute(
        withAppContextDecorator(partiesInformationHelper),
        {
          state: cerebralTest.getState(),
        },
      );

      const petitioner =
        partiesInformationHelperComputed.formattedPetitioners[0];

      await cerebralTest.runSequence('showViewPetitionerCounselModalSequence', {
        privatePractitioner: petitioner.representingPractitioners[0],
      });

      const viewCounselHelperComputed = runCompute(viewCounselHelper, {
        state: cerebralTest.getState(),
      });

      expect(viewCounselHelperComputed.representingNames).toEqual([
        'William Wonka',
      ]);
    });
  };
