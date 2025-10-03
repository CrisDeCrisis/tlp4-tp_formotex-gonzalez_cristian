import type { CreateUserDto } from "../DTOs/userDTO.js";

//TODO: Importar User desde el modelo correspondiente

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(id: string, userData: Partial<CreateUserDto>): Promise<User>;
  delete(id: string): Promise<void>;
}
