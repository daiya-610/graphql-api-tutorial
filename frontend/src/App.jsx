import { gql } from "@apollo/client";
import { useQuery } from '@apollo/client';
import { useState } from 'react'
import './App.css'

const BOOKS = gql`
query {
  test {
    title
    author
  }
}
`;

console.log(BOOKS);

function Books() {
  const { loading, error, data } = useQuery(BOOKS);

  if(loading) return <p>ロード中・・・</p>;
  if(error) return <p>エラー</p>;
  return data.test.map(({ title, author }) => (
    <div key={title}>
      <p>
        {author} : {title}
      </p>
    </div>
  ));
}

function App() {
  return (
    <div className='App'>
      <h2>GraphQL Client</h2>
      <Books />
    </div>
  );
}

export default App;
