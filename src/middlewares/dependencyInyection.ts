// core/dependency-injection.ts
type Constructor<T = any> = new (...args: any[]) => T;

class DIContainer {
  private instances = new Map<string, any>();
  private singletons = new Map<string, any>();

  register<T>(token: string, classRef: Constructor<T>): void {
    this.instances.set(token, classRef);
  }

  registerSingleton<T>(token: string, classRef: Constructor<T>): void {
    this.singletons.set(token, classRef);
  }

  resolve<T>(token: string): T {
    // Si es un singleton, retornar la instancia existente o crear una nueva
    if (this.singletons.has(token)) {
      const singletonClass = this.singletons.get(token);
      if (!this.instances.has(token)) {
        this.instances.set(token, new singletonClass());
      }
      return this.instances.get(token);
    }

    // Si es una clase normal, crear nueva instancia
    if (this.instances.has(token)) {
      const classRef = this.instances.get(token);
      return new classRef();
    }

    throw new Error(`Dependencia ${token} no encontrada`);
  }
}

export const container = new DIContainer();
