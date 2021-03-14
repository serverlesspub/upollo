
import {join} from 'path';
module.exports = () => {
	require('dotenv').config({path: join(__dirname, '..', '.env.integration')});
  process.env.AWS_SDK_LOAD_CONFIG = '1';
};
