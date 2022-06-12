import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@mui/material";

import type { ApiResponse, FlipAnimation, GetStaticProps, Pokemon, PokemonSpecies } from "../../../type";
import { pokemonInit, pokemonSpeciesInit } from "../../../components/constants";
import pokemonStyle from "../../../styles/pokemon_details.module.css";

import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';
import ArrowRightTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';
import FlipCameraAndroidIcon from '@mui/icons-material/FlipCameraAndroid';

export async function getStaticPaths() {
    const { data }: ApiResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?limit=10000`
    );

    const indexPage = data.results.map((res) => res.url.split("/")[6]);

    return {
        paths: indexPage.map((res) => `/pokemon/${res}`),
        fallback: false
    };
}

export async function getPokemonData(url: string): Promise<Pokemon | PokemonSpecies> {
    const { data } = await axios.get(url);
    return data;
}

export async function getStaticProps({ params }: GetStaticProps) {
    const { id } = params;

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const pokemonData = await getPokemonData(url) as Pokemon;

    const pokemon: Pokemon = {
        height: pokemonData.height,
        name: pokemonData.name,
        weight: pokemonData.weight,
        sprites: pokemonData.sprites,
        species: pokemonData.species,
        id: pokemonData.id,
    }

    return {
        props: {
            id: parseInt(id),
            pokemon: pokemon
        }
    };
}

const flipAnimation: FlipAnimation = {
    initial: {
        position: "absolute",
        opacity: 0,
        transform: "rotateY(180deg)",
    },
    animate: {
        opacity: 1,
        transform: "rotateY(0deg)",
        perspective: 1000,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
            flip: {
                direction: "vertical",
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    },
    exit: {
        opacity: 0,
        transform: "rotateY(180deg)",
        perspective: 1000,
        transition: {
            duration: 0.5,
            ease: "easeInOut",
            flip: {
                direction: "vertical",
                duration: 0.5,
                ease: "easeInOut",
            },
        },
    }
}

// regex for remove some wrong caracters 
// eslint-disable-next-line
const regex = new RegExp("\\n|");

export default function Card({ id, pokemon }: { id: number, pokemon: Pokemon }) {

    const language = "en";

    const [pokemonDetails, setPokemonDetails] = useState<PokemonSpecies>(pokemonSpeciesInit);
    const [pokemonNext, setPokemonNext] = useState<Pokemon>(pokemonInit);
    const [pokemonPrev, setPokemonPrev] = useState<Pokemon>(pokemonInit);
    const [isFront, setIsFront] = useState(true);
    const [versionName, setVersionName] = useState("");

    const flavor_text = pokemonDetails.flavor_text_entries.filter(res => res.language.name === language);

    const default_image = isFront ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png` : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemonDetails.id}.png`;

    useEffect(() => {
        if (id) {
            const url = pokemon.species.url;

            const pokemonDetail = getPokemonData(url) as Promise<PokemonSpecies>;

            const next = `https://pokeapi.co/api/v2/pokemon/${id + 1}`;
            const pokemonDetailNext = getPokemonData(next) as Promise<Pokemon>;
            pokemonDetailNext.then(res => setPokemonNext(res)).catch(() => {
                if (id + 1 < 10000) {
                    const next = `https://pokeapi.co/api/v2/pokemon/10001`;
                    const pokemonDetailNext = getPokemonData(next) as Promise<Pokemon>;
                    pokemonDetailNext.then(res => setPokemonNext(res)).catch(() => {
                        setPokemonNext(pokemonInit);
                    });
                } else {
                    setPokemonNext(pokemonInit);
                }
            });
            if (id > 1 && id != 10001) {
                const prev = `https://pokeapi.co/api/v2/pokemon/${id - 1}`;
                const pokemonDetailPrev = getPokemonData(prev) as Promise<Pokemon>;
                pokemonDetailPrev.then(res => {
                    setPokemonPrev(res)
                });
            } else if (id === 10001) {
                const prev = `https://pokeapi.co/api/v2/pokemon/891`;
                const pokemonDetailPrev = getPokemonData(prev) as Promise<Pokemon>;
                pokemonDetailPrev.then(res => {
                    setPokemonPrev(res)
                })
            }

            pokemonDetail.then(res => {
                setPokemonDetails(res);
                setVersionName(res.flavor_text_entries.find(res => res.language.name === language)?.version.name || "");
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <Head>
                <title>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</title>
            </Head>
            <main className={pokemonStyle.main}>

                <h1 className={pokemonStyle.title}>
                    <Link href="/pokemon">
                        <a>
                            <ArrowLeftTwoToneIcon style={{ fontSize: "40px" }} />
                        </a>
                    </Link>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h1>
                <nav className={pokemonStyle.navigate}>
                    <div>
                        {!!pokemonPrev.id && <div className={pokemonStyle.pokemonDetails}>
                            <Link href={`/pokemon/${pokemonPrev.id}`}>
                                <a>
                                    <ArrowLeftTwoToneIcon />
                                </a>
                            </Link>
                            <Link href={`/pokemon/${pokemonPrev.id}`}>
                                <a style={{
                                    height: 52,
                                    width: 52,
                                }}>
                                    <Image height={52} width={52} alt={pokemon.name} src={pokemonPrev.sprites.front_default ? pokemonPrev.sprites.front_default : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonPrev.species.url.split('/')[6]}.png`} />
                                </a>
                            </Link>
                            <Link href={`/pokemon/${pokemonPrev.id}`}>
                                <a className={pokemonStyle.nav__pokemon_name}>
                                    <p>
                                        {pokemonPrev.name}
                                        <br />
                                        {(pokemonPrev.id).toString().padStart(3, "0")}
                                    </p>
                                </a>
                            </Link>
                        </div>}
                    </div>
                    <div className={pokemonStyle.pokemonMain}>
                        <p>
                            <strong>{pokemon.name}</strong>
                            <br />
                            {id.toString().padStart(3, "0")}
                        </p>
                    </div>
                    {!!pokemonNext.id && <div className={pokemonStyle.pokemonDetails}>
                        <Link href={`/pokemon/${id + 1}`}>
                            <a style={{
                                height: 52,
                                width: 52,
                            }}>
                                <Image height={52} width={52} alt={pokemon.name} src={pokemonNext.sprites.front_default ? pokemonNext.sprites.front_default : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonNext.species.url.split('/')[6]}.png`} />
                            </a>
                        </Link>
                        <Link href={`/pokemon/${pokemonNext.id}`}>
                            <a className={pokemonStyle.nav__pokemon_name}>
                                <p>
                                    {pokemonNext.name}
                                    <br />
                                    {(pokemonNext.id).toString().padStart(3, "0")}
                                </p>
                            </a>
                        </Link>
                        <Link href={`/pokemon/${pokemonNext.id}`}>
                            <a>
                                <ArrowRightTwoToneIcon />
                            </a>
                        </Link>
                    </div>}
                </nav>
                <div className={pokemonStyle.sprites}>
                    <div className={pokemonStyle.sprite}>
                        <AnimatePresence>
                            <motion.div
                                key={isFront ? "front" : "back"}
                                {...flipAnimation}
                            >
                                {pokemon.sprites.front_default ?
                                    <Image height={200} width={200} alt={pokemon.name} src={isFront ? pokemon.sprites.front_default : pokemon.sprites.back_default} />
                                    :
                                    <Image height={200} width={200} alt={pokemon.name} src={default_image} />
                                }
                            </motion.div>
                        </AnimatePresence>
                        <p className={pokemonStyle.sprite_title}>
                            {pokemon.name}
                        </p>
                    </div>
                    {pokemon.sprites.front_female && <div className={pokemonStyle.sprite}>
                        <AnimatePresence>
                            <motion.div
                                key={isFront ? "front" : "back"}
                                {...flipAnimation}
                            >
                                <Image height={200} width={200} src={isFront ? pokemon.sprites.front_female : pokemon.sprites.back_female} alt={pokemon.name + " female"} />
                            </motion.div>
                        </AnimatePresence>
                        <p className={pokemonStyle.sprite_title}>
                            {pokemon.name} female
                        </p>
                    </div>}
                    {pokemon.sprites.front_shiny && <div className={pokemonStyle.sprite}>
                        <AnimatePresence>
                            <motion.div
                                key={isFront ? "front" : "back"}
                                {...flipAnimation}
                            >
                                <Image height={200} width={200} alt={pokemon.name + " shiny"} src={isFront ? pokemon.sprites.front_shiny : pokemon.sprites.back_shiny} />
                            </motion.div>
                        </AnimatePresence>
                        <p className={pokemonStyle.sprite_title}>
                            {pokemon.name} shiny
                        </p>
                    </div>}
                    {pokemon.sprites.front_shiny_female && <div className={pokemonStyle.sprite}>
                        <AnimatePresence>
                            <motion.div
                                key={isFront ? "front" : "back"}
                                {...flipAnimation}
                            >
                                <Image height={200} width={200} src={isFront ? pokemon.sprites.front_shiny_female : pokemon.sprites.back_shiny_female} alt={pokemon.name + " shiny female"} />
                            </motion.div>
                        </AnimatePresence>
                        <p className={pokemonStyle.sprite_title}>
                            {pokemon.name} shiny female
                        </p>
                    </div>}
                    <Button onClick={() => setIsFront(res => !res)} className={pokemonStyle.change__sprite}>
                        <FlipCameraAndroidIcon />
                    </Button>
                </div>
                <div style={{
                    marginTop: "3rem",
                }}>
                    <h2 style={{
                        fontSize: "1.75rem"
                    }}>
                        Description
                    </h2>
                    <div className={pokemonStyle.version_header}>
                        {flavor_text.map((res, index) => (<div key={"flavor_" + index}>
                            <button onClick={() => setVersionName(res.version.name)}>
                                <p className={`${pokemonStyle.version_header__text} ${versionName == res.version.name && pokemonStyle.active}`}>{res.version.name}</p>
                            </button>
                        </div>))}
                    </div>
                    {!!versionName && <div className={pokemonStyle.version_description}>
                        <p>{flavor_text.find(res => res.version.name === versionName)?.flavor_text.replace(regex, " ") || ""}</p>
                    </div>}
                </div>
                <div style={{
                    marginTop: "1rem",
                }}>
                    <h3 style={{
                        fontSize: "1.75rem"
                    }}>
                        Species
                    </h3>
                    <p style={{
                        fontSize: "1.5rem",
                        marginTop: "1rem",
                    }}>
                        {pokemonDetails.genera.find(res => res.language.name === language)?.genus}
                    </p>
                </div>
                <div style={{
                    marginTop: "1rem",
                }}>
                    <h3 style={{
                        fontSize: "1.75rem"
                    }}>
                        Size and weight
                    </h3>
                    <div style={{
                        marginTop: "1rem",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                    }}>

                        <p style={{ textAlign: "center", fontSize: "1.5rem" }}>weight: {pokemon.weight}</p>
                        <p style={{ textAlign: "center", fontSize: "1.5rem" }}>height: {pokemon.height}</p>
                    </div>
                </div>
            </main>
        </>
    );
}
