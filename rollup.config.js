import { config } from 'dotenv';
import replace from '@rollup/plugin-replace';

const production = !process.env.ROLLUP_WATCH;

export default {
	plugins: [
		replace({
			// stringify the object
			__weatherapp: JSON.stringify({
				env: {
					isProd: production,
					API_URL: process.env.WEATHER_BASE_URL,
					API_KEY: process.env.WEATHER_KEY,
					...config().parsed // attached the .env config
				}
			})
		})
	]
};
