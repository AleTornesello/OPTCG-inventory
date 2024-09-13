export type GenericTableColumn = GenericTableColumnItem | null;

interface GenericTableColumnItem {
  header: string;
  field: string;
  sortable?: boolean;
  class?: string;
  sortStrategy?: (field: string, desc: boolean) => GenericTableSortEvent[];
  width?: number | string;
  shrink?: boolean;
  visible?: boolean | (() => boolean);
}

export interface GenericTableSortEvent {
  field: string | number;
  desc: boolean;
}

export interface GenericTableReorderEvent {
  oldIndex?: number;
  newIndex?: number;
}

export const DEFAULT_PAGINATION_PAGE = 1;
export const DEFAULT_PAGINATION_ITEMS_PER_PAGE_OPTIONS = [10, 20, 50];
export const DEFAULT_PAGINATION_ITEMS_PER_PAGE =
  DEFAULT_PAGINATION_ITEMS_PER_PAGE_OPTIONS[0];
