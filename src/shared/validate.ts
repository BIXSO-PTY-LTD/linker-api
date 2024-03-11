export const validate = {
    common: {
        isEmpty(value) {
            if (value === null || value === undefined) {
                return true;
            }

            if (Array.isArray(value) && value.length === 0) {
                return true;
            }

            if (typeof value === 'object') {
                if (value instanceof Date) {
                    return false;
                }

                if (Object.keys(value).length === 0) {
                    return true;
                }
            }

            if (typeof value === 'string' && value.trim().length === 0) {
                return true;
            }

            return false;
        },
        isEmptyValidator() {
            return async function (this, value) {
                return !validate.common.isEmpty(value);
            };
        },
        isUniqueValidator(fields: string[]) {
            return async function (this, value) {
                const existingDocument = await this.constructor.findOne({
                    $or: fields.map((field) => ({
                        [field]: value,
                    })),
                });

                return !existingDocument;
            };
        },
    },
};
