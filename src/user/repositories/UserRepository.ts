import type { CreateUserDto, UpdateUserDto } from "../DTOs/userDTO.js";
import { User } from "../entities/userEntity.js";
import { UserModel, type IUser, UserRole } from "../models/userModel.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(page?: number, limit?: number): Promise<User[]>;
  update(id: string, userData: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}

export class UserRepository implements IUserRepository {
  private mapToEntity(userDoc: IUser & { _id: any }): User {
    return User.fromDatabase(
      userDoc._id.toString(),
      userDoc.name,
      userDoc.email,
      userDoc.password,
      userDoc.role,
      userDoc.isActive,
      userDoc.createdAt,
      userDoc.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ email }).select("+password");
      if (!userDoc) return null;
      return this.mapToEntity(userDoc);
    } catch (error) {
      throw new Error(`Error al buscar usuario por email: ${error}`);
    }
  }

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const newUserDoc = await UserModel.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || UserRole.USER,
      });
      const savedUserDoc = await UserModel.findById(newUserDoc._id).select(
        "+password"
      );
      if (!savedUserDoc) {
        throw new Error("Error al crear el usuario");
      }
      return this.mapToEntity(savedUserDoc);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findById(id);
      if (!userDoc) return null;
      return this.mapToEntity(userDoc);
    } catch (error) {
      throw new Error(`Error al buscar usuario por ID: ${error}`);
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    try {
      const skip = (page - 1) * limit;
      const userDocs = await UserModel.find().skip(skip).limit(limit);
      return userDocs.map((doc) => this.mapToEntity(doc));
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error}`);
    }
  }

  async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      );

      if (!userDoc) return null;

      if (userData.password) {
        const userWithPassword = await UserModel.findById(id).select(
          "+password"
        );
        if (!userWithPassword) return null;
        return this.mapToEntity(userWithPassword);
      }

      return this.mapToEntity(userDoc);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }

  async count(): Promise<number> {
    try {
      return await UserModel.countDocuments();
    } catch (error) {
      throw new Error(`Error al contar usuarios: ${error}`);
    }
  }
}
