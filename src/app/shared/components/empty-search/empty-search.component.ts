import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-empty-search',
  templateUrl: './empty-search.component.html',
  styleUrls: ['./empty-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, TranslocoModule],
})
export class EmptySearchComponent {
  public faSearch: IconDefinition;

  constructor() {
    this.faSearch = faSearch;
  }
}
