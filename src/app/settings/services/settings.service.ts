import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {UserSettingsEntity} from "../entities/user-settings.entity";
import {UserSettingsMapper} from "../mappers/user-settings.mapper";
import {UserSettingsKey, UserSettingsModel, UserSettingsValue} from "../models/user-settings.model";
import {InventoryEntity} from "../../cards/entities/inventory.entity";
import {InventoryMapper} from "../../cards/mappers/inventory.mapper";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor(
    private _supabaseService: SupabaseService
  ) {
  }

  public async getUserSettingsList() {
    let query = this._supabaseService.supabase
      .from('user_settings')
      .select();

    const {data, error} = await query.returns<UserSettingsEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((setting) => UserSettingsMapper.toUserSettingsModel(setting));
  }

  public async upsertUserSettingValue(setting: UserSettingsModel | undefined, key: UserSettingsKey, value: UserSettingsValue) {
    const {data, error} =  await this._supabaseService.supabase
      .from('user_settings')
      .upsert(
        {id: setting?.id, value, key: key},
        {
          onConflict: 'id',
          ignoreDuplicates: false
        })
      .select()
      .returns<UserSettingsEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((setting) => UserSettingsMapper.toUserSettingsModel(setting));
  }
}
