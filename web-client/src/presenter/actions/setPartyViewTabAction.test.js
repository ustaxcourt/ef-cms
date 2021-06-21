import { PARTY_VIEW_TABS } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setPartyViewTabAction } from './setPartyViewTabAction';

describe('setPartyViewTabAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets state.currentViewMetadata.caseDetail.partyViewTab to petitionersAndCounsel', async () => {
    const tab = PARTY_VIEW_TABS.petitionersAndCounsel;
    const { state } = await runAction(setPartyViewTabAction, {
      modules: { presenter },
      props: {
        tab,
      },
    });

    expect(state.currentViewMetadata.caseDetail.partyViewTab).toEqual(tab);
  });
});
