import { initData } from '../initData/testScript';
import app from './config/app'
import { PROCESS_ENV } from './const';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

initData()

app.listen(PROCESS_ENV.PORT, () => {
  return console.log(`Express is listening at port:${PROCESS_ENV.PORT}`);
});