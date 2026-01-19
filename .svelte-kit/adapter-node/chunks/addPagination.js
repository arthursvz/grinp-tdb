import { d as derived, r as readable, w as writable } from "./index2.js";
const derivedKeys = (storeMap) => {
  const entries = Object.entries(storeMap);
  const keys = entries.map(([key]) => key);
  return derived(entries.map(([, store]) => store), ($stores) => {
    return Object.fromEntries($stores.map((store, idx) => [keys[idx], store]));
  });
};
const isReadable = (value) => {
  return value?.subscribe instanceof Function;
};
const Undefined = readable(void 0);
class Column {
  header;
  footer;
  height;
  plugins;
  constructor({ header, footer, height, plugins }) {
    this.header = header;
    this.footer = footer;
    this.height = height;
    this.plugins = plugins;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isFlat() {
    return "__flat" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isData() {
    return "__data" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isDisplay() {
    return "__display" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isGroup() {
    return "__group" in this;
  }
}
class FlatColumn extends Column {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __flat = true;
  id;
  constructor({ header, footer, plugins, id }) {
    super({ header, footer, plugins, height: 1 });
    this.id = id ?? String(header);
  }
}
class DataColumn extends FlatColumn {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __data = true;
  cell;
  accessorKey;
  accessorFn;
  constructor({ header, footer, plugins, cell, accessor, id }) {
    super({ header, footer, plugins, id: "Initialization not complete" });
    this.cell = cell;
    if (accessor instanceof Function) {
      this.accessorFn = accessor;
    } else {
      this.accessorKey = accessor;
    }
    if (id === void 0 && this.accessorKey === void 0 && header === void 0) {
      throw new Error("A column id, string accessor, or header is required");
    }
    const accessorKeyId = typeof this.accessorKey === "string" ? this.accessorKey : null;
    this.id = id ?? accessorKeyId ?? String(header);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue(item) {
    if (this.accessorFn !== void 0) {
      return this.accessorFn(item);
    }
    if (this.accessorKey !== void 0) {
      return item[this.accessorKey];
    }
    return void 0;
  }
}
class DisplayColumn extends FlatColumn {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __display = true;
  cell;
  data;
  constructor({ header, footer, plugins, id, cell, data }) {
    super({ header, footer, plugins, id });
    this.cell = cell;
    this.data = data;
  }
}
class GroupColumn extends Column {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __group = true;
  columns;
  ids;
  constructor({ header, footer, columns, plugins }) {
    const height = Math.max(...columns.map((c) => c.height)) + 1;
    super({ header, footer, height, plugins });
    this.columns = columns;
    this.ids = getFlatColumnIds(columns);
  }
}
const getFlatColumnIds = (columns) => columns.flatMap((c) => c.isFlat() ? [c.id] : c.isGroup() ? c.ids : []);
const getFlatColumns = (columns) => {
  return columns.flatMap((c) => c.isFlat() ? [c] : c.isGroup() ? getFlatColumns(c.columns) : []);
};
const getCounter = (items) => {
  const result = /* @__PURE__ */ new Map();
  items.forEach((item) => {
    result.set(item, (result.get(item) ?? 0) + 1);
  });
  return result;
};
const getDuplicates = (items) => {
  return Array.from(getCounter(items).entries()).filter(([, count]) => count !== 1).map(([key]) => key);
};
const stringifyCss = (style) => {
  return Object.entries(style).map(([name, value]) => `${name}:${value}`).join(";");
};
const mergeAttributes = (a, b) => {
  if (a.style === void 0 && b.style === void 0) {
    return { ...a, ...b };
  }
  return {
    ...a,
    ...b,
    style: {
      ...typeof a.style === "object" ? a.style : {},
      ...typeof b.style === "object" ? b.style : {}
    }
  };
};
const finalizeAttributes = (attrs) => {
  if (attrs.style === void 0 || typeof attrs.style !== "object") {
    return attrs;
  }
  return {
    ...attrs,
    style: stringifyCss(attrs.style)
  };
};
class TableComponent {
  id;
  constructor({ id }) {
    this.id = id;
  }
  attrsForName = {};
  attrs() {
    return derived(Object.values(this.attrsForName), ($attrsArray) => {
      let $mergedAttrs = {};
      $attrsArray.forEach(($attrs) => {
        $mergedAttrs = mergeAttributes($mergedAttrs, $attrs);
      });
      return finalizeAttributes($mergedAttrs);
    });
  }
  propsForName = {};
  props() {
    return derivedKeys(this.propsForName);
  }
  state;
  injectState(state) {
    this.state = state;
  }
  applyHook(pluginName, hook) {
    if (hook.props !== void 0) {
      this.propsForName[pluginName] = hook.props;
    }
    if (hook.attrs !== void 0) {
      this.attrsForName[pluginName] = hook.attrs;
    }
  }
}
class BodyCell extends TableComponent {
  row;
  constructor({ id, row }) {
    super({ id });
    this.row = row;
  }
  attrs() {
    return derived(super.attrs(), ($baseAttrs) => {
      return {
        ...$baseAttrs,
        role: "cell"
      };
    });
  }
  rowColId() {
    return `${this.row.id}:${this.column.id}`;
  }
  dataRowColId() {
    if (!this.row.isData()) {
      return void 0;
    }
    return `${this.row.dataId}:${this.column.id}`;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isData() {
    return "__data" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isDisplay() {
    return "__display" in this;
  }
}
class DataBodyCell extends BodyCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __data = true;
  column;
  label;
  value;
  constructor({ row, column, label, value }) {
    super({ id: column.id, row });
    this.column = column;
    this.label = label;
    this.value = value;
  }
  render() {
    if (this.label === void 0) {
      return `${this.value}`;
    }
    if (this.state === void 0) {
      throw new Error("Missing `state` reference");
    }
    return this.label(this, this.state);
  }
  clone() {
    const clonedCell = new DataBodyCell({
      row: this.row,
      column: this.column,
      label: this.label,
      value: this.value
    });
    return clonedCell;
  }
}
class DisplayBodyCell extends BodyCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __display = true;
  column;
  label;
  constructor({ row, column, label }) {
    super({ id: column.id, row });
    this.column = column;
    this.label = label;
  }
  render() {
    if (this.state === void 0) {
      throw new Error("Missing `state` reference");
    }
    return this.label(this, this.state);
  }
  clone() {
    const clonedCell = new DisplayBodyCell({
      row: this.row,
      column: this.column,
      label: this.label
    });
    return clonedCell;
  }
}
const nonUndefined = (value) => value !== void 0;
class BodyRow extends TableComponent {
  cells;
  /**
   * Get the cell with a given column id.
   *
   * **This includes hidden cells.**
   */
  cellForId;
  depth;
  parentRow;
  subRows;
  constructor({ id, cells, cellForId, depth = 0, parentRow }) {
    super({ id });
    this.cells = cells;
    this.cellForId = cellForId;
    this.depth = depth;
    this.parentRow = parentRow;
  }
  attrs() {
    return derived(super.attrs(), ($baseAttrs) => {
      return {
        ...$baseAttrs,
        role: "row"
      };
    });
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isData() {
    return "__data" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isDisplay() {
    return "__display" in this;
  }
}
class DataBodyRow extends BodyRow {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __data = true;
  dataId;
  original;
  constructor({ id, dataId, original, cells, cellForId, depth = 0, parentRow }) {
    super({ id, cells, cellForId, depth, parentRow });
    this.dataId = dataId;
    this.original = original;
  }
  clone({ includeCells = false, includeSubRows = false } = {}) {
    const clonedRow = new DataBodyRow({
      id: this.id,
      dataId: this.dataId,
      cellForId: this.cellForId,
      cells: this.cells,
      original: this.original,
      depth: this.depth
    });
    if (includeCells) {
      const clonedCellsForId = Object.fromEntries(Object.entries(clonedRow.cellForId).map(([id, cell]) => {
        const clonedCell = cell.clone();
        clonedCell.row = clonedRow;
        return [id, clonedCell];
      }));
      const clonedCells = clonedRow.cells.map(({ id }) => clonedCellsForId[id]);
      clonedRow.cellForId = clonedCellsForId;
      clonedRow.cells = clonedCells;
    }
    if (includeSubRows) {
      const clonedSubRows = this.subRows?.map((row) => row.clone({ includeCells, includeSubRows }));
      clonedRow.subRows = clonedSubRows;
    } else {
      clonedRow.subRows = this.subRows;
    }
    return clonedRow;
  }
}
const getBodyRows = (data, flatColumns, { rowDataId } = {}) => {
  const rows = data.map((item, idx) => {
    const id = idx.toString();
    return new DataBodyRow({
      id,
      dataId: rowDataId !== void 0 ? rowDataId(item, idx) : id,
      original: item,
      cells: [],
      cellForId: {}
    });
  });
  data.forEach((item, rowIdx) => {
    const cells = flatColumns.map((col) => {
      if (col.isData()) {
        const dataCol = col;
        const value = dataCol.getValue(item);
        return new DataBodyCell({
          row: rows[rowIdx],
          column: dataCol,
          label: col.cell,
          value
        });
      }
      if (col.isDisplay()) {
        const displayCol = col;
        return new DisplayBodyCell({
          row: rows[rowIdx],
          column: displayCol,
          label: col.cell
        });
      }
      throw new Error("Unrecognized `FlatColumn` implementation");
    });
    rows[rowIdx].cells = cells;
    flatColumns.forEach((c, colIdx) => {
      rows[rowIdx].cellForId[c.id] = cells[colIdx];
    });
  });
  return rows;
};
const getColumnedBodyRows = (rows, columnIdOrder) => {
  const columnedRows = rows.map((row) => {
    const clonedRow = row.clone();
    clonedRow.cells = [];
    clonedRow.cellForId = {};
    return clonedRow;
  });
  if (rows.length === 0 || columnIdOrder.length === 0)
    return rows;
  rows.forEach((row, rowIdx) => {
    const cells = row.cells.map((cell) => {
      const clonedCell = cell.clone();
      clonedCell.row = columnedRows[rowIdx];
      return clonedCell;
    });
    const visibleCells = columnIdOrder.map((cid) => {
      return cells.find((c) => c.id === cid);
    }).filter(nonUndefined);
    columnedRows[rowIdx].cells = visibleCells;
    cells.forEach((cell) => {
      columnedRows[rowIdx].cellForId[cell.id] = cell;
    });
  });
  return columnedRows;
};
const NBSP = " ";
class HeaderCell extends TableComponent {
  label;
  colspan;
  colstart;
  constructor({ id, label, colspan, colstart }) {
    super({ id });
    this.label = label;
    this.colspan = colspan;
    this.colstart = colstart;
  }
  render() {
    if (this.label instanceof Function) {
      if (this.state === void 0) {
        throw new Error("Missing `state` reference");
      }
      return this.label(this, this.state);
    }
    return this.label;
  }
  attrs() {
    return derived(super.attrs(), ($baseAttrs) => {
      return {
        ...$baseAttrs,
        role: "columnheader",
        colspan: this.colspan
      };
    });
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isFlat() {
    return "__flat" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isData() {
    return "__data" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isFlatDisplay() {
    return "__flat" in this && "__display" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isGroup() {
    return "__group" in this;
  }
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  isGroupDisplay() {
    return "__group" in this && "__display" in this;
  }
}
class FlatHeaderCell extends HeaderCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __flat = true;
  constructor({ id, label, colstart }) {
    super({ id, label, colspan: 1, colstart });
  }
  clone() {
    return new FlatHeaderCell({
      id: this.id,
      label: this.label,
      colstart: this.colstart
    });
  }
}
class DataHeaderCell extends FlatHeaderCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __data = true;
  accessorKey;
  accessorFn;
  constructor({ id, label, accessorKey, accessorFn, colstart }) {
    super({ id, label, colstart });
    this.accessorKey = accessorKey;
    this.accessorFn = accessorFn;
  }
  clone() {
    return new DataHeaderCell({
      id: this.id,
      label: this.label,
      accessorFn: this.accessorFn,
      accessorKey: this.accessorKey,
      colstart: this.colstart
    });
  }
}
class FlatDisplayHeaderCell extends FlatHeaderCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __display = true;
  constructor({ id, label = NBSP, colstart }) {
    super({ id, label, colstart });
  }
  clone() {
    return new FlatDisplayHeaderCell({
      id: this.id,
      label: this.label,
      colstart: this.colstart
    });
  }
}
class GroupHeaderCell extends HeaderCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __group = true;
  ids;
  allId;
  allIds;
  constructor({ label, ids, allIds, colspan, colstart }) {
    super({ id: `[${ids.join(",")}]`, label, colspan, colstart });
    this.ids = ids;
    this.allId = `[${allIds.join(",")}]`;
    this.allIds = allIds;
  }
  setIds(ids) {
    this.ids = ids;
    this.id = `[${this.ids.join(",")}]`;
  }
  pushId(id) {
    this.ids = [...this.ids, id];
    this.id = `[${this.ids.join(",")}]`;
  }
  clone() {
    return new GroupHeaderCell({
      label: this.label,
      ids: this.ids,
      allIds: this.allIds,
      colspan: this.colspan,
      colstart: this.colstart
    });
  }
}
class GroupDisplayHeaderCell extends GroupHeaderCell {
  // TODO Workaround for https://github.com/vitejs/vite/issues/9528
  __display = true;
  constructor({ label = NBSP, ids, allIds, colspan = 1, colstart }) {
    super({ label, ids, allIds, colspan, colstart });
  }
  clone() {
    return new GroupDisplayHeaderCell({
      label: this.label,
      ids: this.ids,
      allIds: this.allIds,
      colspan: this.colspan,
      colstart: this.colstart
    });
  }
}
const sum = (nums) => nums.reduce((a, b) => a + b, 0);
const getNullMatrix = (width, height) => {
  const result = [];
  for (let i = 0; i < height; i++) {
    result.push(Array(width).fill(null));
  }
  return result;
};
const getTransposed = (matrix) => {
  const height = matrix.length;
  if (height === 0) {
    return matrix;
  }
  const width = matrix[0].length;
  const result = getNullMatrix(height, width);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      result[i][j] = matrix[j][i];
    }
  }
  return result;
};
class HeaderRow extends TableComponent {
  cells;
  constructor({ id, cells }) {
    super({ id });
    this.cells = cells;
  }
  attrs() {
    return derived(super.attrs(), ($baseAttrs) => {
      return {
        ...$baseAttrs,
        role: "row"
      };
    });
  }
  clone() {
    return new HeaderRow({
      id: this.id,
      cells: this.cells
    });
  }
}
const getHeaderRows = (columns, flatColumnIds = []) => {
  const rowMatrix = getHeaderRowMatrix(columns);
  let columnMatrix = getTransposed(rowMatrix);
  columnMatrix = getOrderedColumnMatrix(columnMatrix, flatColumnIds);
  populateGroupHeaderCellIds(columnMatrix);
  return headerRowsForRowMatrix(getTransposed(columnMatrix));
};
const getHeaderRowMatrix = (columns) => {
  const maxColspan = sum(columns.map((c) => c.isGroup() ? c.ids.length : 1));
  const maxHeight = Math.max(...columns.map((c) => c.height));
  const rowMatrix = getNullMatrix(maxColspan, maxHeight);
  let cellOffset = 0;
  columns.forEach((c) => {
    const heightOffset = maxHeight - c.height;
    loadHeaderRowMatrix(rowMatrix, c, heightOffset, cellOffset);
    cellOffset += c.isGroup() ? c.ids.length : 1;
  });
  return rowMatrix.map((cells, rowIdx) => cells.map((cell, columnIdx) => {
    if (cell !== null)
      return cell;
    if (rowIdx === maxHeight - 1)
      return new FlatDisplayHeaderCell({ id: columnIdx.toString(), colstart: columnIdx });
    const flatId = rowMatrix[maxHeight - 1][columnIdx]?.id ?? columnIdx.toString();
    return new GroupDisplayHeaderCell({ ids: [], allIds: [flatId], colstart: columnIdx });
  }));
};
const loadHeaderRowMatrix = (rowMatrix, column, rowOffset, cellOffset) => {
  if (column.isData()) {
    rowMatrix[rowMatrix.length - 1][cellOffset] = new DataHeaderCell({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: column.header,
      accessorFn: column.accessorFn,
      accessorKey: column.accessorKey,
      id: column.id,
      colstart: cellOffset
    });
    return;
  }
  if (column.isDisplay()) {
    rowMatrix[rowMatrix.length - 1][cellOffset] = new FlatDisplayHeaderCell({
      id: column.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      label: column.header,
      colstart: cellOffset
    });
    return;
  }
  if (column.isGroup()) {
    for (let i = 0; i < column.ids.length; i++) {
      rowMatrix[rowOffset][cellOffset + i] = new GroupHeaderCell({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        label: column.header,
        colspan: 1,
        allIds: column.ids,
        ids: [],
        colstart: cellOffset
      });
    }
    let childCellOffset = 0;
    column.columns.forEach((c) => {
      loadHeaderRowMatrix(rowMatrix, c, rowOffset + 1, cellOffset + childCellOffset);
      childCellOffset += c.isGroup() ? c.ids.length : 1;
    });
    return;
  }
};
const getOrderedColumnMatrix = (columnMatrix, flatColumnIds) => {
  if (flatColumnIds.length === 0) {
    return columnMatrix;
  }
  const orderedColumnMatrix = [];
  flatColumnIds.forEach((key, columnIdx) => {
    const nextColumn = columnMatrix.find((columnCells) => {
      const flatCell = columnCells[columnCells.length - 1];
      if (!flatCell.isFlat()) {
        throw new Error("The last element of each column must be a `FlatHeaderCell`");
      }
      return flatCell.id === key;
    });
    if (nextColumn !== void 0) {
      orderedColumnMatrix.push(nextColumn.map((column) => {
        const clonedColumn = column.clone();
        clonedColumn.colstart = columnIdx;
        return clonedColumn;
      }));
    }
  });
  return orderedColumnMatrix;
};
const populateGroupHeaderCellIds = (columnMatrix) => {
  columnMatrix.forEach((columnCells) => {
    const lastCell = columnCells[columnCells.length - 1];
    if (!lastCell.isFlat()) {
      throw new Error("The last element of each column must be a `FlatHeaderCell`");
    }
    columnCells.forEach((c) => {
      if (c.isGroup()) {
        c.pushId(lastCell.id);
      }
    });
  });
};
const headerRowsForRowMatrix = (rowMatrix) => {
  return rowMatrix.map((rowCells, rowIdx) => {
    return new HeaderRow({ id: rowIdx.toString(), cells: getMergedRow(rowCells) });
  });
};
const getMergedRow = (cells) => {
  if (cells.length === 0) {
    return cells;
  }
  const mergedCells = [];
  let startIdx = 0;
  let endIdx = 1;
  while (startIdx < cells.length) {
    const cell = cells[startIdx].clone();
    if (!cell.isGroup()) {
      mergedCells.push(cell);
      startIdx++;
      continue;
    }
    endIdx = startIdx + 1;
    const ids = [...cell.ids];
    while (endIdx < cells.length) {
      const nextCell = cells[endIdx];
      if (!nextCell.isGroup()) {
        break;
      }
      if (cell.allId !== nextCell.allId) {
        break;
      }
      ids.push(...nextCell.ids);
      endIdx++;
    }
    cell.setIds(ids);
    cell.colspan = endIdx - startIdx;
    mergedCells.push(cell);
    startIdx = endIdx;
  }
  return mergedCells;
};
const createViewModel = (table, columns, { rowDataId } = {}) => {
  const { data, plugins } = table;
  const $flatColumns = getFlatColumns(columns);
  const flatColumns = readable($flatColumns);
  const originalRows = derived([data, flatColumns], ([$data, $flatColumns2]) => {
    return getBodyRows($data, $flatColumns2, { rowDataId });
  });
  const _visibleColumns = writable([]);
  const _headerRows = writable();
  const _rows = writable([]);
  const _pageRows = writable([]);
  const _tableAttrs = writable({
    role: "table"
  });
  const _tableHeadAttrs = writable({});
  const _tableBodyAttrs = writable({
    role: "rowgroup"
  });
  const pluginInitTableState = {
    data,
    columns,
    flatColumns: $flatColumns,
    tableAttrs: _tableAttrs,
    tableHeadAttrs: _tableHeadAttrs,
    tableBodyAttrs: _tableBodyAttrs,
    visibleColumns: _visibleColumns,
    headerRows: _headerRows,
    originalRows,
    rows: _rows,
    pageRows: _pageRows
  };
  const pluginInstances = Object.fromEntries(Object.entries(plugins).map(([pluginName, plugin]) => {
    const columnOptions = Object.fromEntries($flatColumns.map((c) => {
      const option = c.plugins?.[pluginName];
      if (option === void 0)
        return void 0;
      return [c.id, option];
    }).filter(nonUndefined));
    return [
      pluginName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugin({ pluginName, tableState: pluginInitTableState, columnOptions })
    ];
  }));
  const pluginStates = Object.fromEntries(Object.entries(pluginInstances).map(([key, pluginInstance]) => [
    key,
    pluginInstance.pluginState
  ]));
  const tableState = {
    data,
    columns,
    flatColumns: $flatColumns,
    tableAttrs: _tableAttrs,
    tableHeadAttrs: _tableHeadAttrs,
    tableBodyAttrs: _tableBodyAttrs,
    visibleColumns: _visibleColumns,
    headerRows: _headerRows,
    originalRows,
    rows: _rows,
    pageRows: _pageRows,
    pluginStates
  };
  const deriveTableAttrsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.deriveTableAttrs).filter(nonUndefined);
  let tableAttrs = readable({
    role: "table"
  });
  deriveTableAttrsFns.forEach((fn) => {
    tableAttrs = fn(tableAttrs);
  });
  const finalizedTableAttrs = derived(tableAttrs, ($tableAttrs) => {
    const $finalizedAttrs = finalizeAttributes($tableAttrs);
    _tableAttrs.set($finalizedAttrs);
    return $finalizedAttrs;
  });
  const deriveTableHeadAttrsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.deriveTableBodyAttrs).filter(nonUndefined);
  let tableHeadAttrs = readable({});
  deriveTableHeadAttrsFns.forEach((fn) => {
    tableHeadAttrs = fn(tableHeadAttrs);
  });
  const finalizedTableHeadAttrs = derived(tableHeadAttrs, ($tableHeadAttrs) => {
    const $finalizedAttrs = finalizeAttributes($tableHeadAttrs);
    _tableHeadAttrs.set($finalizedAttrs);
    return $finalizedAttrs;
  });
  const deriveTableBodyAttrsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.deriveTableBodyAttrs).filter(nonUndefined);
  let tableBodyAttrs = readable({
    role: "rowgroup"
  });
  deriveTableBodyAttrsFns.forEach((fn) => {
    tableBodyAttrs = fn(tableBodyAttrs);
  });
  const finalizedTableBodyAttrs = derived(tableBodyAttrs, ($tableBodyAttrs) => {
    const $finalizedAttrs = finalizeAttributes($tableBodyAttrs);
    _tableBodyAttrs.set($finalizedAttrs);
    return $finalizedAttrs;
  });
  const deriveFlatColumnsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.deriveFlatColumns).filter(nonUndefined);
  let visibleColumns = flatColumns;
  deriveFlatColumnsFns.forEach((fn) => {
    visibleColumns = fn(visibleColumns);
  });
  const injectedColumns = derived(visibleColumns, ($visibleColumns) => {
    _visibleColumns.set($visibleColumns);
    return $visibleColumns;
  });
  const columnedRows = derived([originalRows, injectedColumns], ([$originalRows, $injectedColumns]) => {
    return getColumnedBodyRows($originalRows, $injectedColumns.map((c) => c.id));
  });
  const deriveRowsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.deriveRows).filter(nonUndefined);
  let rows = columnedRows;
  deriveRowsFns.forEach((fn) => {
    rows = fn(rows);
  });
  const injectedRows = derived(rows, ($rows) => {
    $rows.forEach((row) => {
      row.injectState(tableState);
      row.cells.forEach((cell) => {
        cell.injectState(tableState);
      });
    });
    Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
      $rows.forEach((row) => {
        if (pluginInstance.hooks?.["tbody.tr"] !== void 0) {
          row.applyHook(pluginName, pluginInstance.hooks["tbody.tr"](row));
        }
        row.cells.forEach((cell) => {
          if (pluginInstance.hooks?.["tbody.tr.td"] !== void 0) {
            cell.applyHook(pluginName, pluginInstance.hooks["tbody.tr.td"](cell));
          }
        });
      });
    });
    _rows.set($rows);
    return $rows;
  });
  const derivePageRowsFns = Object.values(pluginInstances).map((pluginInstance) => pluginInstance.derivePageRows).filter(nonUndefined);
  let pageRows = injectedRows;
  derivePageRowsFns.forEach((fn) => {
    pageRows = fn(pageRows);
  });
  const injectedPageRows = derived(pageRows, ($pageRows) => {
    $pageRows.forEach((row) => {
      row.injectState(tableState);
      row.cells.forEach((cell) => {
        cell.injectState(tableState);
      });
    });
    Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
      $pageRows.forEach((row) => {
        if (pluginInstance.hooks?.["tbody.tr"] !== void 0) {
          row.applyHook(pluginName, pluginInstance.hooks["tbody.tr"](row));
        }
        row.cells.forEach((cell) => {
          if (pluginInstance.hooks?.["tbody.tr.td"] !== void 0) {
            cell.applyHook(pluginName, pluginInstance.hooks["tbody.tr.td"](cell));
          }
        });
      });
    });
    _pageRows.set($pageRows);
    return $pageRows;
  });
  const headerRows = derived(injectedColumns, ($injectedColumns) => {
    const $headerRows = getHeaderRows(columns, $injectedColumns.map((c) => c.id));
    $headerRows.forEach((row) => {
      row.injectState(tableState);
      row.cells.forEach((cell) => {
        cell.injectState(tableState);
      });
    });
    Object.entries(pluginInstances).forEach(([pluginName, pluginInstance]) => {
      $headerRows.forEach((row) => {
        if (pluginInstance.hooks?.["thead.tr"] !== void 0) {
          row.applyHook(pluginName, pluginInstance.hooks["thead.tr"](row));
        }
        row.cells.forEach((cell) => {
          if (pluginInstance.hooks?.["thead.tr.th"] !== void 0) {
            cell.applyHook(pluginName, pluginInstance.hooks["thead.tr.th"](cell));
          }
        });
      });
    });
    _headerRows.set($headerRows);
    return $headerRows;
  });
  return {
    tableAttrs: finalizedTableAttrs,
    tableHeadAttrs: finalizedTableHeadAttrs,
    tableBodyAttrs: finalizedTableBodyAttrs,
    visibleColumns: injectedColumns,
    flatColumns: $flatColumns,
    headerRows,
    originalRows,
    rows: injectedRows,
    pageRows: injectedPageRows,
    pluginStates
  };
};
class Table {
  data;
  plugins;
  constructor(data, plugins) {
    this.data = data;
    this.plugins = plugins;
  }
  createColumns(columns) {
    const ids = getFlatColumnIds(columns);
    const duplicateIds = getDuplicates(ids);
    if (duplicateIds.length !== 0) {
      throw new Error(`Duplicate column ids not allowed: "${duplicateIds.join('", "')}"`);
    }
    return columns;
  }
  column(def) {
    return new DataColumn(def);
  }
  group(def) {
    return new GroupColumn(def);
  }
  display(def) {
    return new DisplayColumn(def);
  }
  createViewModel(columns, options) {
    return createViewModel(this, columns, options);
  }
}
const createTable = (data, plugins = {}) => {
  return new Table(data, plugins);
};
readable(void 0);
const MIN_PAGE_SIZE = 1;
const createPageStore = ({ items, initialPageSize, initialPageIndex, serverSide, serverItemCount }) => {
  const pageSize = writable(initialPageSize);
  const updatePageSize = (fn) => {
    pageSize.update(($pageSize) => {
      const newPageSize = fn($pageSize);
      return Math.max(newPageSize, MIN_PAGE_SIZE);
    });
  };
  const setPageSize = (newPageSize) => updatePageSize(() => newPageSize);
  const pageIndex = writable(initialPageIndex);
  function calcPageCountAndLimitIndex([$pageSize, $itemCount]) {
    const $pageCount = Math.ceil($itemCount / $pageSize);
    pageIndex.update(($pageIndex) => {
      if ($pageCount > 0 && $pageIndex >= $pageCount) {
        return $pageCount - 1;
      }
      return $pageIndex;
    });
    return $pageCount;
  }
  let pageCount;
  if (serverSide && serverItemCount != null) {
    pageCount = derived([pageSize, serverItemCount], calcPageCountAndLimitIndex);
  } else {
    const itemCount = derived(items, ($items) => $items.length);
    pageCount = derived([pageSize, itemCount], calcPageCountAndLimitIndex);
  }
  const hasPreviousPage = derived(pageIndex, ($pageIndex) => {
    return $pageIndex > 0;
  });
  const hasNextPage = derived([pageIndex, pageCount], ([$pageIndex, $pageCount]) => {
    return $pageIndex < $pageCount - 1;
  });
  return {
    pageSize: {
      subscribe: pageSize.subscribe,
      update: updatePageSize,
      set: setPageSize
    },
    pageIndex,
    pageCount,
    serverItemCount,
    hasPreviousPage,
    hasNextPage
  };
};
const addPagination = ({ initialPageIndex = 0, initialPageSize = 10, serverSide = false, serverItemCount } = {}) => () => {
  const prePaginatedRows = writable([]);
  const paginatedRows = writable([]);
  const { pageSize, pageIndex, pageCount, hasPreviousPage, hasNextPage } = createPageStore({
    items: prePaginatedRows,
    initialPageIndex,
    initialPageSize,
    serverSide,
    serverItemCount
  });
  const pluginState = {
    pageSize,
    pageIndex,
    pageCount,
    hasPreviousPage,
    hasNextPage
  };
  const derivePageRows = (rows) => {
    return derived([rows, pageSize, pageIndex], ([$rows, $pageSize, $pageIndex]) => {
      prePaginatedRows.set($rows);
      if (serverSide) {
        paginatedRows.set($rows);
        return $rows;
      }
      const startIdx = $pageIndex * $pageSize;
      const _paginatedRows = $rows.slice(startIdx, startIdx + $pageSize);
      paginatedRows.set(_paginatedRows);
      return _paginatedRows;
    });
  };
  return {
    pluginState,
    derivePageRows
  };
};
export {
  Undefined as U,
  addPagination as a,
  createTable as c,
  derivedKeys as d,
  isReadable as i
};
