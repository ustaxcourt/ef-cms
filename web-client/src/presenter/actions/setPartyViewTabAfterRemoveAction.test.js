import {
  CONTACT_TYPES,
  PARTY_VIEW_TABS,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPartyViewTabAfterRemoveAction } from './setPartyViewTabAfterRemoveAction';

describe('setPartyViewTabAfterRemoveAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets state.currentViewMetadata.caseDetail.partyViewTab to participantsAndCounsel when deleted contact is an intervenor and there are still otherFilers on the case', async () => {
    const { state } = await runAction(setPartyViewTabAfterRemoveAction, {
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
    });

    expect(state.currentViewMetadata.caseDetail.partyViewTab).toEqual(
      PARTY_VIEW_TABS.participantsAndCounsel,
    );
  });
});
