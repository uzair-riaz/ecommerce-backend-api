import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "./entity/category";
import { InventoryChange } from "./entity/inventory-change";
import { Product } from "./entity/product";
import { Sale } from "./entity/sale";

// Load environment variables
require('dotenv').config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_DATABASE || "forsit",
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    entities: [Product, Category, Sale, InventoryChange],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
    charset: "utf8mb4",
    timezone: "Z"
})
