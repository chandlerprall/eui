/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { forwardRef, Fragment, FunctionComponent, Ref, useEffect, useMemo, useRef } from 'react';
import { VariableSizeGrid as Grid } from 'react-window';
import { EuiCodeBlock } from '../code';
import {
  EuiDataGridControlColumn,
  EuiDataGridColumn,
  EuiDataGridColumnWidths,
  EuiDataGridPopoverContents,
  EuiDataGridInMemory,
  EuiDataGridInMemoryValues,
  EuiDataGridPaginationProps,
  EuiDataGridSorting,
  EuiDataGridFocusedCell, EuiDataGridPopoverContent,
} from './data_grid_types';
import { EuiDataGridCell, EuiDataGridCellProps } from './data_grid_cell';
import {
  EuiDataGridDataRow,
  EuiDataGridDataRowProps,
} from './data_grid_data_row';
import {
  EuiDataGridSchema,
  EuiDataGridSchemaDetector,
} from './data_grid_schema';
import { EuiDataGridHeaderRow } from './data_grid_header_row';
import { EuiMutationObserver } from '../observer/mutation_observer';
import { EuiText } from '../text';

export interface EuiDataGridBodyProps {
  gridWidth: number;
  columnWidths: EuiDataGridColumnWidths;
  defaultColumnWidth?: number | null;
  leadingControlColumns?: EuiDataGridControlColumn[];
  trailingControlColumns?: EuiDataGridControlColumn[];
  columns: EuiDataGridColumn[];
  schema: EuiDataGridSchema;
  schemaDetectors: EuiDataGridSchemaDetector[];
  popoverContents?: EuiDataGridPopoverContents;
  focusedCell?: EuiDataGridFocusedCell;
  onCellFocus: EuiDataGridDataRowProps['onCellFocus'];
  rowCount: number;
  renderCellValue: EuiDataGridCellProps['renderCellValue'];
  inMemory?: EuiDataGridInMemory;
  inMemoryValues: EuiDataGridInMemoryValues;
  interactiveCellId: EuiDataGridCellProps['interactiveCellId'];
  pagination?: EuiDataGridPaginationProps;
  sorting?: EuiDataGridSorting;
  innerGridRef: Ref<HTMLDivElement>;
}

const defaultComparator: NonNullable<EuiDataGridSchemaDetector['comparator']> = (
  a,
  b,
  direction
) => {
  if (a < b) return direction === 'asc' ? -1 : 1;
  if (a > b) return direction === 'asc' ? 1 : -1;
  return 0;
};

const providedPopoverContents: EuiDataGridPopoverContents = {
  json: ({ cellContentsElement }) => {
    let formattedText = cellContentsElement.innerText;

    // attempt to pretty-print the json
    try {
      formattedText = JSON.stringify(JSON.parse(formattedText), null, 2);
    } catch (e) {} // eslint-disable-line no-empty

    return (
      <EuiCodeBlock
        isCopyable
        transparentBackground
        paddingSize="none"
        language="json">
        {formattedText}
      </EuiCodeBlock>
    );
  },
};

const HEADER_ROW_HEIGHT = 37;

const DefaultColumnFormatter: EuiDataGridPopoverContent = ({ children }) => {
  return <EuiText>{children}</EuiText>;
};

const Cell = ({ columnIndex, rowIndex: _rowIndex, style, data }) => {
  const {
    rowMap,
    columns,
    schema,
    popoverContents,
    columnWidths,
    defaultColumnWidth,
    leadingControlColumns,
    renderCellValue,
    onCellFocus,
    interactiveCellId,
    focusedCell,
  } = data;
  const rowIndex = rowMap.hasOwnProperty(_rowIndex)
    ? rowMap[_rowIndex]
    : _rowIndex;
  const column = columns[columnIndex];
  const columnId = column.id;
  const columnType = schema[columnId] ? schema[columnId].columnType : null;

  const isExpandable =
    columns.isExpandable !== undefined ? columns.isExpandable : true;
  const popoverContent =
    popoverContents[columnType as string] || DefaultColumnFormatter;

  const width = columnWidths[columnId] || defaultColumnWidth;
  const columnPosition = columnIndex + leadingControlColumns.length;

  const focusedCellPositionInTheRow =
    focusedCell != null && columnIndex === focusedCell[1]
      ? focusedCell[0]
      : null;

  return (
    <div
      style={{
        ...style,
        top: `${parseFloat(style.top) + HEADER_ROW_HEIGHT}px`,
      }}>
      <EuiDataGridCell
        // key={`${id}-${rowIndex}`}
        rowIndex={rowIndex}
        visibleRowIndex={_rowIndex}
        colIndex={columnIndex}
        columnId={columnId}
        columnType={columnType}
        popoverContent={popoverContent}
        width={width || undefined}
        renderCellValue={renderCellValue}
        onCellFocus={onCellFocus}
        isFocused={focusedCellPositionInTheRow === columnPosition}
        interactiveCellId={interactiveCellId}
        isExpandable={isExpandable}
      />
    </div>
  );
};

export const EuiDataGridBody: FunctionComponent<EuiDataGridBodyProps> = props => {
  const {
    gridWidth,
    columnWidths,
    defaultColumnWidth,
    leadingControlColumns = [],
    trailingControlColumns = [],
    columns,
    schema,
    schemaDetectors,
    popoverContents,
    focusedCell,
    onCellFocus,
    rowCount,
    renderCellValue,
    inMemory,
    inMemoryValues,
    interactiveCellId,
    pagination,
    sorting,
    innerGridRef,
    setColumnWidth,
    headerIsInteractive,
  } = props;

  const startRow = pagination ? pagination.pageIndex * pagination.pageSize : 0;
  let endRow = pagination
    ? (pagination.pageIndex + 1) * pagination.pageSize
    : rowCount;
  endRow = Math.min(endRow, rowCount);

  const visibleRowIndices = useMemo(() => {
    const visibleRowIndices = [];
    for (let i = startRow; i < endRow; i++) {
      visibleRowIndices.push(i);
    }
    return visibleRowIndices;
  }, [startRow, endRow]);

  const rowMap = useMemo(() => {
    const rowMap: { [key: number]: number } = {};

    if (
      inMemory?.level === 'sorting' &&
      sorting != null &&
      sorting.columns.length > 0
    ) {
      const inMemoryRowIndices = Object.keys(inMemoryValues);
      const wrappedValues: Array<{
        index: number;
        values: EuiDataGridInMemoryValues[number];
      }> = [];
      for (let i = 0; i < inMemoryRowIndices.length; i++) {
        const inMemoryRow = inMemoryValues[inMemoryRowIndices[i]];
        wrappedValues.push({ index: i, values: inMemoryRow });
      }

      wrappedValues.sort((a, b) => {
        for (let i = 0; i < sorting.columns.length; i++) {
          const column = sorting.columns[i];
          const aValue = a.values[column.id];
          const bValue = b.values[column.id];

          // get the comparator, based on schema
          let comparator = defaultComparator;
          if (schema.hasOwnProperty(column.id)) {
            const columnType = schema[column.id].columnType;
            for (let i = 0; i < schemaDetectors.length; i++) {
              const detector = schemaDetectors[i];
              if (
                detector.type === columnType &&
                detector.hasOwnProperty('comparator')
              ) {
                comparator = detector.comparator!;
              }
            }
          }

          const result = comparator(aValue, bValue, column.direction);
          // only return if the columns are inequal, otherwise allow the next sort-by column to run
          if (result !== 0) return result;
        }

        return 0;
      });

      for (let i = 0; i < wrappedValues.length; i++) {
        rowMap[i] = wrappedValues[i].index;
      }
    }

    return rowMap;
  }, [sorting, inMemory, inMemoryValues, schema, schemaDetectors]);

  const mergedPopoverContents = useMemo(
    () => ({
      ...providedPopoverContents,
      ...popoverContents,
    }),
    [popoverContents]
  );

  const headerRow = useMemo(
    () => {
      return (
        <>
          {/*<EuiMutationObserver*/}
          {/*  observerOptions={{*/}
          {/*    subtree: true,*/}
          {/*    childList: true,*/}
          {/*  }}*/}
          {/*  onMutation={handleHeaderMutation}>*/}
          {/*  {ref => (*/}
            <EuiDataGridHeaderRow
              // ref={ref}
              leadingControlColumns={
                leadingControlColumns
              }
              trailingControlColumns={
                trailingControlColumns
              }
              columns={columns}
              columnWidths={columnWidths}
              defaultColumnWidth={
                defaultColumnWidth
              }
              setColumnWidth={setColumnWidth}
              schema={schema}
              sorting={sorting}
              headerIsInteractive={
                headerIsInteractive
              }
              focusedCell={focusedCell}
              setFocusedCell={onCellFocus}
            />
          {/*  )}*/}
          {/*</EuiMutationObserver>*/}
        </>
      )
    },
    [
      leadingControlColumns,
      trailingControlColumns,
      defaultColumnWidth,
      setColumnWidth,
      schema,
      sorting,
      headerIsInteractive,
      focusedCell,
      onCellFocus,
      columnWidths,
      columns,
    ]
  )

  const InnerElement = useMemo(
    () =>
      forwardRef(({ children, ...rest }, ref) => {
        return (
          <div ref={ref} {...rest}>
            {headerRow}
            {children}
          </div>
        );
      }
    ),
    [headerRow]
  );

  const gridRef = useRef<Grid>(null);
  useEffect(() => {
    gridRef.current!.resetAfterColumnIndex(0);
  }, [columnWidths]);

  const ROW_HEIGHT = 34;
  const SCROLLBAR_HEIGHT = 15;
  return (
    <>
      <Grid
        ref={gridRef}
        innerRef={innerGridRef}
        innerElementType={InnerElement}
        columnCount={columns.length}
        width={gridWidth}
        columnWidth={index =>
          columnWidths[columns[index].id] || defaultColumnWidth || 100
        }
        height={
          ROW_HEIGHT * visibleRowIndices.length +
          SCROLLBAR_HEIGHT +
          HEADER_ROW_HEIGHT
        }
        rowHeight={() => ROW_HEIGHT}
        itemData={{
          rowMap,
          columns,
          schema,
          popoverContents: mergedPopoverContents,
          columnWidths,
          defaultColumnWidth,
          leadingControlColumns,
          renderCellValue,
          onCellFocus,
          interactiveCellId,
          focusedCell,
        }}
        rowCount={visibleRowIndices.length}>
        {Cell}
      </Grid>
    </>
  );

  // const rows = useMemo(() => {
  //   return visibleRowIndices.map((rowIndex, i) => {
  //     rowIndex = rowMap.hasOwnProperty(rowIndex) ? rowMap[rowIndex] : rowIndex;
  //     return (
  //       <EuiDataGridDataRow
  //         key={rowIndex}
  //         leadingControlColumns={leadingControlColumns}
  //         trailingControlColumns={trailingControlColumns}
  //         columns={columns}
  //         schema={schema}
  //         popoverContents={mergedPopoverContents}
  //         columnWidths={columnWidths}
  //         defaultColumnWidth={defaultColumnWidth}
  //         focusedCellPositionInTheRow={
  //           focusedCell != null && i === focusedCell[1] ? focusedCell[0] : null
  //         }
  //         onCellFocus={onCellFocus}
  //         renderCellValue={renderCellValue}
  //         rowIndex={rowIndex}
  //         visibleRowIndex={i}
  //         interactiveCellId={interactiveCellId}
  //       />
  //     );
  //   });
  // }, [
  //   visibleRowIndices,
  //   rowMap,
  //   leadingControlColumns,
  //   trailingControlColumns,
  //   columns,
  //   schema,
  //   mergedPopoverContents,
  //   columnWidths,
  //   defaultColumnWidth,
  //   focusedCell,
  //   onCellFocus,
  //   renderCellValue,
  //   interactiveCellId,
  // ]);
  //
  // return <Fragment>{rows}</Fragment>;
};
