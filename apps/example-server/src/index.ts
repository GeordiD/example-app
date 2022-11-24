import './common/env';
import Server from './common/server';

const port = parseInt(process.env.PORT ?? '3030');
export default new Server().listen(port);
