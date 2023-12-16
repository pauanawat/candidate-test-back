import { initData } from '../initData/testScript';
import app from './config/app'

const port = 80;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

initData()

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});