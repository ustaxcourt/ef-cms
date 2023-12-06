import {
  CONTACT_TYPES,
  PARTY_VIEW_TABS,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPartyViewTabAfterUpdatingPetitionersAction } from './setPartyViewTabAfterUpdatingPetitionersAction';

describe('setPartyViewTabAfterUpdatingPetitionersAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets state.currentViewMetadata.caseDetail.partyViewTab to participantsAndCounsel when deleted contact is an intervenor and there are still otherFilers on the case', async () => {
    const { state } = await runAction(
      setPartyViewTabAfterUpdatingPetitionersAction,
      {
        modules: { presenter },
        props: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.intervenor,
              },
            ],
          },
          contactType: CONTACT_TYPES.intervenor,
        },
      },
    );

    expect(state.currentViewMetadata.caseDetail.partyViewTab).toEqual(
      PARTY_VIEW_TABS.participantsAndCounsel,
    );
  });

  it('sets state.currentViewMetadata.caseDetail.partyViewTab to petitionersAndCounsel when deleted contact is an intervenor and there are no otherFilers on the case', async () => {
    const { state } = await runAction(
      setPartyViewTabAfterUpdatingPetitionersAction,
      {
        modules: { presenter },
        props: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.primary,
              },
            ],
          },
          contactType: CONTACT_TYPES.intervenor,
        },
      },
    );

    expect(state.currentViewMetadata.caseDetail.partyViewTab).toEqual(
      PARTY_VIEW_TABS.petitionersAndCounsel,
    );
  });

  it('sets state.currentViewMetadata.caseDetail.partyViewTab to petitionersAndCounsel when deleted contact is a petitioner', async () => {
    const { state } = await runAction(
      setPartyViewTabAfterUpdatingPetitionersAction,
      {
        modules: { presenter },
        props: {
          caseDetail: {
            petitioners: [
              {
                contactType: CONTACT_TYPES.primary,
              },
            ],
          },
          contactType: CONTACT_TYPES.primary,
        },
      },
    );

    expect(state.currentViewMetadata.caseDetail.partyViewTab).toEqual(
      PARTY_VIEW_TABS.petitionersAndCounsel,
    );
  });
});
