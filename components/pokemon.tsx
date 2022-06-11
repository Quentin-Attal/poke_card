import Link from "next/link"
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion"
import styles from "../styles/pokemon.module.css";
import { useState } from "react";
import { getPokemonData } from "../pages/pokemon/[id]";
import type { Pokemon as PokemonType } from "../type";

type PokemonComponent = {
    keyValue: number,
    entry_number: number,
    name: string
}

const Pokemon = ({ entry_number, name, keyValue }: PokemonComponent) => {
    const [imageError, setImageError] = useState(false);
    const [fallback, setFallback] = useState("");
    const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry_number}.png`

    return <div className={styles.card}>
        <Link href={`/pokemon/${entry_number}`}>
            <a className={styles.inside_card}>
                <div className={styles.inside_card}>
                    <AnimatePresence>
                        <motion.div
                            key={entry_number + "_Pokemon_" + keyValue}
                            initial={{ opacity: 0, position: "absolute" }}
                            animate={{
                                scale: [0.1, 1, 1],
                                opacity: [0.1, 0.5, 1],
                                filter: ["grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)", "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)", ""]
                            }}
                            transition={{
                                duration: 1,
                                ease: "easeInOut",
                                times: [0.1, 0.8, 1],
                            }}
                            exit={{
                                scale: [1, 0.1, 0.1],
                                opacity: [1, 0.5, 0.1],
                                filter: ["", "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)", "grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8)"],
                            }}
                            className={styles.inside_card}>
                            <Image src={imageError ? fallback : src}
                                alt={name}
                                width={"100%"}
                                height={"100%"}
                                loading={"lazy"}
                                onError={() => {
                                    const url = `https://pokeapi.co/api/v2/pokemon/${entry_number}`;
                                    const pokemonDetail = getPokemonData(url) as Promise<PokemonType>;
                                    pokemonDetail.then(res => {
                                        setFallback(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.species.url.split('/')[6]}.png`);
                                        setImageError(true);
                                    })
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
                <p>{name}</p>
            </a>
        </Link>
    </div>
}

export default Pokemon;