import { Component } from '@angular/core';
import {CardsFilterPanelComponent} from "../../components/cards-filter-panel/cards-filter-panel.component";

@Component({
  selector: 'app-card-properties-page',
  standalone: true,
  imports: [
    CardsFilterPanelComponent
  ],
  templateUrl: './card-properties-page.component.html',
  styleUrl: './card-properties-page.component.scss'
})
export class CardPropertiesPageComponent {

}
