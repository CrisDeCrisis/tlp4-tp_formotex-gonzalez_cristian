// Crea una interface para la conexión a la base de datos
export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
