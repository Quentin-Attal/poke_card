import Link from "next/link";
import axios from "axios";

import styles from "./index.module.css";
import type { PokemonResult } from "../type";
import Image from 'next/image'

export async function getStaticProps() {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokedex/1/");

  return {
    props: {
      cards: data.pokemon_entries
    }
  };
}

export default function Home({ cards }: { cards: PokemonResult[] }) {
  return (
    <div className={styles.root}>
      {cards.map(({ entry_number }) => (
        <div key={entry_number} className={styles.card}>
          <Link href={`/pokemon_entries/${entry_number}`}>
            <a>
              <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry_number}.png`}
                alt=""
                height={150}
                width={150}
              />
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
