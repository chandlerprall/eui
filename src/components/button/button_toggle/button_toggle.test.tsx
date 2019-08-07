import React from 'react';
import { render } from 'enzyme';
import { requiredProps } from '../../../test';

import { EuiButtonToggle } from './button_toggle';

describe('EuiButtonToggle', () => {
  test('is rendered', () => {
    const component = render(
      // @ts-ignore @chandler
      // `onClick` is marked as required in EuiButtonTogglePropsForButtonToggle
      <EuiButtonToggle {...requiredProps} label="Label me" />
    );

    expect(component).toMatchSnapshot();
  });
});
