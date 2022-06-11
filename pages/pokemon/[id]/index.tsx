import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { ApiResponse, GetStaticProps, Pokemon, PokemonSpecies } from "../../../type";
import { pokemonInit, pokemonSpeciesInit } from "../../../components/constants";
import pokemonStyle from "../../../styles/pokemon_details.module.css";

import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';
import ArrowRightTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';
import Link from "next/link";

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

    const pokemon = await getPokemonData(url);

    return {
        props: {
            id: parseInt(id),
            pokemon: pokemon
        }
    };
}

export default function Card({ id, pokemon }: { id: number, pokemon: Pokemon }) {

    const language = "en";

    const [pokemonDetails, setPokemonDetails] = useState<PokemonSpecies>(pokemonSpeciesInit);

    const flavor_text = pokemonDetails.flavor_text_entries.filter(res => res.language.name === language);

    const [pokemonNext, setPokemonNext] = useState<Pokemon>(pokemonInit);
    const [pokemonPrev, setPokemonPrev] = useState<Pokemon>(pokemonInit);

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
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return (
        <>
            <Head>
                <title>{pokemon.name}</title>
            </Head>
            <main className={pokemonStyle.main}>
                <h1 className={pokemonStyle.title}>{pokemon.name}</h1>
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
                                <a>
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
                            <a>
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
                <div>
                    {pokemon.sprites.front_default ?
                        <Image height={200} width={200} alt={pokemon.name} src={pokemon.sprites.front_default} />
                        :
                        <Image height={200} width={200} alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonDetails.id}.png`} />
                    }
                    {pokemon.sprites.front_female && <Image height={200} width={200} src={pokemon.sprites.front_female} alt="" />}
                    {pokemon.sprites.front_shiny && <Image height={200} width={200} alt={pokemon.name + " shiny"} src={pokemon.sprites.front_shiny} />}
                    {pokemon.sprites.front_shiny_female && <Image height={200} width={200} src={pokemon.sprites.front_shiny_female} alt="" />}
                </div>
                {flavor_text.map((res, index) => (<div key={"flavor_" + index}>
                    <h3>{res.version.name}</h3>
                    <p>{res.flavor_text}</p>
                </div>)
                )}
                <p>
                    {pokemonDetails.evolves_from_species ? pokemonDetails.evolves_from_species.name : "No Evolution"}
                </p>
                <h2>
                    Species: {pokemonDetails.genera.find(res => res.language.name === language)?.genus}
                </h2>
                <p>
                    weight: {pokemon.weight}
                    height: {pokemon.height}
                </p>
            </main>
        </>
    );
}
