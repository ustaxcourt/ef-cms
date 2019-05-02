import { limitFileSize } from './limitFileSize';

global.alert = () => {};

describe('limit file uploads', () => {
  it('does not allow files over 500 MB', () => {
    let callbackTriggered = false;
    const e = { target: { files: [{ size: 5000000000 }], value: 'something' } };
    const callback = () => {
      callbackTriggered = true;
    };
    limitFileSize(e, 500, callback);
    expect(callbackTriggered).toBeFalsy();
    expect(e.target.value).toBeFalsy();
  });

  it('does allow files under 500 MB', () => {
    let callbackTriggered = false;
    const e = { target: { files: [{ size: 50 }], value: 'something' } };
    const callback = () => {
      callbackTriggered = true;
    };
    limitFileSize(e, 500, callback);
    expect(callbackTriggered).toBeTruthy();
    expect(e.target.value).toBeTruthy();
  });
});
