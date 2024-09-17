export class SetModel {
  id: string;
  code: string;
  name: string;
  ctId: number;
  ctGameId: number;
  createdAt: Date;
  createdBy: string;

  constructor(
    id: string,
    code: string,
    name: string,
    ctId: number,
    ctGameId: number,
    createdAt: string | Date,
    createdBy: string,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.ctId = ctId;
    this.ctGameId = ctGameId;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.createdBy = createdBy;
  }
}
