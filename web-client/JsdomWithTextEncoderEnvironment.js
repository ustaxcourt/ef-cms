import JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * A custom JSDOM environment to set the TextEncoder
 */
// eslint-disable-next-line import/no-default-export
export default class JsdomWithTextEncoderEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
  }
}
