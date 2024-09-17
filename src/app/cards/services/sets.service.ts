import {Injectable} from '@angular/core';
import {SupabaseService} from "../../shared/services/supabase.service";
import {SetEntity} from "../entities/set.entity";
import {SetMapper} from "../mappers/set.mapper";

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
}
