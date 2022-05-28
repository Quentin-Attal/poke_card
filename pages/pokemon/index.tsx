import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import Link from "next/link";
import axios from "axios";
import { Pagination } from "@mui/material";

import styles from "../index.module.css";
import type { PokemonResult } from "../../type";

export async function getStaticProps() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokedex/1/");

  return {
    props: {
      pokemon: data.pokemon_entries
    }
  };
}

export default function Home({ pokemon }: { pokemon: PokemonResult[] }) {

  const [page, setPage] = useState(1);
  const [pokemonPaginate, setPokemonPaginate] = useState<PokemonResult[]>([]);
  const router = useRouter();

  const handlePaginationChange = (e: ChangeEvent<unknown>, value: number) => {
    router.push(`?page=${value}`, undefined, { shallow: true });
  };

  useEffect(() => {
    if (pokemon) {
      setPokemonPaginate(pokemon.slice((page - 1) * 30, page * 30));
    }
  }, [pokemon, page]);

  useEffect(() => {
    if (router.query.page && page !== Number(router.query.page) && pokemon) {
      setPage(parseInt(router.query.page as string));
      setPokemonPaginate(pokemon.slice((page - 1) * 30, page * 30));
    }
  }, [router.query.page, page, pokemon]);


  return (
    <div className={styles.root}>
      {pokemonPaginate.map(({ entry_number, pokemon_species }) => (
        <div key={entry_number} className={styles.card}>
          <Link href={`/pokemon_entries/${entry_number}`}>
            <a>
              <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry_number}.png`}
                alt={pokemon_species.name}
                height={150}
                loading={"lazy"}
                width={150}
              />
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
