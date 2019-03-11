import React from 'react';
import { Container } from '@cerebral/react';
import App, { Module } from 'cerebral';
import { cerebralBindSimpleSetStateSequence } from '../../presenter/sequences/cerebralBindSimpleSetStateSequence';
import TestRenderer, { act } from 'react-test-renderer';
import { Tab, Tabs } from './Tabs';

describe('TabsComponent', () => {
  it('should show the binded item', () => {
    const testModule = Module({
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        tab: 'my',
      },
    });
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Tabs bind="tab" className="yeah">
          <Tab tabName="section" title="Section Queue" id="tab-work-queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
          <Tab tabName="my" title="My Queue" id="tab-my-queue">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
        </Tabs>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'tab-individual-panel' }).children[0],
    ).toEqual('Indy');

    expect(() =>
      testInstance.findByProps({ id: 'tab-section-panel' }),
    ).toThrow();
  });

  it('should be able to click to show an item', () => {
    const testModule = Module({
      sequences: {
        cerebralBindSimpleSetStateSequence,
      },
      state: {
        tab: 'my',
      },
    });
    const app = App(testModule);
    const testRenderer = TestRenderer.create(
      <Container app={app}>
        <Tabs bind="tab" className="yeah">
          <Tab tabName="section" title="Section Queue" id="tab-work-queue">
            <div id="tab-section-panel">Section</div>
          </Tab>
          <Tab tabName="my" title="My Queue" id="tab-my-queue">
            <div id="tab-individual-panel">Indy</div>
          </Tab>
        </Tabs>
      </Container>,
    );

    const testInstance = testRenderer.root;

    expect(
      testInstance.findByProps({ id: 'tab-individual-panel' }).children[0],
    ).toEqual('Indy');

    act(() => {
      testInstance.findByProps({ id: 'tab-work-queue' }).props.onClick();
    });

    expect(() =>
      testInstance.findByProps({ id: 'tab-individual-panel' }),
    ).toThrow();

    expect(
      testInstance.findByProps({ id: 'tab-section-panel' }).children[0],
    ).toEqual('Section');
  });
});
