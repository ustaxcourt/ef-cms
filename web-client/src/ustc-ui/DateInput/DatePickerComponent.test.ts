import { getComputedInputValue } from './DatePickerComponentHelper';

describe('DatePickerComponent', () => {
  beforeEach(() => {
    global.window = {};
  });

  it('should output the correct string if provided a valid month, day, and year', () => {
    expect(
      getComputedInputValue({ day: '04', month: '05', year: '2001' }),
    ).toEqual('05/04/2001');
  });

  it('should output the empty string if not provided a valid year', () => {
    expect(getComputedInputValue({ day: '', month: '', year: '' })).toEqual('');
  });
});
