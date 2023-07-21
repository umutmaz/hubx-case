
import { getSchemas } from "./schemas";


export const validationMiddleware = (schemaName, location) => (req, res, next) => {

    const schemas = getSchemas();

    const schema = schemas[schemaName] || null;
    if (!schema) {
        return res.sendStatus(500);
    }

    const { error } = schema.validate(req[location]);
    if (error) {
        return res.status(400).send(error.message);
    }

    return next();
};