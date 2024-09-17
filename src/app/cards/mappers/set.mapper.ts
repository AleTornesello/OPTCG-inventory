import {SetEntity} from "../entities/set.entity";
import {SetModel} from "../models/set.model";

export class SetMapper {

  public static toSetModel(set: SetEntity): SetModel {
    return new SetModel(
      set.id,
      set.code,
      set.name,
      set.ct_id,
      set.ct_game_id,
      set.created_at,
      set.created_by
    );
  }

  public static toSetEntity(set: SetModel): SetEntity {
    return new SetEntity(
      set.id,
      set.code,
      set.name,
      set.ctId,
      set.ctGameId,
      set.createdAt.toISOString(),
      set.createdBy
    );
  }
}
