export class ReqUserModel {
  id: string = null;

  name: string = null;

  token: string = null;

  constructor(id?: string, name?: string, token?: string) {
    this.id = id;
    this.name = name;
    this.token = token;
  }
}
