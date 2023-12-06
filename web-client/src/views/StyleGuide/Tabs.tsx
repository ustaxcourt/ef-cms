import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import React from 'react';

export const TabsSection = () => (
  <section className="usa-section grid-container">
    <h1>Tabs</h1>
    <hr />

    <h2>Primary Tabs</h2>

    <Tabs className="classic-horizontal">
      <Tab id="tab-my-queue" tabName="my" title="My Queue">
        <p>My Queue Content</p>
      </Tab>
      <Tab id="tab-work-queue" tabName="section" title="Section Queue">
        <p>Section Queue Content</p>
      </Tab>
    </Tabs>

    <h2>Secondary Tabs</h2>

    <div className="work-queue-tab-container">
      <h3 className="work-queue-tab">Inbox</h3>
    </div>

    <h2>Base Tabs</h2>

    <Tabs>
      <Tab id="tab-my-queue" tabName="my" title="My Queue">
        <p>My Queue Content</p>
      </Tab>
      <Tab id="tab-work-queue" tabName="section" title="Section Queue">
        <p>Section Queue Content</p>
      </Tab>
    </Tabs>

    <h2>Container Tabs</h2>

    <Tabs className="container-tabs">
      <Tab id="tab-my-queue" tabName="my" title="My Queue">
        <div>
          <h3>My Queue Content</h3>
        </div>
      </Tab>
      <Tab id="tab-work-queue" tabName="section" title="Section Queue">
        <p>Section Queue Content</p>
        <div className="blue-container">
          <p>
            To file a case on behalf of another taxpayer, you must be authorized
            to litigate in this Court as provided by the Tax Court Rules of
            Practice and Procedure (Rule 60). Enrolled agents, certified public
            accountants, and powers of attorney who are not admitted to practice
            before the Court are not eligible to represent taxpayers.
          </p>
        </div>
      </Tab>
    </Tabs>
  </section>
);

TabsSection.displayName = 'TabsSection';
