# EuiMarkdownEditor

## Usage

EUI provides two primary markdown components: **EuiMarkdownEditor** and **EuiMarkdownFormatter**.

### EuiMarkdownEditor

Provides a markdown authoring experience for the user. This component consists of a toolbar, text area, and optionally a drag-and-drop zone to accept files. It can be toggled by the user between editing and preview modes.

### EuiMarkdownFormatter

The formatter is a stand-alone component for rendering markdown content, without providing a method for editing.

## Technical overview

[`unified`](https://www.npmjs.com/package/unified) is used to orchestrate parsing & rendering the markdown into React components. These two concepts are treated separately by the EUI components to provide concrete locations for additional plugins to be injected.

In addition to running the full pipeline, **EuiMarkdownEditor** uses just the parsing configuration to determine the input's validity, provide messages back to the application, and allow the toolbar buttons to interact with existing markdown tags.

## Plugin development

Plugin functionality is split into five parts. Some are optional, but it is rare for a plugin to not provide them all. 

* **Name**
* **UI** the toolbar button and optional configuration modal
* **Formatter** React component processing the plugin's AST node into a `ReactNode`
* **Text editor interaction** how a plugin modifies the markdown text
* **Parser** method to identify the plugin's markdown tag and parse it into an AST node

### Configuration

```typescript
export interface EuiMarkdownEditorUiPlugin {
  name: string;
  button: {
    label: string;
    iconType: IconType;
  };
  
  // either `formatting` or `editor` must be provided, but not both
  formatting: EuiMarkdownFormatting;
  editor: React.ComponentType;
}
```

### UI

Defines the label (used for ARIA and tooltip) and `IconType` for the toolbar button. Clicking this button triggers the **Formatter**.

### Formatter

Configures how the plugin's markdown tag is inserted, modified, and/or deleted. For markdown that doesn't have configuration, e.g. `**bold**` and `_emphasis__`, the formatter is a `EuiMarkdownFormatting` object as the value to `formatting`. If a plugin has UI for creating & editing the markdown, it must instead provide an `editor` value with the React component housing the UI, and trigger a callback on completion.

### Parser

[`remark-parse`](https://www.npmjs.com/package/remark-parse) is used to parse the input text into markdown AST nodes. Its documentation for writing parsers is under the [Extending the Parser](https://www.npmjs.com/package/remark-parse#extending-the-parser) section, but highlights are included below.

A parser is comprised of three pieces. There is a wrapping function which is provided to `remark-parse` and injects the parser, the parser method itself, and a `locator` function if the markdown tag is _inline_.

The parsing method is called at locations where its markdown down might be found at. The method is responsible for determining if the location is a valid tag, process the tag, and mark report the result.

#### Inline vs block

Inline tags are allowed at any point in text, and will be rendered somewhere within a `<p>` element. For better performance, inline parsers must provide a `locate` method which reports the location where their next tag _might_ be found. They are not allowed to span multiple lines of the input.

Block tags are rendered inside `<div>` elements, and do not have a `locate` method. They can consume as much input text as desired, across multiple lines. 

### Renderer

React component which is given an AST node to render, as defined by the parser. 
