import React, { Component } from 'react';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiTour
} from '../../../../src/components';

// TODO could/should these be stored in a wrapper component/global space?
const tourId = "abc123" // placeholder to keep in mind with isTourActive check
const tourSubtitle = "Demo tour";
const tourPopoverWidth = 360;

const demoTourSteps = [
  {
    step: 1,
    title: 'Step 1',
    body: <p>Some instructions for the first step.</p>,
    anchorRef: 'tourStep1',
  },
  {
    step: 2,
    title: 'Step 2',
    body: <p>More instructions for the second step.</p>,
    anchorRef: 'tourStep2',
  },
];

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO handle this in a global scope, pull from localStorage?
      isTourActive: true,
      isTourPopoverOpen: true,
      currentTourStep: 1,
    };
  }

  // TODO could this be smarter? e.g. do any time an EuiTour child is clicked
  incrementStep = () => {
    this.setState({
      currentTourStep: this.state.currentTourStep + 1,
    });
  }

  handleClick = () => {
    window.alert('Action completed, move to next step');
    this.incrementStep();
  }

  resetTour = () => {
    this.setState({
      currentTourStep: 1,
      isTourActive: true,
    });
  }

  // TODO required for popover but have user use Skip instead
  closeTourPopover() {
    return undefined;
  }

  skipTour() {
    this.setState({
      isTourActive: false,
    });
  }

  render() {

    return (
      <div>
        <EuiButtonEmpty iconType="refresh" flush="left" onClick={this.resetTour}>Reset tour</EuiButtonEmpty>
        <EuiSpacer />
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiTour
              // TODO make this specific to closing this tour? child click might be better
              closePopover={this.closeTourPopover.bind(this)}
              content={demoTourSteps[0].body}
              isStepOpen={this.state.currentTourStep === 1}
              isTourActive={this.state.isTourActive}
              minWidth={tourPopoverWidth}
              skipOnClick={this.skipTour.bind(this)}
              status="incomplete"
              step={1}
              subtitle={tourSubtitle}
              title={demoTourSteps[0].title}
              tourId={tourId}>
                <EuiButton
                  onClick={this.handleClick}>
                  Do this first
                </EuiButton>
            </EuiTour>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiTour
              // TODO make this specific to closing this tour? child click might be better
              closePopover={this.closeTourPopover.bind(this)}
              content={demoTourSteps[1].body}
              isStepOpen={this.state.currentTourStep === 2}
              isTourActive={this.state.isTourActive}
              minWidth={tourPopoverWidth}
              skipOnClick={this.skipTour.bind(this)}
              status="incomplete"
              step={2}
              subtitle={tourSubtitle}
              title={demoTourSteps[1].title}
              tourId={tourId}>
                <EuiButton
                  onClick={this.handleClick}>
                  Do this second
                </EuiButton>
            </EuiTour>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    )
  }
};
