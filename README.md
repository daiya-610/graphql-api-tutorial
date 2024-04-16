# GraphQL(Apollo Server), Node.js, Reactでデータの取得

## バックエンド
1\. プロジェクト作成
```
$ mkdir 〇〇 ←プロジェクト名 例)graphql-server-example
$ cd graphql-server-example
$ npm init --yes
```

2\. ライブラリのインストール
```
$ npm install apollo-server graphql
```

3\. GraphQLのスキーマの定義
```js:backend/server.js
type Book {
  title: String
  author: String
}
```

4\. データの定義
```js:backend/server.js
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
```

5\. リゾルバの定義
- apollo server側はクエリ実行時にこのデータセットを使用することを認識していない状態
- これを認識させるためにリゾルバを作成していく
- ※resolver（リゾルバ、レゾルバ）：DNSに問い合わせを行うために使用されるクライアントソフトウェアやホストのこと
```js:backend/server.js
const resolvers = {
  Query: {
    test: () => books,
  },
};
```

6\. Apolloサーバーインスタンスの作成
- スキーマ、データセット、レゾルバを定義してきたが、この情報を初期化する際にApollo Serverに知らせる必要がある
```js:backend/server.js
/**2つの引数
 * 第一引数：型の定義を入れる
 * 第二引数：を入れる
 */
const server = new ApolloServer({ typeDefs, resolvers });

/**ローカルサーバーを見ていく
 * url：ローカルサーバーのポート番号が入る
 */
server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
});
```

7\. サーバーの起動
- Apollo serverを起動
```
$ node server.js 
```
or
```
$ npm run dev
```

8\. クエリのリクエスト
- ページにアクセスするとGraphqlのデータ操作ができる
<br>http://localhost:4000/
```:sandbox
query GetBooks {
  books {
    title
    author
  }
}
```
↓↓↓ ExampleQuery実行結果
```
{
  "data": {
    "test": [
      {
        "title": "吾輩は猫である",
        "author": "夏目漱石"
      },
      {
        "title": "走れメロス",
        "author": "太宰治"
      }
    ]
  }
}
```
---
## フロントエンド
1\. Vite で React のプロジェクトを作成
```
$ npm create vite@latest
# package json に記載されるパッケージ名
? Package name: ›
# react を選択
? Select a framework: › - Use arrow-keys. Return to submit.
    vanilla
    vue
❯   react
    preact
    lit
    svelte
# TypeScript を使う場合は react-ts を選択
? Select a variant: › - Use arrow-keys. Return to submit.
    TypeScript
    TypeScript + SWC
❯   JavaScript
    JavaScript + SWC
```

2\. React のプロジェクトを起動
- 下記コマンドでローカルサーバーが起動すれば3へ
```
$ cd 〇〇 ←作成したプロジェクト名
$ npm install
$ npm run dev
```

3\. Apollo Client ライブラリを使用
```jsx:src/main.jsx
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client"; // Apollo Clientのインポート

// Apollo Clientの設定
const client = new ApolloClient({
  uri: "http://localhost:4000", // Apollo Serverの接続先を指定
  cache: new InMemoryCache(), // キャッシュを設定
});

ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictModeを使ってアプリケーションをラップし、開発中の潜在的な問題を警告する。javascriptのコードを通常より厳しくエラーチェック。
  <React.StrictMode>
    {/* ApolloProviderを使用し先ほど定義した定数clientをアプリケーションに提供します。 */}
    <ApolloProvider client={client}>
      {/* Appコンポーネントをレンダリング*/}
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
```

4\. 画面表示処理
4-1\. ライブラリのインポート、画面表示設定
```jsx:src/App.jsx
import { gql, useQuery } from "@apollo/client";

function App() {
  return (
    <div className='App'>
      <h2>GraphQL Client</h2>
      <Books /> {/* Booksコンポーネントの呼び出し。Booksという関数をこれから定義する */}
    </div>
  );
}
export default App;
```

4-2\. GraphQLクエリ・コンポーネントの定義
```jsx:src/App.jsx
// GraphQLクエリの定義
const BOOKS = gql`
query {
  test {
    title
    author
  }
}
`;

// Booksコンポーネントの定義
function Books() {
  // useQueryフックを使用してデータを取得
  const { loading, error, data } = useQuery(BOOKS);

// ローディング中はローディングメッセージを表示
  if(loading) return <p>ロード中・・・</p>;
  // エラーが発生した場合はエラーメッセージを表示
  if(error) return <p>エラー</p>;
  // データが正常に取得された場合はBOOKSのリストを表示
  return data.test.map(({ title, author }) => (
    <div key={title}>
      <p>
        {author} : {title}
      </p>
    </div>
  ));
}
```

5\. 確認
```
$ cd 〇〇 ←作成したプロジェクト名
$ npm run dev
```