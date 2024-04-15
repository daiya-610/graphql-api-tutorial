const { ApolloServer, gql } = require("apollo-server");

const books = [
    {
        title: "吾輩は猫である",
        author: "夏目漱石",
    },
    {
        title: "走れメロス",
        author: "太宰治",
    },
];

/**型の定義
 * Book型を定義
 * この型をもとにクエリの処理（問い合わせ）していく
 * Book型がリストで入っていく
 */
const typeDefs = gql`
    type Book {
        title: String
        author: String
    }

    type Query {
        test: [Book]
    }
`;

/**クエリが叩かれた場合どんな値を返すのか
 * ↑Queryのtestが実行されたらどんな値を返すか
 * test：キー
 * 値：無名関数のbooksを返す
 */
const resolvers = {
    Query: {
        test: () => books,
    },
};

/**2つの引数
 * 第一引数：型の定義を入れる
 * 第二引数：resolverを入れる
 */
const server = new ApolloServer({ typeDefs, resolvers });

/**ローカルサーバーを見ていく
 * url：ローカルサーバーのポート番号が入る
 */
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});