import { TestModel } from '#models';
import { mongooseCtr } from '#shared/mongoose';

export const testCtr = {
    get: async (req, args) => {
        return mongooseCtr.findOne(TestModel, args);
    },
    set: async (req, { id, name }) => {
        return mongooseCtr.update(
            TestModel,
            { id },
            {
                name,
            },
        );
    },
};
