import { CerebralTest } from 'cerebral/test';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { updateForwardFormValueSequence } from '../sequences/updateForwardFormValueSequence';

describe('updateForwardFormValueSequence', () => {
  let test;
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    presenter.sequences = {
      updateForwardFormValueSequence,
    };
    test = CerebralTest(presenter);
  });
  it('should set the non section items', async () => {
    await test.runSequence('updateForwardFormValueSequence', {
      form: 'form.abc',
      key: 'message',
      value: 'something',
      workItemId: 'abc',
    });
    expect(test.getState('form.abc')).toMatchObject({
      message: 'something',
    });
  });

  it('should set the section if not "Chambers"', async () => {
    test.setState('constants', {
      CHAMBERS_SECTION: 'chambers',
    });
    await test.runSequence('updateForwardFormValueSequence', {
      form: 'form.abc',
      key: 'section',
      value: 'something',
      workItemId: 'abc',
    });
    expect(test.getState('form.abc')).toMatchObject({
      section: 'something',
    });
    expect(test.getState('workItemMetadata')).toMatchObject({
      showChambersSelect: false,
    });
  });

  it('should not set the section if "chambers"', async () => {
    test.setState('constants', {
      CHAMBERS_SECTION: 'chambers',
    });
    await test.runSequence('updateForwardFormValueSequence', {
      form: 'form.abc',
      key: 'section',
      value: 'chambers',
      workItemId: 'abc',
    });
    expect(test.getState('form.abc')).toMatchObject({ section: '' });
    expect(test.getState('workItemMetadata')).toMatchObject({
      showChambersSelect: true,
    });
  });
});
