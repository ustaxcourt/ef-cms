import JSDOMEnvironment from 'jest-environment-jsdom';

/**
 * A custom JSDOM environment to set Node globals that JSDOM does not provide (TextEncoder, setImmediate, structuredClone, etc.)
 */
export default class JsdomWithTextEncoderEnvironment extends JSDOMEnvironment {
  async setup() {
    await super.setup();
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = await import('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = await import('util');
      this.global.TextDecoder = TextDecoder as any;
    }
    if (typeof this.global.setImmediate === 'undefined') {
      this.global.setImmediate = setImmediate;
      this.global.clearImmediate = clearImmediate;
    }
    if (typeof this.global.structuredClone === 'undefined') {
      this.global.structuredClone = structuredClone;
    }
    if (typeof this.global.MessageChannel === 'undefined') {
      this.global.MessageChannel = (() => {
        let onmessage;
        return {
          port1: {
            set onmessage(cb) {
              onmessage = cb;
            },
          },
          port2: {
            postMessage: data => {
              onmessage?.({ data });
            },
          },
        };
      }) as any;
    }
  }
}
