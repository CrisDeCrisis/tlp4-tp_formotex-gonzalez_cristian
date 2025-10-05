import type {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  UserListResponseDto,
} from "./DTOs/userDTO.js";
import type { IUserRepository } from "./repositories/UserRepository.js";
import bcrypt from "bcrypt";

export interface IUserService {
  createUser(userData: CreateUserDto): Promise<UserResponseDto>;
  getUserById(id: string): Promise<UserResponseDto | null>;
  getUserByEmail(email: string): Promise<UserResponseDto | null>;
  getAllUsers(page?: number, limit?: number): Promise<UserListResponseDto>;
  updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<UserResponseDto | null>;
  deleteUser(id: string): Promise<boolean>;
  deactivateUser(id: string): Promise<UserResponseDto | null>;
  activateUser(id: string): Promise<UserResponseDto | null>;
  validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserResponseDto | null>;
}

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  private mapToResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(userData: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.userRepository.findByEmail(
        userData.email
      );
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      if (userData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
      });

      return this.mapToResponse(newUser);
    } catch (error) {
      throw new Error(`Error al crear usuario: ${error}`);
    }
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) return null;
      return this.mapToResponse(user);
    } catch (error) {
      throw new Error(`Error al obtener usuario: ${error}`);
    }
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new Error("Usuario no encontrado");

      return this.mapToResponse(user);
    } catch (error) {
      throw new Error(`Error al obtener usuario por email: ${error}`);
    }
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<UserListResponseDto> {
    try {
      const users = await this.userRepository.findAll(page, limit);
      const total = await this.userRepository.count();

      return {
        users: users.map((user) => this.mapToResponse(user)),
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new Error(`Error al obtener usuarios: ${error}`);
    }
  }

  async updateUser(
    id: string,
    userData: UpdateUserDto
  ): Promise<UserResponseDto | null> {
    try {
      if (userData.password) {
        if (userData.password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      if (userData.email) {
        const existingUser = await this.userRepository.findByEmail(
          userData.email
        );
        if (existingUser && existingUser.id !== id) {
          throw new Error("El email ya está registrado por otro usuario");
        }
      }

      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) return null;
      return this.mapToResponse(updatedUser);
    } catch (error) {
      throw new Error(`Error al actualizar usuario: ${error}`);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      return await this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`Error al eliminar usuario: ${error}`);
    }
  }

  async deactivateUser(id: string): Promise<UserResponseDto | null> {
    try {
      const updatedUser = await this.userRepository.update(id, {
        isActive: false,
      });
      if (!updatedUser) return null;
      return this.mapToResponse(updatedUser);
    } catch (error) {
      throw new Error(`Error al desactivar usuario: ${error}`);
    }
  }

  async activateUser(id: string): Promise<UserResponseDto | null> {
    try {
      const updatedUser = await this.userRepository.update(id, {
        isActive: true,
      });
      if (!updatedUser) return null;
      return this.mapToResponse(updatedUser);
    } catch (error) {
      throw new Error(`Error al activar usuario: ${error}`);
    }
  }

  async validateUserCredentials(
    email: string,
    password: string
  ): Promise<UserResponseDto | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) return null;

      if (!user.isActive) return null;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return null;

      return this.mapToResponse(user);
    } catch (error) {
      throw new Error(`Error al validar credenciales: ${error}`);
    }
  }
}
