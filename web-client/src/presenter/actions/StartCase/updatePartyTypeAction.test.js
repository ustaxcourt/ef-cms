import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { updatePartyTypeAction } from './updatePartyTypeAction';

describe('updatePartyTypeAction', () => {
  applicationContext.getUseCases().updateCase.mockReturnValue({});

  presenter.providers.applicationContext = applicationContext;

  const { COUNTRY_TYPES, PARTY_TYPES, USER_ROLES } =
    applicationContext.getConstants();

  const getFixtures = (props, state = {}) => ({
    modules: {
      presenter,
    },
    props,
    state: {
      ...state,
      user: {
        role: USER_ROLES.petitioner,
      },
    },
  });

  it('sets the partyType to Petitioner when filingType is updated to Myself', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'filingType',
        value: 'Myself',
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.petitioner);
  });

  it('sets the partyType to "Petitioner & Deceased Spouse" when "isSpouseDeceased" is updated to "Yes"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'isSpouseDeceased',
        value: 'Yes',
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.petitionerDeceasedSpouse);
  });

  it('sets the partyType to "Petitioner & Spouse" when "isSpouseDeceased" is updated to "No"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'isSpouseDeceased',
        value: 'No',
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.petitionerSpouse);
  });

  it('sets the partyType to "Donor" when "otherType" is updated to "Donor"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: PARTY_TYPES.donor,
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.donor);
  });

  it('sets the partyType to "Transferee" when "otherType" is updated to "Transferee"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: PARTY_TYPES.transferee,
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.transferee);
  });

  it('sets the partyType to "Surviving Spouse" when "otherType" is updated to "Deceased Spouse"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'otherType',
        value: 'Deceased Spouse',
      }),
    );
    expect(state.form.partyType).toEqual(PARTY_TYPES.survivingSpouse);
  });

  it('sets the partyType to the props.value passed in when key is "businessType"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'businessType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
  });

  it('unsets the partyType when key is "filingType" and value is not "Myself"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'filingType',
          value: 'A business',
        },
        {
          partyType: PARTY_TYPES.petitioner,
        },
      ),
    );
    expect(state.form.partyType).toBeUndefined();
  });

  it('sets the partyType to the props.value passed in when the key is "estateType" and set form.otherType to "An estate or trust"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'estateType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
    expect(state.form.otherType).toEqual('An estate or trust');
  });

  it('sets the partyType to the props.value passed in when the key is "minorIncompetentType" and set form.otherType to "A minor or incompetent person"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures({
        key: 'minorIncompetentType',
        value: 'Any Value',
      }),
    );
    expect(state.form.partyType).toEqual('Any Value');
    expect(state.form.otherType).toEqual(
      'A minor or legally incompetent person',
    );
  });

  it('resets the state.form.ownershipDisclosureFile and state.form.businessTyp when form.filingType is anything other than "A business"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'anything',
          value: 'Any Value',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            businessType: 'some value',
            filingType: 'Not A business',
            ownershipDisclosureFile: 'a file',
          },
        },
      ),
    );
    expect(state.form.businessType).toBeUndefined();
    expect(state.form.ownershipDisclosureFile).toBeUndefined();
  });

  it('does not clear the petition.ownershipDisclosureFile and form.businessType when form.filingType is "A business"', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'anything',
          value: 'Any Value',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            businessType: 'some value',
            filingType: 'A business',
            ownershipDisclosureFile: 'a file',
          },
        },
      ),
    );
    expect(state.form.businessType).toEqual('some value');
    expect(state.form.ownershipDisclosureFile).toEqual('a file');
  });

  it('sets form.contactPrimary and form.contactSecondary to empty objects if the party type was overridden', async () => {
    const { state } = await runAction(
      updatePartyTypeAction,
      getFixtures(
        {
          key: 'filingType',
          value: 'Myself',
        },
        {
          constants: {
            COUNTRY_TYPES,
            PARTY_TYPES: [],
          },
          form: {
            contactPrimary: 'some value',
            contactSecondary: 'some other value',
          },
        },
      ),
    );
    expect(state.form.contactPrimary).toEqual({
      countryType: COUNTRY_TYPES.DOMESTIC,
    });
    expect(state.form.contactSecondary).toEqual({});
  });
});
