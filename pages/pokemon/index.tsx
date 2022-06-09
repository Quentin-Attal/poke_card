import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Link from "next/link";
import axios from "axios";
import { Pagination, Skeleton } from "@mui/material";

import styles from "../pokemon.module.css";
import type { PokemonResult } from "../../type";
import Head from "next/head";

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
  const [loading, setLoading] = useState(true);
  const [pokemonPaginate, setPokemonPaginate] = useState<PokemonResult[]>([]);

  const router = useRouter();
  const rowSkeletons = Array.from({ length: 30 }, (_, i) => i);

  const handlePaginationChange = (e: ChangeEvent<unknown>, value: number) => {
    router.push(`?page=${value}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (pokemon && page > 0) {
      setPokemonPaginate(pokemon.slice((page - 1) * 30, page * 30));
      setLoading(false);
    }
  }, [pokemon, page]);

  useEffect(() => {
    if (router.query.page && page !== Number(router.query.page) && pokemon) {
      setPage(parseInt(router.query.page as string));
    } else if (router.isReady && !router.query.page && pokemon) {
      setPage(1);
    }
  }, [router.query.page, page, pokemon]);

  if (loading) {
    return <div className={styles.root}>
      <Head>
        <title>Pokedex</title>
      </Head>
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
      {pokemonPaginate.map(({ entry_number, pokemon_species }) => (
        <div key={entry_number} className={styles.card}>
          <Link href={`/pokemon_entries/${entry_number}`}>
            <a className={styles.inside_card}>
              <div className={styles.inside_card}>
                <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry_number}.png`}
                  alt={pokemon_species.name}
                  width={"100%"}
                  height={"100%"}
                  loading={"lazy"}
                />
              </div>
              <p>{pokemon_species.name}</p>
            </a>
          </Link>
        </div>
      ))}
      <Pagination
        count={Math.floor(pokemon.length / 30) + 1}
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
