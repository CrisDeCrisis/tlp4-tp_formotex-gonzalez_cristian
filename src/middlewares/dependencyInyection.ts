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

  registerInstance<T>(token: string, instance: T): void {
    this.instances.set(token, instance);
  }

  resolve<T>(token: string): T {
    if (this.singletons.has(token)) {
      const singletonClass = this.singletons.get(token);
      if (!this.instances.has(token)) {
        this.instances.set(token, new singletonClass());
      }
      return this.instances.get(token);
    }

    if (this.instances.has(token)) {
      const value = this.instances.get(token);
      return typeof value === "function" ? new value() : value;
    }

    throw new Error(`Dependencia ${token} no encontrada`);
  }

  has(token: string): boolean {
    return this.instances.has(token) || this.singletons.has(token);
  }

  clear(): void {
    this.instances.clear();
    this.singletons.clear();
  }
}

export const container = new DIContainer();
