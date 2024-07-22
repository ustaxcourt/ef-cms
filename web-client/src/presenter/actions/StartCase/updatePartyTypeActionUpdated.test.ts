import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { updatePartyTypeActionUpdated } from '@web-client/presenter/actions/StartCase/updatePartyTypeActionUpdated';

describe('updatePartyTypeActionUpdated', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should update state correctly when "filingType" is "Myself"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'filingType',
        value: 'Myself',
      },
      state: {
        form: {
          businessType: 'businessType',
          corporateDisclosureFile: 'corporateDisclosureFile',
          corporateDisclosureFileSize: 'corporateDisclosureFileSize',
          estateType: 'estateType',
          hasSpouseConsent: 'hasSpouseConsent',
          isSpouseDeceased: 'isSpouseDeceased',
          minorIncompetentType: 'minorIncompetentType',
          otherType: 'otherType',
          partyType: undefined,
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('should update state correctly when "filingType" is "Individual petitioner"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'filingType',
        value: 'Individual petitioner',
      },
      state: {
        form: {
          businessType: 'businessType',
          corporateDisclosureFile: 'corporateDisclosureFile',
          corporateDisclosureFileSize: 'corporateDisclosureFileSize',
          estateType: 'estateType',
          hasSpouseConsent: 'hasSpouseConsent',
          isSpouseDeceased: 'isSpouseDeceased',
          minorIncompetentType: 'minorIncompetentType',
          otherType: 'otherType',
          partyType: undefined,
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: PARTY_TYPES.petitioner,
    });
  });

  it('should update state correctly when "filingType" is neither "Myself" or "Individual petitioner"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'filingType',
        value: 'SOME RANDOM VALUE',
      },
      state: {
        form: {
          businessType: 'businessType',
          corporateDisclosureFile: 'corporateDisclosureFile',
          corporateDisclosureFileSize: 'corporateDisclosureFileSize',
          estateType: 'estateType',
          hasSpouseConsent: 'hasSpouseConsent',
          isSpouseDeceased: 'isSpouseDeceased',
          minorIncompetentType: 'minorIncompetentType',
          otherType: 'otherType',
          partyType: 'PREVIOUS PARTY TYPE',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: 'PREVIOUS PARTY TYPE',
    });
  });

  it('should update state correctly when "isSpouseDeceased" is "Yes"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'isSpouseDeceased',
        value: 'Yes',
      },
      state: {
        form: {
          partyType: undefined,
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: PARTY_TYPES.petitionerDeceasedSpouse,
    });
  });

  it('should update state correctly when "isSpouseDeceased" is "No"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'isSpouseDeceased',
        value: 'No',
      },
      state: {
        form: {
          partyType: undefined,
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: PARTY_TYPES.petitionerSpouse,
    });
  });

  it('should update state correctly when "isSpouseDeceased" is neither "Yes" or "No"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'isSpouseDeceased',
        value: 'SOMETHING ELSE',
      },
      state: {
        form: {
          partyType: 'PREVIOUS PARTY TYPE',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: 'PREVIOUS PARTY TYPE',
    });
  });

  it('should update state correctly when "otherType" is "Deceased Spouse"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'otherType',
        value: 'Deceased Spouse',
      },
      state: {
        form: {
          estateType: 'estateType',
          minorIncompetentType: 'minorIncompetentType',
          otherType: undefined,
          partyType: 'partyType',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      otherType: 'Deceased Spouse',
      partyType: PARTY_TYPES.survivingSpouse,
    });
  });

  it('should update state correctly when "otherType" is "Donor"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'otherType',
        value: 'Donor',
      },
      state: {
        form: {
          estateType: 'estateType',
          minorIncompetentType: 'minorIncompetentType',
          otherType: undefined,
          partyType: 'partyType',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      otherType: 'Donor',
      partyType: 'Donor',
    });
  });

  it('should update state correctly when "otherType" is "Transferee"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'otherType',
        value: 'Transferee',
      },
      state: {
        form: {
          estateType: 'estateType',
          minorIncompetentType: 'minorIncompetentType',
          otherType: undefined,
          partyType: 'partyType',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      otherType: 'Transferee',
      partyType: 'Transferee',
    });
  });

  it('should update state correctly when "otherType" is neither "Deceased Spouse", "Donor" or "Transferee"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'otherType',
        value: 'SOME RANDOM VALUE',
      },
      state: {
        form: {
          estateType: 'estateType',
          minorIncompetentType: 'minorIncompetentType',
          otherType: 'PREVIOUS OTHER TYPE',
          partyType: 'partyType',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      otherType: 'SOME RANDOM VALUE',
    });
  });

  it('should update state correctly when "businessType"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'businessType',
        value: 'SOME RANDOM VALUE',
      },
      state: {
        form: {
          partyType: 'PREVIOUS PARTY TYPE',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: 'SOME RANDOM VALUE',
    });
  });

  it('should update state correctly when "estateType"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'estateType',
        value: 'SOME RANDOM VALUE',
      },
      state: {
        form: {
          partyType: 'PREVIOUS PARTY TYPE',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: 'SOME RANDOM VALUE',
    });
  });

  it('should update state correctly when "minorIncompetentType"', async () => {
    const results = await runAction(updatePartyTypeActionUpdated, {
      modules: {
        presenter,
      },
      props: {
        key: 'minorIncompetentType',
        value: 'SOME RANDOM VALUE',
      },
      state: {
        form: {
          partyType: 'PREVIOUS PARTY TYPE',
        },
      },
    });

    const { form } = results.state;
    expect(form).toEqual({
      partyType: 'SOME RANDOM VALUE',
    });
  });
});
