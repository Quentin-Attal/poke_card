import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";

import axios from "axios";
import { Pagination, Skeleton } from "@mui/material";

import styles from "../../styles/pokemon.module.css";
import type { ApiResponse, PokemonResult } from "../../type";
import Head from "next/head";
import HeaderPageHome from "../../components/headerHome";
import Pokemon from "../../components/pokemon";

export async function getStaticProps() {
  const { data }: ApiResponse = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1200");

  return {
    props: {
      pokemon: data.results
    }
  };
}

export default function Home({ pokemon }: { pokemon: PokemonResult[] }) {

  const [page, setPage] = useState(0);
  const [key, setKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [pokemonList, setPokemonList] = useState<PokemonResult[]>(pokemon);
  const [pokemonPaginate, setPokemonPaginate] = useState<PokemonResult[]>([]);

  const router = useRouter();
  const rowSkeletons = Array.from({ length: 30 }, (_, i) => i);

  const handlePaginationChange = (e: ChangeEvent<unknown>, value: number) => {
    if (search.length > 0) {
      router.push(`?search=${search}&page=${value}`, undefined, { shallow: true });
    } else {
      router.push(`?page=${value}`, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    if (pokemonList && page > 0) {
      setPokemonPaginate(pokemonList.slice((page - 1) * 30, page * 30));
      setKey(new Date().getTime());
      setLoading(false);
    }
  }, [pokemonList, page]);

  useEffect(() => {
    if (router.isReady && pokemonList) {
      if (router.query.page && page !== Number(router.query.page)) {
        setPage(parseInt(router.query.page as string));
      } else if (!router.query.page) {
        setPage(1);
      }
      if (router.query.search && search !== router.query.search) {
        const newSearch = router.query.search as string;
        const searchPokemon = pokemon.filter(res => res.name.toLowerCase().includes(newSearch.toLowerCase()));
        setPokemonList(searchPokemon);
        setSearch(router.query.search as string);
      } else if (!router.query.search) {
        setSearch("");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.page, router.query.search, router.isReady]);

  const handleSearchSubmit = () => {
    if (search.length > 0) {
      const searchPokemon = pokemon.filter(res => res.name.toLowerCase().includes(search.toLowerCase()));
      setPokemonList(searchPokemon);
      router.push(`?search=${search}&page=1`, undefined, { shallow: true });
    } else {
      setPokemonList(pokemon);
      router.push(`?page=1`, undefined, { shallow: true });
    }
    setPage(1);
  }


  if (loading) {
    return <div className={styles.root}>
      <Head>
        <title>Pokedex</title>
      </Head>
      <HeaderPageHome
        search={search}
        setSearch={setSearch}
        handleSearchSubmit={handleSearchSubmit}
      />
      {rowSkeletons.map((item, index) => (
        <div key={"preload" + index} className={styles.card}>
          <div className={styles.inside_card}>
            <div className={styles.inside_card}>
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </div>
            <Skeleton variant="text" width={"100%"} height={"20%"} />
          </div>
        </div>
      ))}
      <Pagination
        count={30}
        variant="outlined"
        shape="rounded"
        color="primary"
        className={styles.pagination}
        onChange={handlePaginationChange}
        page={page}
      />
    </div>
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>Pokedex</title>
      </Head>
      <HeaderPageHome
        search={search}
        setSearch={setSearch}
        handleSearchSubmit={handleSearchSubmit}
      />

      {pokemonPaginate.length > 0 ? pokemonPaginate.map(({ name, url }, index) => (
        <Pokemon
          entry_number={parseInt(url.split("/")[6])}
          name={name}
          keyValue={key}
          key={index} />
      )) :
        <h3 style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
          gridColumn: "1 / -1"
        }}>No results</h3>}
      <Pagination
        count={Math.floor(pokemonList.length / 30) + 1}
        variant="outlined"
        shape="rounded"
        color="primary"
        className={styles.pagination}
        onChange={handlePaginationChange}
        page={page}
      />
    </div>
  );
}
