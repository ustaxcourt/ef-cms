import { applicationContext } from '../../applicationContext';
import { formattedMessageDetail as formattedMessageDetailComputed } from './formattedMessageDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedMessageDetail = withAppContextDecorator(
  formattedMessageDetailComputed,
  {
    ...applicationContext,
  },
);

describe('formattedMessageDetail', () => {
  it('formats the message detail with createdAtFormatted', () => {
    const result = runCompute(formattedMessageDetail, {
      state: {
        messageDetail: {
          caseId: '78fb798f-66c3-42fa-bb5a-c14fac735b61',
          createdAt: '2019-03-01T21:40:46.415Z',
          messageId: '60e129bf-b8ec-4e0c-93c7-9633ab69f5df',
        },
      },
    });

    expect(result).toMatchObject({
      createdAtFormatted: '03/01/19',
    });
  });
});
