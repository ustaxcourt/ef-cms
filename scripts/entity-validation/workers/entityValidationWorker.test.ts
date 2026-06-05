const mockPostMessage = jest.fn();
const mockOn = jest.fn();

jest.mock('worker_threads', () => ({
  parentPort: {
    on: mockOn,
    postMessage: mockPostMessage,
  },
}));

const mockGetFormattedValidationErrors = jest.fn();

const MockEntity = jest.fn().mockImplementation(() => ({
  getFormattedValidationErrors: mockGetFormattedValidationErrors,
}));

jest.mock('@shared/business/entities/cases/Case', () => ({
  Case: MockEntity,
}));
jest.mock('@shared/business/entities/Message', () => ({
  Message: MockEntity,
}));
jest.mock('@shared/business/entities/PractitionerDocument', () => ({
  PractitionerDocument: MockEntity,
}));
jest.mock('@shared/business/entities/trialSessions/TrialSession', () => ({
  TrialSession: MockEntity,
}));
jest.mock(
  '@shared/business/entities/trialSessions/TrialSessionWorkingCopy',
  () => ({
    TrialSessionWorkingCopy: MockEntity,
  }),
);
jest.mock('@shared/business/entities/User', () => ({
  User: MockEntity,
}));
jest.mock('@shared/business/entities/WorkItem', () => ({
  WorkItem: MockEntity,
}));

let messageHandler: (data: { entityName: string; records: any[] }) => void;

beforeAll(() => {
  require('./entityValidationWorker');
  messageHandler = mockOn.mock.calls[0][1];
});

beforeEach(() => {
  mockPostMessage.mockClear();
  MockEntity.mockClear();
  mockGetFormattedValidationErrors.mockReset();
});

describe('entityValidationWorker', () => {
  it('registers a message handler on parentPort', () => {
    expect(messageHandler).toBeDefined();
    expect(typeof messageHandler).toBe('function');
  });

  it('throws when parentPort is null', () => {
    jest.resetModules();
    jest.doMock('worker_threads', () => ({
      parentPort: null,
    }));
    expect(() => require('./entityValidationWorker')).toThrow(
      'This file must be run as a worker thread',
    );
    // Restore the real mock for subsequent tests
    jest.doMock('worker_threads', () => ({
      parentPort: {
        on: mockOn,
        postMessage: mockPostMessage,
      },
    }));
  });

  describe('mapEntityNameToClass', () => {
    it.each([
      'Case',
      'Message',
      'PractitionerDocument',
      'TrialSession',
      'TrialSessionWorkingCopy',
      'User',
      'WorkItem',
    ])('creates a %s entity from the record', entityName => {
      mockGetFormattedValidationErrors.mockReturnValue(null);

      messageHandler({ entityName, records: [{ id: '1' }] });

      expect(MockEntity).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith([]);
    });

    it('throws for an unknown entity name', () => {
      expect(() =>
        messageHandler({ entityName: 'UnknownEntity', records: [{}] }),
      ).toThrow('Unknown entity name: UnknownEntity');
    });
  });

  describe('validation error formatting', () => {
    it('posts an empty array when there are no validation errors', () => {
      mockGetFormattedValidationErrors.mockReturnValue(null);

      messageHandler({ entityName: 'User', records: [{ userId: 'u1' }] });

      expect(mockPostMessage).toHaveBeenCalledWith([]);
    });

    it('formats Case validation errors using docketNumber', () => {
      const validationErrors = { caseCaption: 'required' };
      mockGetFormattedValidationErrors.mockReturnValue(validationErrors);

      messageHandler({
        entityName: 'Case',
        records: [{ docketNumber: '101-23' }],
      });

      expect(mockPostMessage).toHaveBeenCalledWith([
        `Validation errors for Case 101-23: ${JSON.stringify(validationErrors)}`,
      ]);
    });

    it('formats non-Case validation errors using camelCased entity id field', () => {
      const validationErrors = { subject: 'required' };
      mockGetFormattedValidationErrors.mockReturnValue(validationErrors);

      messageHandler({
        entityName: 'Message',
        records: [{ messageId: 'msg-1' }],
      });

      expect(mockPostMessage).toHaveBeenCalledWith([
        `Validation errors for Message msg-1: ${JSON.stringify(validationErrors)}`,
      ]);
    });

    it('handles multiple records with mixed valid and invalid results', () => {
      mockGetFormattedValidationErrors
        .mockReturnValueOnce(null)
        .mockReturnValueOnce({ name: 'required' })
        .mockReturnValueOnce(null);

      messageHandler({
        entityName: 'User',
        records: [{ userId: 'u1' }, { userId: 'u2' }, { userId: 'u3' }],
      });

      expect(MockEntity).toHaveBeenCalledTimes(3);
      expect(mockPostMessage).toHaveBeenCalledWith([
        `Validation errors for User u2: ${JSON.stringify({ name: 'required' })}`,
      ]);
    });

    it('collects errors from all invalid records', () => {
      mockGetFormattedValidationErrors
        .mockReturnValueOnce({ a: '1' })
        .mockReturnValueOnce({ b: '2' });

      messageHandler({
        entityName: 'WorkItem',
        records: [{ workItemId: 'w1' }, { workItemId: 'w2' }],
      });

      expect(mockPostMessage).toHaveBeenCalledWith([
        `Validation errors for WorkItem w1: ${JSON.stringify({ a: '1' })}`,
        `Validation errors for WorkItem w2: ${JSON.stringify({ b: '2' })}`,
      ]);
    });

    it('posts an empty array when records array is empty', () => {
      messageHandler({ entityName: 'User', records: [] });

      expect(mockPostMessage).toHaveBeenCalledWith([]);
    });
  });
});
