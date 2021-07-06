import { partiesInformationHelper } from '../../src/presenter/computeds/partiesInformationHelper';
import { runCompute } from 'cerebral/test';
import { viewCounselHelper } from '../../src/presenter/computeds/viewCounselHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

export const adcViewsPractitionerOnCaseAfterPetitionerRemoved = test => {
  return it('adc views practitioner modal on case after petitioner has been removed during petition QC', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');

    const partiesInformationHelperComputed = runCompute(
      withAppContextDecorator(partiesInformationHelper),
      {
        state: test.getState(),
      },
    );

    const petitioner = partiesInformationHelperComputed.formattedPetitioners[0];

    await test.runSequence('showViewPetitionerCounselModalSequence', {
      privatePractitioner: petitioner.representingPractitioners[0],
    });

    const viewCounselHelperComputed = runCompute(viewCounselHelper, {
      state: test.getState(),
    });

    expect(viewCounselHelperComputed.representingNames).toEqual([
      'William Wonka',
    ]);
  });
};
