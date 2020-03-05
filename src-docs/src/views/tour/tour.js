import React, { useEffect, useState } from 'react';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCodeBlock,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiTextArea,
  EuiTourStep,
} from '../../../../src/components';

const demoTourSteps = [
  {
    step: 1,
    title: 'Step 1',
    content: (
      <span>
        <p>Copy and paste this sample query.</p>
        <EuiSpacer />
        <EuiCodeBlock language="html" paddingSize="s" isCopyable>
          {'SELECT email FROM “kibana_sample_data_ecommerce”'}
        </EuiCodeBlock>
      </span>
    ),
    anchorRef: 'tourStep2',
  },
  {
    step: 2,
    title: 'Step 2',
    content: <p>Save your changes.</p>,
    anchorRef: 'tourStep1',
  },
];

const tourConfig = {
  // TODO demo this in a global scope, pull from localStorage?
  currentTourStep: 1,
  isTourActive: true,
  isTourPopoverOpen: true,
  tourPopoverWidth: 360,
  // TODO This probably needs hard-coded since steps can live in other views
  // tourSteps: demoTourSteps.length,
  tourSteps: 3,
  tourSubtitle: 'Demo tour',
};

const STORAGE_KEY = 'tourDemo';

export default () => {
  const [state, setState] = useState(tourConfig);
  const [queryValue, setQueryValue] = useState('');

  useEffect(() => {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      setState(JSON.parse(storedState));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tourConfig));
    }
  }, []);

  useEffect(() => {
    // Store the tour data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // TODO could this be built-in? e.g. do any time an EuiTour child is clicked
  const incrementStep = () => {
    setState({
      ...state,
      currentTourStep: state.currentTourStep + 1,
    });
  };

  const handleClick = () => {
    incrementStep();
  };

  const resetTour = () => {
    setState({
      ...state,
      currentTourStep: 1,
      isTourActive: true,
    });
    setQueryValue('');
  };

  const skipTour = () => {
    setState({
      ...state,
      isTourActive: false,
    });
  };

  const onChange = e => {
    setQueryValue(e.target.value);

    if (state.currentTourStep < 2) {
      incrementStep();
    }
  };

  return (
    <div>
      <EuiButtonEmpty iconType="refresh" flush="left" onClick={resetTour}>
        Reset tour
      </EuiButtonEmpty>
      <EuiSpacer />
      <EuiForm>
        <EuiFormRow label="Enter an ES SQL query">
          <EuiTourStep
            content={demoTourSteps[0].content}
            isStepOpen={state.currentTourStep === 1}
            isTourActive={state.isTourActive}
            minWidth={state.tourPopoverWidth}
            skipOnClick={skipTour}
            step={1}
            stepsTotal={state.tourSteps}
            subtitle={state.tourSubtitle}
            title={demoTourSteps[0].title}>
            <EuiTextArea
              placeholder="Placeholder text"
              aria-label="Enter ES SQL query"
              value={queryValue}
              onChange={onChange}
              style={{ width: 400 }}
            />
          </EuiTourStep>
        </EuiFormRow>

        <EuiSpacer />

        <EuiTourStep
          anchorPosition="rightUp"
          content={demoTourSteps[1].content}
          isStepOpen={state.currentTourStep === 2}
          isTourActive={state.isTourActive}
          minWidth={state.tourPopoverWidth} //
          skipOnClick={skipTour}
          step={2}
          stepsTotal={state.tourSteps} //
          subtitle={state.tourSubtitle} //
          title={demoTourSteps[1].title}>
          <EuiButton onClick={handleClick}>Save query</EuiButton>
        </EuiTourStep>
      </EuiForm>
    </div>
  );
};