import { UserRole } from "../models/userModel.js";

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public role: UserRole = UserRole.USER,
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  public static create(
    name: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER
  ): {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      name,
      email,
      password,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  public static fromDatabase(
    id: string,
    name: string,
    email: string,
    password: string,
    role: UserRole,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date
  ): User {
    return new User(
      id,
      name,
      email,
      password,
      role,
      isActive,
      createdAt,
      updatedAt
    );
  }

  public update(data: Partial<User>): void {
    if (data.name !== undefined) this.name = data.name;
    if (data.email !== undefined) this.email = data.email;
    if (data.password !== undefined) this.password = data.password;
    if (data.role !== undefined) this.role = data.role;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  public changeRole(newRole: UserRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  public toJSON(): Partial<User> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
