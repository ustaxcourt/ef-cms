import { docketEntryFileUploadSequenceDecorator } from './docketEntryFileUploadSequenceDecorator';

describe('fileUploadSequenceDecorator', () => {
  it('should return an array of actions (functions) that uploads a pdf for a docketEntry, handles errors, and add the provided array of actions (functions) to the success path', () => {
    const mockActionsArray = [jest.fn(), jest.fn(), jest.fn()];

    const result = docketEntryFileUploadSequenceDecorator(mockActionsArray);

    expect(result).toMatchObject([
      expect.any(Function),
      expect.any(Function),
      {
        error: [expect.any(Function)],
        success: [
          expect.any(Function),
          ...mockActionsArray,
          expect.any(Function),
        ],
      },
    ]);
  });
});
