import React from 'react';
import classNames from 'classnames';
import { HTMLAttributes } from 'react';
import { CommonProps } from '../common';

// console.log(PropTypes, React);

const sizeToClassNameMap = {
  xs: 'euiSpacer--xs',
  s: 'euiSpacer--s',
  m: 'euiSpacer--m',
  l: 'euiSpacer--l',
  xl: 'euiSpacer--xl',
  xxl: 'euiSpacer--xxl',
};

export const SIZES = Object.keys(sizeToClassNameMap);

export type SpacerSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';

export type EuiSpacerProps = CommonProps & HTMLAttributes<HTMLDivElement> & {
  className?: string,
  size: SpacerSize,
};

export const EuiSpacer: React.SFC<EuiSpacerProps> = ({
  className,
  size,
  ...rest
}) => {
  const classes = classNames(
    'euiSpacer',
    size ? sizeToClassNameMap[size] : undefined,
    className,
  );

  return (
    <div
      className={classes}
      {...rest}
    />
  );
};

// EuiSpacer.propTypes = {
//   ...commonProps,
//   size: PropTypes.oneOf(SIZES),
// };

EuiSpacer.defaultProps = {
  size: 'l',
};
