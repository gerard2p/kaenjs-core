import * as inflector from 'inflection';
import { configuration } from './configuration';
/* istanbul ignore next */
let { inflections:{ plural = [],singular = []} = {} } = configuration;
for (const inflect in singular) {
    //@ts-ignore
	inflector.singularize(...inflect);
}
for (const inflect in plural) {
    //@ts-ignore
	inflector.pluralize(...inflect);
}
export { inflector }
