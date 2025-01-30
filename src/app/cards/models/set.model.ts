export class SetModel {
  id: string;
  code: string;
  name: string;
  ctId: number;
  ctGameId: number;
  setGroup: string;
  createdAt: Date;
  createdBy: string;

  constructor(
    id: string,
    code: string,
    name: string,
    ctId: number,
    ctGameId: number,
    setGroup: string,
    createdAt: string | Date,
    createdBy: string,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.ctId = ctId;
    this.ctGameId = ctGameId;
    this.setGroup = setGroup;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.createdBy = createdBy;
  }
}
