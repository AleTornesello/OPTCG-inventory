export interface EntityId {
  id: string;
}

export interface EntityCreationInfo {
  created_at: string;
  created_by: string;
}

export interface EntityUpdateInfo {
  updated_at: string | null;
  updated_by: string | null;
}

export class BaseEntity implements EntityId, EntityCreationInfo, EntityUpdateInfo {
  id: string;
  created_at: string;
  created_by: string;
  updated_at: string | null;
  updated_by: string | null;

  constructor(id: string, created_at: string, created_by: string, updated_at: string | null, updated_by: string | null) {
    this.id = id;
    this.created_at = created_at;
    this.created_by = created_by;
    this.updated_at = updated_at;
    this.updated_by = updated_by;
  }
}
