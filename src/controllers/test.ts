import { TestModel } from '#models';
import { mongoose } from '#shared/mongoose';

export const testCtr = {
    get: async (req, args) => {
        return mongoose.findOne(TestModel, args);
    },
    set: async (req, { id, name }) => {
        return mongoose.update(
            TestModel,
            { id },
            {
                name,
            },
        );
    },
};
