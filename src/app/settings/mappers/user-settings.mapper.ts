import {UserSettingsKey, UserSettingsModel} from "../models/user-settings.model";
import {UserSettingsEntity} from "../entities/user-settings.entity";

export class UserSettingsMapper {

  public static toUserSettingsModel(entity: UserSettingsEntity): UserSettingsModel {
    return new UserSettingsModel(
      entity.id,
      UserSettingsKey[entity.key as keyof typeof UserSettingsKey],
      entity.value,
      entity.meta,
      entity.created_at,
      entity.created_by
    );
  }

  public static toUserSettingsEntity(model: UserSettingsModel): UserSettingsEntity {
    return new UserSettingsEntity(
      model.id,
      model.key,
      model.value,
      model.meta,
      model.createdAt.toISOString(),
      model.createdBy
    );
  }
}
