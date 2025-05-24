import "reflect-metadata"
import { DataSource } from "typeorm"
import {Product} from "./entity/product";
import {Category} from "./entity/category";
import {Sale} from "./entity/sale";
import {InventoryChange} from "./entity/inventory-change";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "forsit",
    synchronize: true,
    logging: false,
    entities: [Product, Category, Sale, InventoryChange],
    migrations: [],
    subscribers: [],
})
