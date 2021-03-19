export class PouchdbModel {

  // tslint:disable-next-line:variable-name needed by PouchDB
  _id: string;
  // tslint:disable-next-line:variable-name needed by PouchDB
  _rev: string;

  readonly type: string;

  protected constructor(type: string) {
    this.type = type;
  }

  toPouchDb(): any {
    if (!this._id) {
      this._id = String(Date.now());
    }
    return {
      type: this.type,
      _id: this._id,
      _rev: this._rev,
    };
  }

}
