import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../../services/settings.service";
import {
  DefaultUserSettingsValue,
  UserSettingsKey,
  UserSettingsModel,
  UserSettingsValue,
  UserSettingsValueSingleNumber
} from "../../models/user-settings.model";
import {TranslocoPipe} from "@jsverse/transloco";
import {InputTextComponent} from "../../../shared/components/inputs/input-text/input-text.component";
import {InputNumberComponent} from "../../../shared/components/inputs/input-number/input-number.component";

@Component({
  selector: 'app-user-settings-page',
  standalone: true,
  imports: [
    TranslocoPipe,
    InputTextComponent,
    InputNumberComponent
  ],
  templateUrl: './user-settings-page.component.html',
  styleUrl: './user-settings-page.component.scss'
})
export class UserSettingsPageComponent implements OnInit {

  public settings: UserSettingsModel[];

  constructor(
    private _settingsService: SettingsService
  ) {
    this.settings = [];
  }

  public async ngOnInit() {
    this.settings = await this._settingsService.getUserSettingsList();
  }

  public getMinLeaderCardAmount() {
    const value = this._getMinCardAmount(UserSettingsKey.LEADER_MIN_CARD_AMOUNT);

    if (value) {
      return (value as UserSettingsValueSingleNumber).value;
    }

    return DefaultUserSettingsValue.LEADER_MIN_CARD_AMOUNT;
  }

  public getMinDonCardAmount() {
    const value = this._getMinCardAmount(UserSettingsKey.DON_MIN_CARD_AMOUNT);

    if (value) {
      return (value as UserSettingsValueSingleNumber).value;
    }

    return DefaultUserSettingsValue.DON_MIN_CARD_AMOUNT;
  }

  public getMinOtherCardAmount() {
    const value = this._getMinCardAmount(UserSettingsKey.OTHER_MIN_CARD_AMOUNT);

    if (value) {
      return (value as UserSettingsValueSingleNumber).value;
    }

    return DefaultUserSettingsValue.OTHER_MIN_CARD_AMOUNT;
  }

  private _getMinCardSetting(key: UserSettingsKey) {
    return this.settings.find(setting => setting.key === key);
  }

  private _getMinCardAmount(key: UserSettingsKey): UserSettingsValue | undefined {
    return this._getMinCardSetting(key)?.value;
  }

  public async onMinLeaderCardAmountChange(value: number | null) {
    const setting = this._getMinCardSetting(UserSettingsKey.LEADER_MIN_CARD_AMOUNT);
    if(value) {
      await this._onMinCardAmountChange(setting, UserSettingsKey.LEADER_MIN_CARD_AMOUNT, {
        value
      });
      return;
    }

    await this._onMinCardAmountChange(setting, UserSettingsKey.LEADER_MIN_CARD_AMOUNT, {
      value: DefaultUserSettingsValue.LEADER_MIN_CARD_AMOUNT
    });
  }

  public async onMinDonCardAmountChange(value: number | null) {
    const setting = this._getMinCardSetting(UserSettingsKey.DON_MIN_CARD_AMOUNT);
    if(value) {
      await this._onMinCardAmountChange(setting, UserSettingsKey.DON_MIN_CARD_AMOUNT, {
        value
      });
      return;
    }

    await this._onMinCardAmountChange(setting, UserSettingsKey.DON_MIN_CARD_AMOUNT, {
      value: DefaultUserSettingsValue.DON_MIN_CARD_AMOUNT
    });
  }

  public async onMinOtherCardAmountChange(value: number | null) {
    const setting = this._getMinCardSetting(UserSettingsKey.OTHER_MIN_CARD_AMOUNT);
    if(value) {
      await this._onMinCardAmountChange(setting, UserSettingsKey.OTHER_MIN_CARD_AMOUNT, {
        value
      });
      return;
    }

    await this._onMinCardAmountChange(setting, UserSettingsKey.OTHER_MIN_CARD_AMOUNT, {
      value: DefaultUserSettingsValue.OTHER_MIN_CARD_AMOUNT
    });
  }

  private async _onMinCardAmountChange(setting: UserSettingsModel | undefined, key: UserSettingsKey, value: UserSettingsValueSingleNumber) {
    try {
      await this._settingsService.upsertUserSettingValue(setting, key, value);
    } catch (error) {
      // TODO: handle error
      console.error(error);
    }
  }
}
