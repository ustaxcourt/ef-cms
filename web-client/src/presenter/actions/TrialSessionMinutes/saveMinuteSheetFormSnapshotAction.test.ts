import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { mockMinuteSheetFormState } from './mockMinuteSheetFormState';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { saveMinuteSheetFormSnapshotAction } from './saveMinuteSheetFormSnapshotAction';
import hash from 'object-hash';

describe('saveMinuteSheetFormSnapshotAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should store a hash of the current minute sheet form state', async () => {
    const mockState = {
      minuteSheetForm: mockMinuteSheetFormState,
    };

    const expectedHash = hash(mockMinuteSheetFormState);

    const result = await runAction(saveMinuteSheetFormSnapshotAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.state.minuteSheetFormSnapshot).toEqual(expectedHash);
  });

  it('should store a hash of an empty object when minute sheet form state is empty', async () => {
    const mockState = {
      minuteSheetForm: {},
    };

    const expectedHash = hash({});

    const result = await runAction(saveMinuteSheetFormSnapshotAction, {
      modules: {
        presenter,
      },
      state: mockState,
    });

    expect(result.state.minuteSheetFormSnapshot).toEqual(expectedHash);
  });
});
