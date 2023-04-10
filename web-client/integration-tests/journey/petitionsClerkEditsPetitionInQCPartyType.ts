import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkEditsPetitionInQCPartyType = cerebralTest => {
  return it('Petitions clerk edits party type during petition QC from one with a primary and secondary petitioner to one with only a primary petitioner', async () => {
    await cerebralTest.runSequence('gotoPetitionQcSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual('PetitionQc');

    await cerebralTest.runSequence('updateCasePartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.estate,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'William Wonka',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Charlie Bucket',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '999 Wonka Street',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Oompaville',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'TX',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '98745',
    });
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '987456321',
    });

    await cerebralTest.runSequence('saveSavedCaseForLaterSequence');

    expect(cerebralTest.getState('validationErrors')).toEqual({});
  });
};
