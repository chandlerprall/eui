import React, {
  Fragment,
  useState,
  ReactChild,
  ReactNode,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { EuiDataGridColumn, EuiDataGridSorting } from './data_grid_types';
// @ts-ignore-next-line
import { EuiPopover, EuiPopoverFooter } from '../popover';
import { EuiI18n } from '../i18n';
import { EuiText } from '../text';
// @ts-ignore-next-line
import { EuiButtonEmpty, EuiButtonToggle } from '../button';
import { EuiFlexGroup, EuiFlexItem } from '../flex';
// @ts-ignore-next-line
import { EuiListGroupItem, EuiListGroup } from '../list_group';
import {
  EuiDragDropContext,
  EuiDraggable,
  EuiDroppable,
} from '../drag_and_drop';
import { DropResult } from 'react-beautiful-dnd';
import { EuiIcon } from '../icon';
import { EuiDataGridSchema } from './data_grid_schema';

export const useColumnSorting = (
  columns: EuiDataGridColumn[],
  sorting: EuiDataGridSorting | undefined,
  schema: EuiDataGridSchema
): [ReactNode] => {
  const [isOpen, setIsOpen] = useState(false);
  const [avilableColumnsisOpen, setAvailableColumnsIsOpen] = useState(false);

  // TODO: change this from any
  const getIconTypeFromSchema = (schema: any) => {
    switch (schema) {
      case undefined:
        return 'string';
        break;
      case 'numeric':
        return 'number';
        break;
      case 'location':
        return 'mapMarker';
        break;
      case 'currency':
        return 'heart';
        break;
      case 'boolean':
        return 'invert';
        break;
    }
  };

  // prune any non-existant/hidden columns from sorting
  useEffect(() => {
    if (sorting) {
      const nextSortingColumns: EuiDataGridSorting['columns'] = [];

      const availableColumnIds = new Set(columns.map(({ id }) => id));
      for (let i = 0; i < sorting.columns.length; i++) {
        const column = sorting.columns[i];
        if (availableColumnIds.has(column.id)) {
          nextSortingColumns.push(column);
        }
      }

      // if the column array lengths differ then the sorting columns have been pruned
      if (nextSortingColumns.length !== sorting.columns.length) {
        sorting.onSort(nextSortingColumns);
      }
    }
  }, [columns, sorting]);

  if (sorting == null) return [null];

  const activeColumnIds = new Set(sorting.columns.map(({ id }) => id));
  const { inactiveColumns } = columns.reduce<{
    activeColumns: EuiDataGridColumn[];
    inactiveColumns: EuiDataGridColumn[];
  }>(
    (acc, column) => {
      if (activeColumnIds.has(column.id)) {
        acc.activeColumns.push(column);
      } else {
        acc.inactiveColumns.push(column);
      }
      return acc;
    },
    {
      activeColumns: [],
      inactiveColumns: [],
    }
  );

  function onDragEnd({
    source: { index: sourceIndex },
    destination,
  }: DropResult) {
    const destinationIndex = destination!.index;
    const nextColumns = [...sorting!.columns];

    nextColumns[sourceIndex] = sorting!.columns[destinationIndex];
    nextColumns[destinationIndex] = sorting!.columns[sourceIndex];

    sorting!.onSort(nextColumns);
  }

  const controlBtnClasses = classNames('euiDataGrid__controlBtn', {
    'euiDataGrid__controlBtn--active': sorting.columns.length > 0,
  });

  const columnSorting = (
    <EuiPopover
      data-test-subj="dataGridColumnSortingPopover"
      isOpen={isOpen}
      closePopover={() => setIsOpen(false)}
      anchorPosition="downLeft"
      ownFocus
      panelPaddingSize="s"
      panelClassName="euiDataGridColumnSortingPopover"
      button={
        <EuiI18n token="euiColumnSorting.button" default="Sorting">
          {(button: ReactChild) => (
            <EuiButtonEmpty
              size="xs"
              iconType="sortable"
              color="text"
              className={controlBtnClasses}
              onClick={() => setIsOpen(!isOpen)}>
              {button}
            </EuiButtonEmpty>
          )}
        </EuiI18n>
      }>
      {sorting.columns.length > 0 ? (
        <EuiDragDropContext onDragEnd={onDragEnd}>
          <EuiDroppable
            droppableId="columnSorting"
            className="euiDataGridColumnSorting">
            <Fragment>
              {sorting.columns.map(({ id, direction }, index) => (
                <EuiDraggable key={id} draggableId={id} index={index}>
                  {(provided, state) => (
                    <div
                      data-test-subj={`dataGrid-sortColumn-${id}-${direction}`}
                      className={`euiDataGridColumnSorting__item ${state.isDragging &&
                        'euiDataGridColumnSorting__item-isDragging'}`}>
                      <EuiFlexGroup
                        gutterSize="xs"
                        alignItems="center"
                        responsive={false}>
                        <EuiFlexItem grow={false}>
                          <EuiButtonToggle
                            color="text"
                            isIconOnly
                            className="euiDataGridColumnSorting__button"
                            label={`${id} (${
                              schema.hasOwnProperty(id) &&
                              schema[id].columnType != null
                                ? schema[id].columnType
                                : 'unknown'
                            })`}
                            iconType={
                              activeColumnIds.has(id) ? 'cross' : 'empty'
                            }
                            isSelected={activeColumnIds.has(id)}
                            isEmpty
                            onChange={() => {
                              const nextColumns = [...sorting.columns];
                              const columnIndex = nextColumns
                                .map(({ id }) => id)
                                .indexOf(id);
                              nextColumns.splice(columnIndex, 1);
                              sorting.onSort(nextColumns);
                            }}
                          />
                        </EuiFlexItem>
                        <EuiFlexItem>
                          <EuiText size="s">
                            <p>{id}</p>
                          </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                          <EuiFlexGroup
                            gutterSize="none"
                            alignItems="center"
                            responsive={false}>
                            <EuiFlexItem
                              grow={false}
                              className="euiDataGridColumnSorting__orderButtons">
                              <button
                                className={`euiDataGridColumnSorting__order ${
                                  direction === 'asc'
                                    ? 'euiDataGridColumnSorting__order-isActive'
                                    : ''
                                }`}
                                onClick={() => {
                                  const nextColumns = [...sorting.columns];
                                  const columnIndex = nextColumns
                                    .map(({ id }) => id)
                                    .indexOf(id);
                                  nextColumns.splice(columnIndex, 1, {
                                    id,
                                    direction: 'asc',
                                  });
                                  sorting.onSort(nextColumns);
                                }}>
                                A-Z
                              </button>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                              <button
                                className={`euiDataGridColumnSorting__order ${
                                  direction === 'desc'
                                    ? 'euiDataGridColumnSorting__order-isActive'
                                    : ''
                                }`}
                                onClick={() => {
                                  const nextColumns = [...sorting.columns];
                                  const columnIndex = nextColumns
                                    .map(({ id }) => id)
                                    .indexOf(id);
                                  nextColumns.splice(columnIndex, 1, {
                                    id,
                                    direction: 'desc',
                                  });
                                  sorting.onSort(nextColumns);
                                }}>
                                Z-A
                              </button>
                            </EuiFlexItem>
                          </EuiFlexGroup>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false} {...provided.dragHandleProps}>
                          <div {...provided.dragHandleProps}>
                            <EuiIcon type="grab" color="subdued" />
                          </div>
                        </EuiFlexItem>
                      </EuiFlexGroup>
                    </div>
                  )}
                </EuiDraggable>
              ))}
            </Fragment>
          </EuiDroppable>
        </EuiDragDropContext>
      ) : (
        <EuiText size="s" color="subdued">
          <p>
            <EuiI18n
              token="euiColumnSorting.emptySorting"
              default="No fields are being sorted"
            />
          </p>
        </EuiText>
      )}
      <EuiPopoverFooter>
        <EuiFlexGroup
          gutterSize="s"
          justifyContent="spaceBetween"
          responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiPopover
              data-test-subj="dataGridColumnSortingPopover"
              isOpen={avilableColumnsisOpen}
              closePopover={() => setAvailableColumnsIsOpen(false)}
              anchorPosition="downLeft"
              ownFocus
              panelPaddingSize="s"
              panelClassName="euiDataGridColumnSortingPopover"
              button={
                <EuiButtonEmpty
                  size="xs"
                  flush="left"
                  onClick={() =>
                    setAvailableColumnsIsOpen(!avilableColumnsisOpen)
                  }>
                  <EuiI18n
                    token="euiColumnSorting.clearAll"
                    default="Pick a field to sort"
                  />
                </EuiButtonEmpty>
              }>
              <EuiListGroup flush>
                {inactiveColumns.map(({ id }) => (
                  <EuiListGroupItem
                    key={id}
                    label={id}
                    size="xs"
                    className="euiDataGridColumnSorting__listGroupItem"
                    iconType={`${
                      schema.hasOwnProperty(id) && schema[id].columnType != null
                        ? getIconTypeFromSchema(schema[id].columnType)
                        : 'string'
                    }`}
                    onClick={() => {
                      const nextColumns = [...sorting.columns];
                      nextColumns.push({ id, direction: 'asc' });
                      sorting.onSort(nextColumns);
                    }}
                  />
                ))}
              </EuiListGroup>
            </EuiPopover>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              size="xs"
              flush="right"
              onClick={() => sorting.onSort([])}>
              <EuiI18n token="euiColumnSorting.clearAll" default="Clear all" />
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopoverFooter>
    </EuiPopover>
  );

  return [columnSorting];
};
