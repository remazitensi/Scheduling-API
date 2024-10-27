import express from 'express';
import timetableRoutes from './routes/timetableRoutes';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', timetableRoutes);

app.listen(PORT);
