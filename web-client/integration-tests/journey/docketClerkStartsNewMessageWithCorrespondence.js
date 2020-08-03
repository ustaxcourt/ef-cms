import { messageModalHelper as messageModalHelperComputed } from '../../src/presenter/computeds/messageModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

const messageModalHelper = withAppContextDecorator(messageModalHelperComputed);

export const docketClerkStartsNewMessageWithCorrespondence = test => {
  const getHelper = () => {
    return runCompute(messageModalHelper, {
      state: test.getState(),
    });
  };

  it('docketclerk verifies correspondence is an available document when starting a new message', async () => {
    await test.runSequence('openCreateMessageModalSequence');

    let helper = getHelper();

    expect(helper.hasCorrespondence).toEqual(true);
    expect(helper.correspondence).toMatchObject([
      expect.objectContaining(test.correspondenceDocument),
    ]);
  });
};
