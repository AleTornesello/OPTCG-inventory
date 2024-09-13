export interface ModelId {
  id: string;
}

export interface ModelCreationInfo {
  createdAt: Date;
  createdBy: string;
}

export interface ModelUpdateInfo {
  updatedAt: Date | null;
  updatedBy: string | null;
}

export class BaseModel implements ModelId, ModelCreationInfo, ModelUpdateInfo {
  id: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date | null;
  updatedBy: string | null;

  constructor(id: string, createdAt: Date, createdBy: string, updatedAt: Date | null, updatedBy: string | null) {
    this.id = id;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }
}
