import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import { TabsComponent, Tab } from './Tabs';

describe('TabsComponent', () => {
  it('should show the default item', () => {
    const testRenderer = TestRenderer.create(
      <TabsComponent defaultActiveTab="my">
        <Tab tabName="my" title="My Queue" id="tab-my-queue">
          <div id="tab-individual-panel">Indy</div>
        </Tab>
        <Tab tabName="section" title="Section Queue" id="tab-work-queue">
          <div id="tab-section-panel">Section</div>
        </Tab>
      </TabsComponent>,
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
