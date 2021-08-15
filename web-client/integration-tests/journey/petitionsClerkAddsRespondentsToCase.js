import { formattedCaseDetail as formattedCaseDetailComputed } from '../../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

export const petitionsClerkAddsRespondentsToCase = cerebralTest => {
  return it('Petitions clerk manually adds multiple irsPractitioners to case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('caseDetail.irsPractitioners')).toEqual([]);

    await cerebralTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.respondentSearchError'),
    ).toBeDefined();

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT6789',
    });

    await cerebralTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(
      cerebralTest.getState('validationErrors.respondentSearchError'),
    ).toBeUndefined();
    expect(cerebralTest.getState('modal.respondentMatches.length')).toEqual(1);

    //default selected because there was only 1 match
    let respondentMatch = cerebralTest.getState('modal.respondentMatches.0');
    expect(cerebralTest.getState('modal.user.userId')).toEqual(
      respondentMatch.userId,
    );

    await cerebralTest.runSequence('associateIrsPractitionerWithCaseSequence');

    expect(cerebralTest.getState('caseDetail.irsPractitioners.length')).toEqual(
      1,
    );
    expect(cerebralTest.getState('caseDetail.irsPractitioners.0.name')).toEqual(
      respondentMatch.name,
    );

    let formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(1);
    expect(formatted.irsPractitioners[0].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );

    //add a second respondent
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'respondentSearch',
      value: 'RT0987',
    });
    await cerebralTest.runSequence('openAddIrsPractitionerModalSequence');

    expect(cerebralTest.getState('modal.respondentMatches.length')).toEqual(1);
    respondentMatch = cerebralTest.getState('modal.respondentMatches.0');
    expect(cerebralTest.getState('modal.user.userId')).toEqual(
      respondentMatch.userId,
    );

    await cerebralTest.runSequence('associateIrsPractitionerWithCaseSequence');
    expect(cerebralTest.getState('caseDetail.irsPractitioners.length')).toEqual(
      2,
    );
    expect(cerebralTest.getState('caseDetail.irsPractitioners.1.name')).toEqual(
      respondentMatch.name,
    );

    formatted = runCompute(formattedCaseDetail, {
      state: cerebralTest.getState(),
    });

    expect(formatted.irsPractitioners.length).toEqual(2);
    expect(formatted.irsPractitioners[1].formattedName).toEqual(
      `${respondentMatch.name} (${respondentMatch.barNumber})`,
    );
  });
};
