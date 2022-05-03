// const JsdomEnvironment = require('jest-environment-jsdom');
import JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * A custom environment to set the TextEncoder
 */
export default class JsdomWithTextEncoderEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
  }
}
