import { setPdfFormFields } from './setPdfFormFields';

describe('setFields function', () => {
  const getTextMock = jest.fn();
  const setTextMock = jest.fn();
  let name = 'PDFButton';
  let fields;

  beforeEach(() => {
    fields = [
      {
        constructor: { name },
        getText: getTextMock.mockReturnValue(''),
        setText: setTextMock,
      },
      {
        constructor: { name },
        getText: getTextMock.mockReturnValue(''),
        setText: setTextMock,
      },
    ];
  });

  it('should call getText and setText functions if field type name is PDFTextField', () => {
    const loremText = 'Lorem Ipsum';
    getTextMock.mockReturnValueOnce(loremText);
    fields[0].constructor.name = 'PDFTextField';

    setPdfFormFields(fields);

    expect(getTextMock).toHaveBeenCalledTimes(1);
    expect(setTextMock).toHaveBeenCalledWith(loremText);
  });

  it('should not call getText and setText functions if field type name is not PDFTextField', () => {
    fields[0].constructor.name = 'PDFCheckbox';

    setPdfFormFields(fields);

    expect(getTextMock).not.toHaveBeenCalled();
    expect(setTextMock).not.toHaveBeenCalled();
  });
});
