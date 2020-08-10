import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setHasOdsAction } from './setHasOdsAction';

presenter.providers.applicationContext = applicationContext;
const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();

describe('setHasOdsAction', () => {
  it('sets the state.hasOdsDocument true when an ODS (DISC) document is present on caseDetail', async () => {
    const result = await runAction(setHasOdsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [
            {
              eventCode: INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
            },
          ],
        },
      },
    });
    expect(result.state.hasOdsDocument).toEqual(true);
  });

  it('sets the state.hasOdsDocument false when an ODS (DISC) document is NOT present on caseDetail', async () => {
    const result = await runAction(setHasOdsAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {
          documents: [],
        },
      },
    });
    expect(result.state.hasOdsDocument).toEqual(false);
  });
});
