import { testCtr } from '#controllers';

export default {
    Query: {
        getTest: (_, args, { req }) => testCtr.get(req, args.filters),
    },
    Mutation: {
        setTest: (_, args, { req }) => testCtr.set(req, args.user),
    },
};
