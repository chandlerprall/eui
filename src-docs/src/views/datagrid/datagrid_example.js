import React, { Fragment } from 'react';

import { renderToHtml } from '../../services';

import { GuideSectionTypes } from '../../components';
import {
  EuiDataGrid,
  EuiCode,
  EuiDescriptionList,
  EuiCodeBlock,
  EuiText,
  EuiSpacer,
  EuiCallOut,
} from '../../../../src/components';

import DataGrid from './datagrid';
const dataGridSource = require('!!raw-loader!./datagrid');
const dataGridHtml = renderToHtml(DataGrid);

import DataGridContainer from './container';
const dataGridContainerSource = require('!!raw-loader!./container');
const dataGridContainerHtml = renderToHtml(DataGridContainer);

import DataGridStyling from './styling';
const dataGridStylingSource = require('!!raw-loader!./styling');
const dataGridStylingHtml = renderToHtml(DataGridStyling);

import DataGridSchema from './schema';
const dataGridSchemaSource = require('!!raw-loader!./schema');
const dataGridSchemaHtml = renderToHtml(DataGridSchema);

import InMemoryDataGrid from './in_memory';
const inMemoryDataGridSource = require('!!raw-loader!./in_memory');
const inMemoryDataGridHtml = renderToHtml(InMemoryDataGrid);

import {
  DataGridColumn,
  DataGridPagination,
  DataGridSorting,
  DataGridInMemory,
  DataGridStyle,
  CellValueElement,
  DataGridSchemaDetector,
  DataGridToolbarDisplayOptions,
} from './props';

const gridSnippet = `
  <EuiDataGrid
    // Optional. Will try to autodectect schemas and do sorting and pagination in memory
    inMemory={{ level: 'sorting' }}
    // Required. There are 200 total records
    rowCount={200}
    // Required. Sets up three columns, the last of which has a custom schema we later define down below
		// The second column B won't allow clicking in to see the content in a popup
    columns={[{ id: 'A' }, { id: 'B', isExpandable: false }, {id: 'C', schema: 'franchise'}]}
    // Optional. Hide the second column B
    columnVisibility={{
      visibleColumns: ['A', 'C'],
      setVisibleColumns: () => {},
    }}
    // Optional. Customize the content inside the cell. Let's output the row and column position.
    // This same method is used to change the background color for cells on the demo above.
    // Often used in combo with useEffect() to need to dynamically change the render
    renderCellValue={({ rowIndex, columnId }) =>
     \`\${rowIndex}, \${columnId}\`
    }
    // Optional. Add pagination
    pagination={{
      pageIndex: 1,
      pageSize: 100,
      pageSizeOptions: [50, 100, 200],
      onChangePage: () => {},
      onChangeItemsPerPage: () => {},
    }}
    // Optional, but required when inMemory is set. Provides the sort and gives a callback for when it changes in the grid
    sorting={{
      columns: [{ id: 'C', direction: 'asc' }],
      onSort: () => {},
    }}
    // Optional. Allows you to configure what features the toolbar allows
    toolbarDisplay={{ showColumnSelector: false }}
    // Optional. Change the initial style of the grid.
    gridStyle={{
      border: 'all',
      fontSize: 'm',
      cellPadding: 'm',
      stripes: true,
      rowHover: 'highlight',
      header: 'shade',
    }}
    // Optional. Provide an additional schema called Franchise
    // This schema essentially acts like a boolean, looking for Star Wars and Star Trek references
    schemaDetectors={[
      {
        type: 'franchise',
        // Try to detect if column data is this schema. A value of 1 is the highest possible. An average of .5 in average will be good enough for the autodector to assign
        detector(value) {
          return value.toLowerCase() === 'star wars' ||
            value.toLowerCase() === 'star trek'
            ? 1
            : 0;
        },
        // How we should sort data matching this schema. Again, a value of 1 is the highest value.
        comparator(a, b, direction) {
          const aValue = a.toLowerCase() === 'star wars';
          const bValue = b.toLowerCase() === 'star wars';
          if (aValue < bValue) return direction === 'asc' ? 1 : -1;
          if (aValue > bValue) return direction === 'asc' ? -1 : 1;
          return 0;
        },
        // Text for what the ASC sort does
        sortTextAsc: 'Star Wars-Star Trek',
        // Text for what the DESC sort does
        sortTextDesc: 'Star Trek-Star Wars',
        // EuiIcon to signify this schema
        icon: 'star',
        // Color for the above icon
        color: '#000000',
      },
    ]}
    // Optional. Mapped against the schema, provide custom content for the popover
    expansionFormatters={{
      franchise: children => {
        const value =
          data[children.children.props.rowIndex][
            children.children.props.columnId
          ];
        console.log(children.children);
        return <Franchise name={value} />;
      },
    }}
  />
`;

const gridConcepts = [
  {
    title: 'columns',
    description: (
      <span>
        An array of <EuiCode>DataGridColumn</EuiCode> objects. Lists the columns
        available and the schema and settings tied to it.
      </span>
    ),
  },
  {
    title: 'inMemory',
    description: (
      <span>
        A <EuiCode>DataGridInMemory</EuiCode> object to define the level of high
        order schema-detection and sorting logic to use on your data.{' '}
        <strong>Try to set it when possible</strong>. If omitted, disables all
        enhancements and assumes content is flat strings.
      </span>
    ),
  },
  {
    title: 'columnVisibility',
    description: (
      <span>
        An array of <EuiCode>DataGridColumnVisibility</EuiCode> objects. Defines
        which columns are visible in the grid and the order they are displayed.
      </span>
    ),
  },
  {
    title: 'schemaDetectors',
    description: (
      <span>
        An array of custom <EuiCode>DataGridSchemaDetector</EuiCode> objects.
        You can inject custom schemas to the grid to define the classnames
        applied
      </span>
    ),
  },
  {
    title: 'expansionFormatters',
    description: (
      <span>
        An object mapping <EuiCode>DataGridColumn</EuiCode> schemas to a custom
        expansion formatting component. This dictates the content of the
        popovers when you click into each cell.
      </span>
    ),
  },
  {
    title: 'rowCount',
    description:
      'The total number of rows in the dataset (used by e.g. pagination to know how many pages to list)',
  },
  {
    title: 'Sorting',
    description:
      'Defines the initial sort parameters as well as a callback function for when sorting takes place in the grid.',
  },
  {
    title: 'gridStyle',
    description: (
      <span>
        Defines the look and feel for the grid. Accepts a partial{' '}
        <EuiCode>DataGridStyle</EuiCode> object. Settings provided may be
        overwritten or merged with user defined preferences if toolbarDisplay
        density controls are available.
      </span>
    ),
  },
  {
    title: 'toolbarDisplay',
    description: (
      <span>
        Accepts either a boolean or{' '}
        <EuiCode>EuiDataGridTooBarDisplayOptions</EuiCode> object. When used as
        a boolean, defines the display of the toolbar entire. WHen passed an
        object allows you to turn off individual controls within the toolbar.
      </span>
    ),
  },
  {
    title: 'renderCellValue',
    description: (
      <span>
        A function called to render a cell&apos;s value. Behind the scenes it is
        treated as a React component allowing hooks, context, and other React
        concepts to be used. The function receives a{' '}
        <EuiCode>CellValueElement</EuiCode> as its only argument.
      </span>
    ),
  },
  {
    title: 'pagination',
    description: (
      <span>
        A <EuiCode>DataGridPagination</EuiCode> object. Omit to disable
        pagination completely.
      </span>
    ),
  },
  {
    title: 'sorting',
    description: (
      <span>
        A <EuiCode>DataGridSorting</EuiCode> oject that provides the sorted
        columns along with their direction. Omit to disable, but you&apos;ll
        likely want to also turn off the user sorting controls through the
        toolbarDisplay prop.
      </span>
    ),
  },
];

export const DataGridExample = {
  title: 'Data grid',
  sections: [
    {
      source: [
        {
          type: GuideSectionTypes.JS,
          code: dataGridSource,
        },
        {
          type: GuideSectionTypes.HTML,
          code: dataGridHtml,
        },
      ],
      text: (
        <Fragment>
          <p>
            <EuiCode>EuiDataGrid</EuiCode> is a performant, high-order component
            for displaying large amounts of tabular data with liberal usage of
            React hooks. From a product standpoint it is similar to an excel, or
            sheets like experience, except that its stengths are in rendering,
            rather that creating content.
          </p>
          <h3>Core concepts</h3>
          <ul>
            <li>
              The grid has levels of <strong>in memory</strong> settings. The
              higher levels open up more features, but require you to utilize
              callbacks for sorting and pagination as those features are
              enabled.
            </li>
            <li>
              <strong>Schemas</strong> allow you to tailor the render and sort
              methods for each column. The component ships with some automatic
              schema detection and types, but you can also pass in custom ones
              for more power.
            </li>
            <li>
              Unlike tables, the data grid <strong>forces truncation</strong>.
              To display more content your can customize{' '}
              <strong>expansion formatters</strong> to display more content and
              actions into popovers.
            </li>
          </ul>
        </Fragment>
      ),
      components: { DataGrid },
      props: {
        EuiDataGrid,
        DataGridColumn,
        DataGridPagination,
        DataGridSorting,
        DataGridInMemory,
        DataGridStyle,
        CellValueElement,
        DataGridSchemaDetector,
        DataGridToolbarDisplayOptions,
      },
      demo: (
        <Fragment>
          <DataGrid />
          <EuiSpacer size="xxl" />
          <EuiText>
            <h2>Snippet with everything on</h2>
            <p>
              Here is a very simple data grid example meant to give you an idea
              of the data structure and callbacks you&apos;ll need to provide.
            </p>
          </EuiText>
          <EuiSpacer />
          <EuiCodeBlock language="javascript" paddingSize="s" isCopyable>
            {gridSnippet}
          </EuiCodeBlock>
          <EuiSpacer size="xl" />
          <EuiText>
            <h3>General props explanation</h3>
            <p>
              Please check the props tab in the example above for more
              explanation on the lower level object types. The majority of the
              types are defined in the{' '}
              <a
                href="https://github.com/elastic/eui/tree/master/src/components/data_grid/data_grid_types.ts"
                target="_blank">
                /data_grid/data_grid_types.ts
              </a>{' '}
              file.
            </p>
          </EuiText>
          <EuiSpacer />
          <EuiDescriptionList
            compressed
            listItems={gridConcepts}
            type="responsiveColumn"
            titleProps={{ style: { width: '20%' } }}
            descriptionProps={{ style: { width: '80%' } }}
          />
        </Fragment>
      ),
    },
    {
      source: [
        {
          type: GuideSectionTypes.JS,
          code: inMemoryDataGridSource,
        },
        {
          type: GuideSectionTypes.HTML,
          code: inMemoryDataGridHtml,
        },
      ],
      title: 'In memory settings',
      text: (
        <Fragment>
          <p>
            The grid has levels of <strong>in memory</strong> settings that can
            be set. The higher levels open up more features, but require you to
            utilize callbacks for sorting and pagination as those features are
            enabled. The following settings are available. When possible, it is
            advisable to utilize in memory as deeply as possible to provide a
            better core experience for the user.
          </p>
          <ul>
            <li>
              <strong>undefined</strong>: when not in use the grid will not
              autodetect schemas. Unless you manually provide schemas, sorting
              will also be heavily limited and likely inaccurate.
            </li>
            <li>
              <strong>enhancements</strong>: provides no in memory operations.
              If set the grid will try to autodetect schemas only based on the
              content currently available (usually a single page of pagination)
            </li>
            <li>
              <strong>pagination</strong>: Enhancements are provided as above,
              but only pagination is performed in memory.
            </li>
            <li>
              <strong>sorting</strong>: Enhancements are provided as above, and
              pagination and sorting are both performed in memory.
            </li>
          </ul>
          <EuiCallOut size="s" title="Check how the schemas change in the demo">
            When inMemory is not set, schemas are not autodetected. Because no
            schemas are defined, the sorting doesn&apos;t really work.
          </EuiCallOut>
        </Fragment>
      ),
      components: { InMemoryDataGrid },
      demo: <InMemoryDataGrid />,
    },
    {
      source: [
        {
          type: GuideSectionTypes.JS,
          code: dataGridSchemaSource,
        },
        {
          type: GuideSectionTypes.HTML,
          code: dataGridSchemaHtml,
        },
      ],
      title: 'Schema detection and expansion formatters',
      text: (
        <Fragment>
          <p>
            Schemas are data types you pass to grid columns to effect how the
            columns and expansion popovers render. Schemas also allow you to
            define individual sorting comparators so that sorts can do more than
            just A-Z comparisons. By default, <EuiCode>EuiDataGrid</EuiCode>{' '}
            ships with a few built-in schemas for{' '}
            <EuiCode>numeric, currency, datetime, boolean and json</EuiCode>{' '}
            data. When the <EuiCode>inMemory</EuiCode> prop is in use it will
            automatically try to figure out the best schema based on the{' '}
            <EuiCode>{'inMemory: {{ level: value }}'}</EuiCode> you set, but
            this will come with the caveat you will need to provide and manage
            sorting callbacks outside the component. In general we recommend
            passing schema information to your columns instead of using
            auto-detection when you have that knowledge of your data available
            during ingestion.
          </p>
          <h4>Defining custom schemas</h4>
          <p>
            Beyond the provided set, you have the ability to define custom
            schemas. Custom schemas are passed as an array to{' '}
            <EuiCode>schemaDetectors</EuiCode> and are constructed against the{' '}
            <EuiCode>EuiDataGridSchemaDetector</EuiCode> interface. You can see
            an example of a simple custom schema used on the last column below.
            In addition to schemas beind useful to map against for cell and
            expansion rendering, any schema will also add a
            <EuiCode>
              className=&quot;euiDataGridRowCell--schemaName&quot;
            </EuiCode>{' '}
            to each matching cell.
          </p>
          <h4>Defining expansion formatters</h4>
          <p>
            Likewise, you can inject custom content into any of the popovers a
            cell expands into. Simply add a <EuiCode>customFormatters</EuiCode>{' '}
            function to populate a matching schema&apos;s popover using a new
            component. You can see an example of this by clicking into one of
            the cells in the last column below.
          </p>
          <h4>Disabling expansion popovers</h4>
          <p>
            Often the popovers are uncessary for short form content. In the
            example below we&apos;ve turned them off by setting{' '}
            <EuiCode>isExpandable=false</EuiCode> on boolean column.
          </p>
        </Fragment>
      ),
      components: { DataGridSchema },
      demo: <DataGridSchema />,
    },
    {
      source: [
        {
          type: GuideSectionTypes.JS,
          code: dataGridStylingSource,
        },
        {
          type: GuideSectionTypes.HTML,
          code: dataGridStylingHtml,
        },
      ],
      title: 'Styling and toolbar options',
      text: (
        <Fragment>
          <p>
            Styling can be passed down to the grid through the{' '}
            <EuiCode>gridStyle</EuiCode> prop. It accepts an object shape that
            allows for customization. When the density controls are also
            present, both font size and padding will merge against the initial
            defaults provided by the prop.
          </p>
          <p>
            Likewise the <EuiCode>toolbarDisplay</EuiCode> prop controls whether
            or not to show buttons on the toolbar to display above the grid. It
            accepts a boolean or shape object. The boolean allows turning off
            the toolbar entirely, while the shape allows you to turn off
            individual buttons as you need.
          </p>
        </Fragment>
      ),
      components: { DataGridStyling },
      demo: <DataGridStyling />,
    },
    {
      source: [
        {
          type: GuideSectionTypes.JS,
          code: dataGridContainerSource,
        },
        {
          type: GuideSectionTypes.HTML,
          code: dataGridContainerHtml,
        },
      ],
      title: 'Data grid adapts to its container',
      text: (
        <p>
          When wrapped inside a container, like a dashboard panel, the grid will
          start hiding controls and adopt a more strict flex layout
        </p>
      ),
      components: { DataGridContainer },
      demo: <DataGridContainer />,
    },
  ],
};
