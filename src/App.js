import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  // pokeapiのURL
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [prevPageURL, setPrevPageURL] = useState("");
  const [nextPageURL, setNextPageURL] = useState("");

  useEffect(() => {
    const fetchPokemonData = async () => {
      // 全てのポケモンのデータを取得
      let res = await getAllPokemon(initialURL);

      // ポケモンの個別データを取得
      loadPokemon(res.results);

      // 前のページのURLと次のページのURLを設定
      setPrevPageURL(res.previous);
      setNextPageURL(res.next);

      setLoading(false);
    };
    fetchPokemonData();
  }, []);

  // ポケモンの個別データを取得
  const loadPokemon = async (data) => {
    let _pokemonData = await Promise.all(
      data.map(async (pokemon) => {
        let pokemonRecord = await getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  // 前のページに戻る
  const handlePrevPage = async () => {
    // 前のページのURLがない場合は処理を終了
    if (!prevPageURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevPageURL);
    // ポケモンの個別データを取得
    loadPokemon(data.results);
    // 前のページのURLと次のページのURLを設定
    setPrevPageURL(data.previous);
    setNextPageURL(data.next);
    setLoading(false);
  };

  // 次のページに移動
  const handleNextPage = async () => {
    // 次のページのURLがない場合は処理を終了
    if (!nextPageURL) return;
    setLoading(true);
    let data = await getAllPokemon(nextPageURL);
    // ポケモンの個別データを取得
    loadPokemon(data.results);
    // 前のページのURLと次のページのURLを設定
    setPrevPageURL(data.previous);
    setNextPageURL(data.next);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {/* ロード中の表示 */}
        {loading ? (
          <h1>ロード中...</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button className="btn__prev" onClick={handlePrevPage}>前へ</button>
              <button className="btn__next" onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
