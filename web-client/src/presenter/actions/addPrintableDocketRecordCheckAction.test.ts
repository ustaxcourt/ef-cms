import { addPrintableDocketRecordCheckAction } from '@web-client/presenter/actions/addPrintableDocketRecordCheckAction';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('addPrintableDocketRecordCheckAction', () => {
  const mockYesPath = jest.fn();
  const mockNoPath = jest.fn();

  presenter.providers.path = {
    no: mockNoPath,
    yes: mockYesPath,
  };

  presenter.providers.applicationContext = applicationContext;

  it('take the no path if isAddPrintableDocketRecordSelected is false', async () => {
    await runAction(addPrintableDocketRecordCheckAction, {
      modules: {
        presenter,
      },
      props: {
        isAddPrintableDocketRecordSelected: false,
      },
    });

    expect(mockNoPath).toHaveBeenCalled();
  });

  it('take the yes path if isAddPrintableDocketRecordSelected is true', async () => {
    await runAction(addPrintableDocketRecordCheckAction, {
      modules: {
        presenter,
      },
      props: {
        isAddPrintableDocketRecordSelected: true,
      },
    });

    expect(mockYesPath).toHaveBeenCalled();
  });
});
