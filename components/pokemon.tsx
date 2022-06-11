import Link from "next/link"
import type { PokemonResult } from "../type"
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion"
import styles from "../pages/pokemon.module.css";

type Pokemon = PokemonResult & {
    keyValue: number
}

const Pokemon = ({ entry_number, pokemon_species, keyValue }: Pokemon) => (
    <div className={styles.card}>
        <Link href={`/pokemon_entries/${entry_number}`}>
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
                            <Image src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry_number}.png`}
                                alt={pokemon_species.name}
                                width={"100%"}
                                height={"100%"}
                                loading={"lazy"}
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
                <p>{pokemon_species.name}</p>
            </a>
        </Link>
    </div>
)

export default Pokemon;