import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from "./data-source";

AppDataSource.initialize().catch(error => console.log(error));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});