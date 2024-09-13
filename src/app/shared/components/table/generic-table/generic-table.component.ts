import {Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef,} from '@angular/core';
import {
  DEFAULT_PAGINATION_ITEMS_PER_PAGE,
  DEFAULT_PAGINATION_ITEMS_PER_PAGE_OPTIONS, DEFAULT_PAGINATION_PAGE,
  GenericTableColumn,
  GenericTableReorderEvent,
  GenericTableSortEvent,
} from '../../../models/table';

import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {
  faArrowAltCircleUp,
  faArrowDown,
  faArrowDownWideShort,
  faBars,
  faFilter,
  faMagnifyingGlass,
  faPlus,
  faTableCellsLarge,
} from '@fortawesome/free-solid-svg-icons';
import {TableCellDirective} from '../../../directives/table-cell.directive';
import {CommonModule} from '@angular/common';
import {SelectItem} from 'primeng/api';
import {MenuItem} from '../../panel/menu-panel/menu-panel.component';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {TableModule, TableRowReorderEvent} from 'primeng/table';
import {SafePipe} from '../../../pipes/safe.pipe';
import {ButtonModule} from 'primeng/button';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import {PaginatorModule} from 'primeng/paginator';
import {AvoidEmptyValuePipe} from '../../../pipes/avoid-empty-value.pipe';
import {SwitchComponent} from '../../inputs/switch/switch.component';
import {CapitalizePipe} from '../../../pipes/capitalize.pipe';
import {EmptySearchComponent} from '../../empty-search/empty-search.component';
import {EmptyMessageComponent} from '../../empty-message/empty-message.component';
import {TableUnsortDirective} from "../../../directives/table-unsort.directive";
import {ButtonComponent} from "../../button/button.component";
import {InputTextComponent} from "../../inputs/input-text/input-text.component";

export interface CellTemplateContext {
  $implicit: any;
  columns: GenericTableColumn[];
}

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslocoModule,
    SafePipe,
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    CheckboxModule,
    PaginatorModule,
    AvoidEmptyValuePipe,
    SwitchComponent,
    CapitalizePipe,
    EmptySearchComponent,
    EmptyMessageComponent,
    TableUnsortDirective,
    ButtonComponent,
    InputTextComponent
  ],
})
export class GenericTableComponent {
  @ContentChildren(TableCellDirective)
  private _tableCellDirectives: QueryList<TableCellDirective> | undefined;

  get items(): any[] {
    return this._items;
  }

  @Input() set items(items: any[]) {
    this._items = items;
    this._updatePaginatorLimits();
    this.selectedElement = [];
  }

  @Input({required: true}) set columns(columns: GenericTableColumn[]) {
    this._columns = columns.filter((c) => c !== null);
  }

  get columns(): GenericTableColumn[] {
    return this._columns.filter((c) => {
      if (c!.visible === undefined) {
        return true;
      }
      if (typeof c!.visible === 'boolean') {
        return c!.visible;
      }
      return c!.visible();
    });
  }

  get totalItems(): number {
    return this._totalItems;
  }

  @Input() set totalItems(totalItems: number) {
    this._totalItems = totalItems;
    this._updatePaginatorLimits();
  }

  @Input() itemsPerPage: number;
  @Input() rowClass: string | ((item: any) => string) | null;
  @Input() hidePaginator: boolean;
  @Input() hideAddButton: boolean;
  @Input() count: boolean;
  @Input() title: string | undefined;
  @Input() searchPlaceholder: string | undefined;

  @Input() hideSelection: boolean;
  @Input() hideSingleSelection: boolean;
  @Input() hideSearch: boolean;
  @Input() customEmptyMessage: string | undefined;

  @Input() hideCaption: boolean;
  @Input() showAdvancedSearch: boolean;
  @Input() showSelectionToggle: boolean;
  @Input() reorderable: boolean;

  @Input() set actions(actions: MenuItem[]) {
    this._actions = actions.filter((action) => {
      if (action.visible === undefined || action.visible === null) {
        return true;
      }

      if (typeof action.visible === 'boolean') {
        return action.visible;
      }

      return action.visible();
    });
  }

  get actions(): MenuItem[] {
    return this._actions;
  }

  @Input() set addActions(addActions: MenuItem[]) {
    this._addActions = addActions.filter((action) => {
      if (action.visible === undefined || action.visible === null) {
        return true;
      }

      if (typeof action.visible === 'boolean') {
        return action.visible;
      }

      return action.visible();
    });
  }

  get addActions(): MenuItem[] {
    return this._addActions;
  }

  @Input() selectedElement: any;

  @Input() advancedSearchTopic: string | null;
  @Input() advancedSearchSaveKey: string | undefined;
  @Input() selectedRows: any[] | null;
  @Input() selectionIndex: string | undefined;
  @Input() searchText: string | undefined;
  @Input() newButtonLabel: string;
  @Input() showExcelFilters: boolean;
  @Input() excelFilterFields: SelectItem<number>[];
  @Input() exampleFileLink: string | undefined;

  @Output() sort: EventEmitter<GenericTableSortEvent[] | null>;
  @Output() page: EventEmitter<{ page: number; itemsPerPage: number }>;
  @Output() rows: EventEmitter<number>;
  @Output() add: EventEmitter<void>;
  @Output() dblClick: EventEmitter<any>;
  @Output() search: EventEmitter<{
    searchText: string | undefined;
    // filters: Filter[] | undefined;
  }>;
  @Output() select: EventEmitter<any[]>;
  @Output() reorder: EventEmitter<GenericTableReorderEvent>;

  public _items: any[];
  public _totalItems: number;
  public paginatorStart: number;
  public paginatorEnd: number;
  public currentPage: number;
  public hasFilter: boolean;
  public isFiltersVisible: boolean;

  protected readonly faUp: IconDefinition;
  protected readonly faDown: IconDefinition;
  protected readonly faTableCellsLarge: IconDefinition;
  protected readonly faPlus: IconDefinition;
  protected readonly faMagnifyingGlass: IconDefinition;
  protected readonly faFilter: IconDefinition;
  protected readonly faArrowDownWideShort: IconDefinition;
  protected readonly faBars = faBars;

  private _actions: MenuItem[];
  private _addActions: MenuItem[];

  public get paginatorItemsPerPageOptions() {
    return DEFAULT_PAGINATION_ITEMS_PER_PAGE_OPTIONS;
  }

  private _columns: GenericTableColumn[];

  constructor(private _translateService: TranslocoService) {
    this._columns = [];
    this._items = [];
    this._totalItems = 0;
    this.paginatorStart = 0;
    this.paginatorEnd = 0;
    this.itemsPerPage = DEFAULT_PAGINATION_ITEMS_PER_PAGE;
    this.currentPage = 1;
    this.rowClass = null;
    this.hidePaginator = false;
    this.showSelectionToggle = false;
    this.reorderable = false;

    this.hasFilter = true;
    this.hideSelection = false;
    this.hideSingleSelection = true;
    this.hideCaption = false;
    this.hideSearch = false;

    this.showAdvancedSearch = true;
    this._actions = [];
    this._addActions = [];
    this.selectedRows = [];
    this.isFiltersVisible = false;
    this.advancedSearchTopic = null;
    this.showExcelFilters = false;
    this.excelFilterFields = [];

    this.hideAddButton = false;
    this.count = false;
    this.faUp = faArrowAltCircleUp;
    this.faDown = faArrowDown;
    this.faTableCellsLarge = faTableCellsLarge;
    this.faPlus = faPlus;
    this.faMagnifyingGlass = faMagnifyingGlass;
    this.faFilter = faFilter;
    this.faArrowDownWideShort = faArrowDownWideShort;

    this.sort = new EventEmitter();
    this.add = new EventEmitter();
    this.page = new EventEmitter();
    this.rows = new EventEmitter();
    this.dblClick = new EventEmitter();
    this.search = new EventEmitter();

    this.select = new EventEmitter();
    this.reorder = new EventEmitter();
    this.newButtonLabel = this._translateService.translate('common.table.new');
  }

  public onSort(event: any) {
    if (!event.field || !event.order || event.field === '_defaultSortOrder') {
      this.sort.emit(null);
      return;
    }

    const sortStrategy = this.columns.find(
      (column) => column!.field === event.field
    )?.sortStrategy;
    if (sortStrategy) {
      this.sort.emit(sortStrategy(event.field, event.order < 0));
      return;
    }

    this.sort.emit([
      {
        field: event.field,
        desc: event.order < 0,
      },
    ]);
  }

  public emitAddEvent() {
    this.add.emit();
  }

  public goToStart() {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }

  public toggleFilters() {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  public getCellTemplate(
    field: string
  ): TemplateRef<CellTemplateContext> | undefined {
    return this._tableCellDirectives?.find(
      (cellDirective) => cellDirective.field === field
    )?.template;
  }

  public onPaginatorChange(pageState: {
    first?: number;
    rows?: number;
    page?: number;
    pageCount?: number;
  }) {
    if (pageState.rows === this.itemsPerPage) {
      this.currentPage = (pageState.page ?? 0) + 1;
      this.page.emit({ page: this.currentPage, itemsPerPage: pageState.rows });
    } else {
      this.rows.emit(pageState.rows);
      this.itemsPerPage = pageState.rows!;
      this.currentPage = DEFAULT_PAGINATION_PAGE;
    }
  }

  public onLoadMoreClick() {
    this.currentPage++;
    this.page.emit({page: this.currentPage, itemsPerPage: this.itemsPerPage});
  }

  public getRowClass(item: any) {
    const rowClass = this._evalRowClass(item);

    if (!this.hideSelection && !(this.selectedRows instanceof Event)) {
      return `${rowClass ?? ''} ${
        this.selectedRows !== null && this.selectedRows?.includes(item)
          ? 'highlighted'
          : ''
      }`;
    }

    if(this.dblClick.observed) {
      return `${rowClass ?? ''} clickable`
    }

    return rowClass;
  }

  private _evalRowClass(item: any) {
    if (!this.rowClass) {
      return null;
    }

    if (typeof this.rowClass === 'string') {
      return this.rowClass;
    }

    return this.rowClass(item);
  }

  public parseWidth(column: GenericTableColumn, isMinWidth?: boolean): string {
    if (
      isMinWidth !== undefined &&
      ((isMinWidth && column!.shrink) || (!isMinWidth && !column!.shrink))
    ) {
      return 'auto';
    }

    if (column!.width === undefined || column!.width === null) {
      return 'auto';
    }

    if (typeof column!.width === 'number') {
      return `${column!.width}px`;
    }

    return column!.width.endsWith('px') ? column!.width : `${column!.width}px`;
  }

  public onRowDblClick(item: any) {
    this.dblClick.emit(item);
  }

  private _updatePaginatorLimits() {
    // this.paginatorStart = Math.max(
    //   this.totalItems === 0 ? 0 : 1,
    //   (this.currentPage - 1) * this.itemsPerPage
    // );
    // this.paginatorEnd = Math.min(
    //   this.currentPage * this.itemsPerPage,
    //   this.totalItems
    // );
    this.paginatorStart = 1;
    this.paginatorEnd = Math.min(this._items.length, this.totalItems);
  }

  public onSearch() {
    this._emitSearchEvent();
  }

  public onApplyFilters() {
    this._emitSearchEvent();
  }

  public onUpdateFilters(
    filters: { fieldName: string; value: string }[] | undefined
  ) {
    // this._appliedFirstLevelFilters = filters;
  }

  public onCleanFilters() {
    this.searchText = undefined;
    // this._appliedFirstLevelFilters = undefined;
    this._emitSearchEvent();
  }

  private _emitSearchEvent() {
    this.search.emit({
      searchText: this.searchText,
      // filters: this._appliedFirstLevelFilters,
    });
  }

  public onSelectAllInputChange(checked: boolean) {
    if (checked) {
      this.selectedRows = this._items;
    } else {
      this.selectedRows = [];
    }
    this._emitSelectEvent();
  }

  public onRowSelectInputChange(event: {
    checked?: any[];
    originalEvent?: Event;
  }) {
    event.originalEvent?.stopPropagation();
    if (event.checked && event.checked.length > 0) {
      this.selectedRows = event.checked;
    } else {
      this.selectedRows = [];
    }
    this._emitSelectEvent();
  }

  private _emitSelectEvent() {
    if (!this.hideSelection) {
      this.select.emit(this.selectedRows ?? []);
      return;
    }

    if (!this.hideSingleSelection) {
      this.select.emit(this.selectedElement);
    }
  }

  public get noMoreItemsToLoad() {
    if (!this._items) {
      return true;
    }
    return this._totalItems <= this._items.length;
  }

  public onSelectionChange(event: any) {
    this.selectedElement = event;

    this._emitSelectEvent();
  }

  public onRowClick(event: MouseEvent, item: any) {
    // Ignore click if is from a button
    if (
      !event.target ||
      Array.from<string>((event.target as HTMLElement).classList).some(
        (className) => className.includes('p-button')
      )
    ) {
      return;
    }

    if (!this.hideSingleSelection) {
      this.selectedElement = item;
      this._emitSelectEvent();
    }

    if (!this.hideSelection) {
      if (this.selectedRows && this.selectedRows.includes(item)) {
        this.selectedRows = this.selectedRows.filter(
          (r) => r !== this.getSelectionItem(item)
        );
      } else if (this.selectedRows) {
        this.selectedRows = [...this.selectedRows, item];
      } else {
        this.selectedRows = [item];
      }
      this._emitSelectEvent();
    }
  }

  public get selection() {
    if (!this.hideSelection) {
      return this.selectedRows ?? [];
    }

    if (!this.hideSingleSelection) {
      return [this.selectedElement];
    }

    return [];
  }

  public set selection(value: any[]) {
    if (!this.hideSelection) {
      this.selectedRows = value;
    }

    if (!this.hideSingleSelection) {
      this.selectedElement = value.length > 0 ? value[0] : null;
    }
  }

  public getSelectionItem(item: any) {
    if (this.selectionIndex) {
      return item[this.selectionIndex];
    }
    return item;
  }

  public onRowReorder(event: TableRowReorderEvent) {
    this.reorder.emit({
      oldIndex: event.dragIndex,
      newIndex: event.dropIndex,
    });
  }
}
