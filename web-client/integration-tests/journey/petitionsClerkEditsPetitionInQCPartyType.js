import { PARTY_TYPES } from '../../../shared/src/business/entities/EntityConstants';

export const petitionsClerkEditsPetitionInQCPartyType = test => {
  return it('Petitions clerk edits party type during petition QC from one with a primary and secondary petitioner to one with only a primary petitioner', async () => {
    await test.runSequence('gotoPetitionQcSequence', {
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('PetitionQc');

    await test.runSequence('updateCasePartyTypeSequence', {
      key: 'partyType',
      value: PARTY_TYPES.estate,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'hasVerifiedIrsNotice',
      value: true,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.name',
      value: 'William Wonka',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.secondaryName',
      value: 'Charlie Bucket',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.address1',
      value: '999 Wonka Street',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.city',
      value: 'Oompaville',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.state',
      value: 'TX',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.postalCode',
      value: '98745',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'contactPrimary.phone',
      value: '987456321',
    });

    await test.runSequence('saveSavedCaseForLaterSequence');

    expect(test.getState('validationErrors')).toEqual({});
  });
};
