import type { IDatabase } from "./interfaces/IDatabase.js";

export class ConectionDB {
  private static instance: ConectionDB;

  constructor(private conectionDB: IDatabase) {}

  public static getInstance(conectionDB: IDatabase): ConectionDB {
    if (!ConectionDB.instance) {
      ConectionDB.instance = new ConectionDB(conectionDB);
    }
    return ConectionDB.instance;
  }

  public async connect(): Promise<void> {
    await this.conectionDB.connect();
  }
  public async disconnect(): Promise<void> {
    await this.conectionDB.disconnect();
  }
}
