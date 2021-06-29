import { Container } from '@cerebral/react';
import { TextView } from './TextView';
import App from 'cerebral';
import React from 'react';
import TestRenderer from 'react-test-renderer';

describe('TextView Component', () => {
  it('should not show the text if no binded property is available', () => {
    const testModule = {
      sequences: {},
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <TextView />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.find(el => el.type == 'span')).toThrow();
  });

  it('should not show the text if binded value is falsy', () => {
    const testModule = {
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <TextView bind="text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.find(el => el.type == 'span')).toThrow();
  });

  it('should not show the text if binded value is an empty string', () => {
    const testModule = {
      state: { text: '' },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <TextView bind="text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(() => testInstance.find(el => el.type == 'span')).toThrow();
  });

  it('should not show the text if binded value path is not available', () => {
    const testModule = {
      state: {},
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <TextView bind="messages.text" />
      </Container>,
    );

    const testInstanceJson = testRenderer.toJSON();
    expect(testInstanceJson).toEqual(null);
  });

  it('should show the text if binded value is available', () => {
    const testModule = {
      state: {
        text: 'Some Content',
      },
    };
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <TextView bind="text" />
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(testInstance.find(el => el.type == 'span').children[0]).toEqual(
      'Some Content',
    );
  });

  describe('type display', () => {
    it('should show number as text if binded value is available', () => {
      const testModule = {
        state: {
          text: 123421342,
        },
      };
      const app = App(testModule);
      const testRenderer = TestRenderer.create(
        <Container app={app}>
          <TextView bind="text" />
        </Container>,
      );

      const testInstance = testRenderer.root;

      expect(testInstance.find(el => el.type == 'span').children[0]).toEqual(
        '123421342',
      );
    });
  });
});
