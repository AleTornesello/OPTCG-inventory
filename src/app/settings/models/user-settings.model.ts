export class UserSettingsModel {
  public id: string;
  public key: UserSettingsKey;
  public value: UserSettingsValue;
  public meta: any;
  public createdAt: Date;
  public createdBy: string;

  constructor(
    id: string,
    key: UserSettingsKey,
    value: UserSettingsValue,
    meta: any,
    createdAt: Date | string,
    createdBy: string
  ) {
    this.id = id;
    this.key = key;
    this.value = value;
    this.meta = meta;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.createdBy = createdBy;
  }
}

export enum UserSettingsKey {
  LEADER_MIN_CARD_AMOUNT = "leader_min_card_amount",
  DON_MIN_CARD_AMOUNT = "don_min_card_amount",
  OTHER_MIN_CARD_AMOUNT = "other_min_card_amount"
}

export interface UserSettingsValueSingleNumber {
  value: number;
}

export interface UserSettingsValueRangeNumber {
  fromValue: number;
  toValue: number;
}

export type UserSettingsValue = UserSettingsValueSingleNumber | UserSettingsValueRangeNumber;

export enum DefaultUserSettingsValue {
  LEADER_MIN_CARD_AMOUNT = 1,
  DON_MIN_CARD_AMOUNT = 10,
  OTHER_MIN_CARD_AMOUNT = 4
}

