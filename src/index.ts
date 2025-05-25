import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import 'reflect-metadata';
import { AppDataSource } from "./data-source";
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

AppDataSource.initialize().catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
});

app.use(helmet());

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});