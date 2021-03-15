/* eslint-disable no-restricted-globals */
import { Container } from '@cerebral/react';
import { DatePickerComponent } from './DatePickerComponent';
import { mount } from 'enzyme';
import App from 'cerebral';
import React from 'react';

describe('DatePickerComponent', () => {
  it.skip('should set the input value to whatever the value was passed in', () => {
    const app = App({});

    const wrapper = mount(
      <Container app={app}>
        <DatePickerComponent
          name="test"
          value="05/02/2002"
        ></DatePickerComponent>
      </Container>,
    );

    wrapper.update();
    const input = wrapper.find('input');
    wrapper.update();
    expect(input.instance().value).toEqual('05/02/2002');
  });

  it('should reset the input value to an empty string if day, month, or year is null', () => {
    const app = App({});

    const wrapper = mount(
      <Container app={app}>
        <DatePickerComponent
          name="test"
          names={{
            day: 'day',
            month: 'month',
            year: 'year',
          }}
          values={{
            day: '04',
            month: '05',
            year: '2001',
          }}
        ></DatePickerComponent>
      </Container>,
    );
    expect(wrapper.find('input').instance().value).toEqual('2001-05-04');

    wrapper.setProps({
      children: (
        <Container app={app}>
          <DatePickerComponent
            name="test"
            names={{
              day: 'day',
              month: 'month',
              year: 'year',
            }}
            values={{
              day: '',
              month: '',
              year: '',
            }}
          ></DatePickerComponent>
        </Container>
      ),
    });

    expect(wrapper.find('input').instance().value).toEqual('');
  });
});
