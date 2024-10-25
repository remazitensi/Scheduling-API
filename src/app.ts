import express from 'express';
import bodyParser from 'body-parser';
import timetableRoutes from './routes/timetableRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', timetableRoutes);

app.listen(PORT);
