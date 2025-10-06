import { ConectionDB } from "./ConectionDB.js";
import MongoConfig from "../configs/mongo.config.js";
import { UserModel } from "../user/models/userModel.js";
import { UserRole } from "../user/models/userModel.js";
import bcrypt from "bcrypt";
import envs from "../configs/envs.config.js";

/**
 * Script de seed para crear el usuario SUPER_ADMIN inicial
 * Este usuario tendrá permisos completos sobre el sistema
 */
export async function seedSuperAdmin() {
  try {
    // Conectar a la base de datos
    await ConectionDB.getInstance(new MongoConfig()).connect();
    console.log("✅ Conectado a la base de datos");

    // Verificar si ya existe un super administrador
    const existingSuperAdmin = await UserModel.findOne({
      role: UserRole.SUPER_ADMIN,
    });

    if (existingSuperAdmin) {
      console.log("⚠️  Ya existe un usuario SUPER_ADMIN en la base de datos");
      console.log(`📧 Email: ${existingSuperAdmin.email}`);
      return;
    }

    // Datos del super administrador
    const superAdminData = {
      name: envs.SUPER_ADMIN_NAME,
      email: envs.SUPER_ADMIN_EMAIL,
      password: await bcrypt.hash(envs.SUPER_ADMIN_PASSWORD!, 10),
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    };

    // Crear el super administrador
    const superAdmin = await UserModel.create(superAdminData);

    console.log("\n🎉 Super Administrador creado exitosamente!");
    console.log("═".repeat(50));
    console.log(`👤 Nombre: ${superAdmin.name}`);
    console.log(`📧 Email: ${superAdmin.email}`);
    console.log(`🔐 Contraseña: ${envs.SUPER_ADMIN_PASSWORD}`);
    console.log(`🎖️  Rol: ${superAdmin.role}`);
    console.log("═".repeat(50));
    console.log(
      "\n⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro"
    );
    console.log(
      "⚠️  Se recomienda cambiar la contraseña después del primer login\n"
    );
  } catch (error) {
    console.error("❌ Error al crear super administrador:", error);
    throw error;
  } finally {
    // Cerrar conexión a la base de datos
    await ConectionDB.getInstance(new MongoConfig()).disconnect();
    console.log("✅ Conexión a la base de datos cerrada");
  }
}

// Ejecutar seed directamente
seedSuperAdmin()
  .then(() => {
    console.log("✅ Seed completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  });
