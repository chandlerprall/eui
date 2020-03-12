import { useReducer } from 'react';
import { EuiTourStepProps } from './tour_step';
import { EuiTourAction, EuiTourActions, EuiTourState } from './types';

export type EuiStatelessTourStep = Omit<EuiTourStepProps, keyof EuiTourState> &
  Partial<EuiTourState>;

export const useEuiTour = (
  stepsArray: EuiStatelessTourStep[],
  initialState: EuiTourState
): [EuiTourStepProps[], EuiTourActions, EuiTourState] => {
  function reducer(state: EuiTourState, action: EuiTourAction): EuiTourState {
    switch (action.type) {
      case 'EUI_TOUR_SKIP':
        return {
          ...state,
          isTourActive: false,
        };
      case 'EUI_TOUR_END':
        return {
          ...state,
          currentTourStep: 1,
          isTourActive: false,
        };
      case 'EUI_TOUR_RESET':
        return {
          ...state,
          currentTourStep: 1,
          isTourActive: true,
        };
      case 'EUI_TOUR_NEXT':
        return {
          ...state,
          currentTourStep: state.currentTourStep + 1,
        };
      case 'EUI_TOUR_PREVIOUS':
        return {
          ...state,
          currentTourStep: state.currentTourStep - 1,
        };
      case 'EUI_TOUR_GOTO': {
        const step = action.payload
          ? action.payload.step
          : state.currentTourStep;
        return {
          ...state,
          currentTourStep: step,
        };
      }
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: EuiTourActions = {
    endTour: () => dispatch({ type: 'EUI_TOUR_END' }),
    skipTour: () => dispatch({ type: 'EUI_TOUR_SKIP' }),
    resetTour: () => dispatch({ type: 'EUI_TOUR_RESET' }),
    decrementStep: () => dispatch({ type: 'EUI_TOUR_PREVIOUS' }),
    incrementStep: () => dispatch({ type: 'EUI_TOUR_NEXT' }),
    goToStep: (step: number) =>
      dispatch({ type: 'EUI_TOUR_GOTO', payload: { step } }),
  };

  const steps = stepsArray.map(step => ({
    ...step,
    isStepOpen: state.currentTourStep === step.step,
    isTourActive: state.isTourActive,
    minWidth: state.tourPopoverWidth,
    onEnd: actions.endTour,
    onSkip: actions.skipTour,
    stepsTotal: stepsArray.length,
    subtitle: state.tourSubtitle,
  }));

  return [steps, actions, state];
};
