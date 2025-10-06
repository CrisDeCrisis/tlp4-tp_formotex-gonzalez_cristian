import { ConectionDB } from "./ConectionDB.js";
import MongoConfig from "../configs/mongo.config.js";
import { UserModel, UserRole } from "../user/models/userModel.js";
import { EquipmentModel } from "../equipment/models/equipment.model.js";
import {
  EquipmentStatus,
  EquipmentType,
} from "../equipment/models/equipment.model.js";
import bcrypt from "bcrypt";

async function clearDatabase() {
  console.log("🗑️  Limpiando base de datos...");
  await UserModel.deleteMany({});
  await EquipmentModel.collection.drop().catch(() => {});
  await EquipmentModel.createIndexes();
  console.log("✅ Base de datos limpiada");
}

async function seedUsers() {
  console.log("\n👥 Creando usuarios...");

  const password = await bcrypt.hash("Test123", 10);

  const users = [
    {
      name: "Super Admin",
      email: "superadmin@formotex.com",
      password,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    {
      name: "Admin Principal",
      email: "admin1@formotex.com",
      password,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      name: "Admin Secundario",
      email: "admin2@formotex.com",
      password,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      name: "Juan Pérez",
      email: "juan.perez@formotex.com",
      password,
      role: UserRole.USER,
      isActive: true,
    },
    {
      name: "María González",
      email: "maria.gonzalez@formotex.com",
      password,
      role: UserRole.USER,
      isActive: true,
    },
    {
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@formotex.com",
      password,
      role: UserRole.USER,
      isActive: true,
    },
  ];

  const createdUsers = await UserModel.insertMany(users);

  console.log("✅ Usuarios creados:");
  createdUsers.forEach((user) => {
    console.log(
      `   - ${user.role.toUpperCase()}: ${user.name} (${user.email})`
    );
  });

  return createdUsers;
}

async function seedEquipments() {
  console.log("\n💻 Creando equipos...");

  const equipments = [
    {
      name: "Laptop Dell XPS 15",
      type: EquipmentType.LAPTOP,
      brand: "Dell",
      modelName: "XPS 15 9520",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Laptop HP EliteBook",
      type: EquipmentType.LAPTOP,
      brand: "HP",
      modelName: "EliteBook 840 G9",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Laptop Lenovo ThinkPad",
      type: EquipmentType.LAPTOP,
      brand: "Lenovo",
      modelName: "ThinkPad X1 Carbon",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Monitor LG UltraWide",
      type: EquipmentType.MONITOR,
      brand: "LG",
      modelName: "34WN80C-B",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Monitor Samsung 4K",
      type: EquipmentType.MONITOR,
      brand: "Samsung",
      modelName: "LU28E590DS",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Monitor Dell UltraSharp",
      type: EquipmentType.MONITOR,
      brand: "Dell",
      modelName: "U2720Q",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Impresora HP LaserJet",
      type: EquipmentType.PRINTER,
      brand: "HP",
      modelName: "LaserJet Pro M404dn",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Impresora Epson EcoTank",
      type: EquipmentType.PRINTER,
      brand: "Epson",
      modelName: "EcoTank L3250",
      status: EquipmentStatus.AVAILABLE,
      assignmentHistory: [],
    },
    {
      name: "Laptop MacBook Pro",
      type: EquipmentType.LAPTOP,
      brand: "Apple",
      modelName: "MacBook Pro 16 M2",
      status: EquipmentStatus.MAINTENANCE,
      assignmentHistory: [],
    },
  ];

  const createdEquipments = await EquipmentModel.insertMany(equipments);

  console.log("✅ Equipos creados:");
  createdEquipments.forEach((equipment) => {
    console.log(
      `   - ${equipment.type.toUpperCase()}: ${equipment.name} (${
        equipment.status
      })`
    );
  });

  return createdEquipments;
}

export async function seedDatabase() {
  try {
    await ConectionDB.getInstance(new MongoConfig()).connect();
    console.log("✅ Conectado a la base de datos");

    await clearDatabase();
    const users = await seedUsers();
    const equipments = await seedEquipments();

    console.log("\n" + "═".repeat(60));
    console.log("🎉 SEED COMPLETADO EXITOSAMENTE");
    console.log("═".repeat(60));
    console.log(`\n� Resumen:`);
    console.log(`   - ${users.length} usuarios creados`);
    console.log(`     • 1 Super Admin`);
    console.log(`     • 2 Admins`);
    console.log(`     • 3 Usuarios regulares`);
    console.log(`   - ${equipments.length} equipos creados`);
    console.log(
      `     • ${
        equipments.filter((e) => e.type === EquipmentType.LAPTOP).length
      } Laptops`
    );
    console.log(
      `     • ${
        equipments.filter((e) => e.type === EquipmentType.MONITOR).length
      } Monitores`
    );
    console.log(
      `     • ${
        equipments.filter((e) => e.type === EquipmentType.PRINTER).length
      } Impresoras`
    );

    console.log("\n🔐 Credenciales de acceso:");
    console.log("   Email: superadmin@formotex.com");
    console.log("   Password: password123");
    console.log("\n⚠️  IMPORTANTE: Cambia las contraseñas en producción");
    console.log("═".repeat(60) + "\n");
  } catch (error) {
    console.error("❌ Error al ejecutar seed:", error);
    throw error;
  } finally {
    await ConectionDB.getInstance(new MongoConfig()).disconnect();
    console.log("✅ Conexión a la base de datos cerrada");
  }
}

seedDatabase()
  .then(() => {
    console.log("✅ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  });
