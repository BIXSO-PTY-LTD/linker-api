import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers, TypeSource } from '@graphql-tools/utils';
import { DocumentNode, GraphQLScalarType } from 'graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';
import path from 'path';

type ResolverObject = Record<string, Record<string, GraphQLScalarType>>;

const typesArray: TypeSource = loadFilesSync<string>(path.join(__dirname, './types'), {
    extensions: ['graphql'],
    recursive: true,
});

const resolversArray: IResolvers[] = loadFilesSync<ResolverObject>(path.join(__dirname, './resolvers'), {
    extensions: ['js', 'ts'],
    recursive: true,
});

const allTypes: DocumentNode = mergeTypeDefs(typesArray);
export const allResolvers: IResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({
    typeDefs: allTypes,
    resolvers: {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
        ...allResolvers,
    },
});

export default schema;
