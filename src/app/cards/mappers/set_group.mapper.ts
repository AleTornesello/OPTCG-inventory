import {SetEntity} from "../entities/set.entity";
import {SetModel} from "../models/set.model";
import {SetGroupEntity} from "../entities/set_group.entity";
import {SetGroupModel} from "../models/set_group.models";

export class SetGroupMapper {

  public static toSetGroupModel(setGroup: SetGroupEntity): SetGroupModel {
    return new SetGroupModel(
      setGroup.id,
      setGroup.name,
      setGroup.created_at,
      setGroup.updated_at
    );
  }

  public static toSetGroupEntity(setGroup: SetGroupModel): SetGroupEntity {
    return new SetGroupEntity(
      setGroup.id,
      setGroup.name,
      setGroup.createdAt.toISOString(),
      setGroup.updatedAt.toISOString()
    );
  }
}
