import { Buttons } from './Buttons';
import { Cards } from './Cards';
import { Forms } from './Forms';
import React from 'react';
import { SelectMulti } from './SelectMulti';
import { Tables } from './Tables';
import { TabsSection as Tabs } from './Tabs';
import { Typography } from './Typography';

export const StyleGuide = () => (
  <React.Fragment>
    <Typography />
    <Buttons />
    <Tables />
    <Forms />

    <SelectMulti />
    <Cards />
    <Tabs />
  </React.Fragment>
);
