import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {SetEntity} from "../entities/set.entity";
import {SetMapper} from "../mappers/set.mapper";
import {SetGroupEntity} from "../entities/set_group.entity";
import {SetGroupMapper} from "../mappers/set_group.mapper";

@Injectable({
  providedIn: 'root'
})
export class SetsService {

  constructor(
    private _supabaseService: SupabaseService,
  ) {
  }

  public async getSetsList() {
    let query = this._supabaseService.supabase
      .from('sets')
      .select()
      .order("name", {ascending: true});

    const {data, error} = await query.returns<SetEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((set) => SetMapper.toSetModel(set));
  }

  public async getSetGroupsList() {
    let query = this._supabaseService.supabase
      .from('set_groups')
      .select()
      .order("name", {ascending: true});

    const {data, error} = await query.returns<SetGroupEntity[]>();

    if (error) {
      throw error;
    }

    return data.map((setGroup) => SetGroupMapper.toSetGroupModel(setGroup));
  }
}
