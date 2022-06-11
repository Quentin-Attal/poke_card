import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Link from "next/link";
import axios from "axios";
import { Pagination, Skeleton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion"

import styles from "../pokemon.module.css";
import type { PokemonResult } from "../../type";
import Head from "next/head";
import HeaderPageHome from "../../components/headerHome";
import Pokemon from "../../components/pokemon";

export async function getStaticProps() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokedex/1/");

  return {
    props: {
      pokemon: data.pokemon_entries
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
  const [isAnimated, setIsAnimated] = useState(false);

  const router = useRouter();
  const rowSkeletons = Array.from({ length: 30 }, (_, i) => i);

  const handlePaginationChange = (e: ChangeEvent<unknown>, value: number) => {
    router.push(`?page=${value}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (pokemonList && page > 0) {
      if (pokemonPaginate.length > 0) {
        setKey(new Date().getTime());
        setPokemonPaginate(pokemonList.slice((page - 1) * 30, page * 30));
      } else {
        setPokemonPaginate(pokemonList.slice((page - 1) * 30, page * 30));
        setKey(new Date().getTime());
        setLoading(false);
      }
    }
  }, [pokemonList, page]);

  useEffect(() => {
    if (router.query.page && page !== Number(router.query.page) && pokemonList) {
      setPage(parseInt(router.query.page as string));
    } else if (router.isReady && !router.query.page && pokemonList) {
      setPage(1);
    }
  }, [router.query.page, router.isReady, page, pokemonList]);

  const handleSearchSubmit = () => {
    if (search.length > 0) {
      //check if search is not a number
      if (isNaN(Number(search))) {
        const searchPokemon = pokemon.filter(res => res.pokemon_species.name.toLowerCase().includes(search.toLowerCase()));
        setPokemonList(searchPokemon);
      } else {
        //if search is a number we get the pokemon by id
        const searchPokemon = pokemon.filter(res => res.entry_number.toString() == search);
        setPokemonList(searchPokemon);
      }
    } else {
      setPokemonList(pokemon);
    }
    setPage(1);
    router.push(`?page=1`, undefined, { shallow: true });
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

      {pokemonPaginate.length > 0 ? pokemonPaginate.map(({ entry_number, pokemon_species }, index) => (
        <Pokemon entry_number={entry_number} pokemon_species={pokemon_species} keyValue={key} key={index} />
      )) :
        (!isAnimated && <h3 style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "20px",
          gridColumn: "1 / -1"
        }}>No results</h3>)}
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
