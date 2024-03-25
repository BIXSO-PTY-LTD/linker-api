import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { IResolvers, TypeSource } from '@graphql-tools/utils';
import { DocumentNode, GraphQLScalarType } from 'graphql';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars';

type T_ResolverObject = Record<string, Record<string, GraphQLScalarType>>;

const typesArray: TypeSource = loadFilesSync<string>('src/**/*.graphql', {
    recursive: true,
});

const resolversArray: IResolvers[] = loadFilesSync<T_ResolverObject>('src/**/*.resolver.{js,ts}', {
    recursive: true,
});

const allTypes: DocumentNode = mergeTypeDefs(typesArray);
const allResolvers: IResolvers = mergeResolvers(resolversArray);

const schema = makeExecutableSchema({
    typeDefs: allTypes,
    resolvers: {
        JSON: GraphQLJSON,
        DateTime: GraphQLDateTime,
        ...allResolvers,
    },
});

export default schema;
