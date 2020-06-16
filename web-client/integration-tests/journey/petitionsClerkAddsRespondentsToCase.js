import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsRespondentsToCase = test => {
  return it('Petitions clerk manually adds multiple irsPractitioners to case', async () => {
    expect(test.getState('caseDetail.irsPractitioners')).toEqual([]);

    await test.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      test.getState('validationErrors.respondentSearchError'),
    ).toBeDefined();

    await test.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT6789',
    });

    await test.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      test.getState('validationErrors.respondentSearchError'),
    ).toBeUndefined();
    expect(test.getState('modal.respondentMatches.length')).toEqual(1);

    //default selected because there was only 1 match
    let respondentMatch = test.getState('modal.respondentMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(respondentMatch.userId);

    await test.runSequence('associateIrsPractitionerWithCaseSequence');

    expect(test.getState('caseDetail.irsPractitioners.length')).toEqual(1);
    expect(test.getState('caseDetail.irsPractitioners.0.name')).toEqual(
      respondentMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(1);
    expect(formatted.irsPractitioners[0].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );

    //add a second respondent
    await test.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT0987',
    });
    await test.runSequence('openAddIrsPractitionerModalSequence');

    expect(test.getState('modal.respondentMatches.length')).toEqual(1);
    respondentMatch = test.getState('modal.respondentMatches.0');
    expect(test.getState('modal.user.userId')).toEqual(respondentMatch.userId);

    await test.runSequence('associateIrsPractitionerWithCaseSequence');
    expect(test.getState('caseDetail.irsPractitioners.length')).toEqual(2);
    expect(test.getState('caseDetail.irsPractitioners.1.name')).toEqual(
      respondentMatch.name,
    );

    formatted = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(2);
    expect(formatted.irsPractitioners[1].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );
  });
};
