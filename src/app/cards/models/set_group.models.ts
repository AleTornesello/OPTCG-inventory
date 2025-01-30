export class SetGroupModel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    createdAt: string | Date,
    updatedAt: string | Date
  ) {
    this.id = id;
    this.name = name;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
  }
}
