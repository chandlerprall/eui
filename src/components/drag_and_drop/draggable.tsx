import React, {
  CSSProperties,
  Fragment,
  FunctionComponent,
  ReactElement,
  cloneElement,
  useContext,
  JSXElementConstructor,
} from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { CommonProps, Omit, keysOf } from '../common';
import { EuiDroppableContext } from './droppable';

const spacingToClassNameMap = {
  none: null,
  s: 'euiDraggable--s',
  m: 'euiDraggable--m',
  l: 'euiDraggable--l',
};

export const SPACING = keysOf(spacingToClassNameMap);
export type EuiDraggableSpacing = keyof typeof spacingToClassNameMap;

export interface EuiDraggableProps
  extends CommonProps,
    Omit<DraggableProps, 'children'> {
  children: ReactElement | DraggableProps['children'];
  className?: string;
  customDragHandle?: boolean;
  isRemovable?: boolean;
  spacing?: EuiDraggableSpacing;
  style?: CSSProperties;
  as?: JSXElementConstructor<any>;
}

export const EuiDraggable: FunctionComponent<EuiDraggableProps> = ({
  customDragHandle = false,
  draggableId,
  isDragDisabled = false,
  isRemovable = false,
  index,
  children,
  className,
  spacing = 'none',
  style,
  as: As = 'div',
  ...rest
}) => {
  const { cloneItems } = useContext(EuiDroppableContext);

  return (
    <Draggable draggableId={draggableId} index={index} {...rest}>
      {(provided, snapshot) => {
        const classes = classNames(
          'euiDraggable',
          {
            'euiDraggable--hasClone': cloneItems,
            'euiDraggable--hasCustomDragHandle': customDragHandle,
            'euiDraggable--isDragging': snapshot.isDragging,
            'euiDraggable--withoutDropAnimation': isRemovable,
          },
          spacingToClassNameMap[spacing],
          className
        );
        const childClasses = classNames('euiDraggable__item', {
          'euiDraggable__item--hasCustomDragHandle': customDragHandle,
          'euiDraggable__item--isDisabled': isDragDisabled,
          'euiDraggable__item--isDragging': snapshot.isDragging,
          'euiDraggable__item--isDropAnimating': snapshot.isDropAnimating,
        });
        const DraggableElement =
          typeof children === 'function'
            ? children(provided, snapshot)
            : (children as ReactElement); // as specified by `DraggableProps`
        return (
          <Fragment>
            <As
              {...provided.draggableProps}
              {...(!customDragHandle ? provided.dragHandleProps : {})}
              ref={provided.innerRef}
              data-test-subj="draggable"
              className={classes}
              style={{ ...style, ...provided.draggableProps.style }}>
              {React.Children.map(DraggableElement, child =>
                cloneElement(child, {
                  className: classNames(
                    child.props.className,
                    childClasses
                  ),
                })
              )}
            </As>
            {cloneItems &&
              (snapshot.isDragging && (
                <As className={classNames(classes, 'euiDraggable--clone')}>
                  {DraggableElement}
                </As>
              ))}
          </Fragment>
        );
      }}
    </Draggable>
  );
};
