import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { ApiResponse, GetStaticProps, Pokemon, PokemonDetails } from "../../../type";
import { pokemonDetailsInit } from "../../../components/constants";

import ArrowLeftTwoToneIcon from '@mui/icons-material/ArrowLeftTwoTone';
import ArrowRightTwoToneIcon from '@mui/icons-material/ArrowRightTwoTone';
import Link from "next/link";

export async function getStaticPaths() {
    const { data }: ApiResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokedex/1/`
    );

    return {
        paths: data.pokemon_entries.map((res, index) => `/pokemon/${index + 1}`),
        fallback: false
    };
}

async function getPokemonData(url: string): Promise<Pokemon | PokemonDetails> {
    const { data } = await axios.get(url);
    return data;
}

export async function getStaticProps({ params }: GetStaticProps) {
    const { id } = params;

    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

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

    const [PokemonDetails, setPokemonDetails] = useState<PokemonDetails>(pokemonDetailsInit);

    const flavor_text = pokemon.flavor_text_entries.filter(res => res.language.name === language);

    const [pokemonNameNext, setPokemonNameNext] = useState<string>("");
    const [pokemonNamePrev, setPokemonNamePrev] = useState<string>("");

    useEffect(() => {
        if (id) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

            const pokemonDetail = getPokemonData(url) as Promise<PokemonDetails>;

            const next = `https://pokeapi.co/api/v2/pokemon/${id + 1}`;
            const pokemonDetailNext = getPokemonData(next) as Promise<PokemonDetails>;
            pokemonDetailNext.then(res => setPokemonNameNext(res.name)).catch(res => setPokemonNameNext(""));
            if (id > 0) {
                const prev = `https://pokeapi.co/api/v2/pokemon/${id - 1}`;
                const pokemonDetailPrev = getPokemonData(prev) as Promise<PokemonDetails>;
                pokemonDetailPrev.then(res => setPokemonNamePrev(res.name));
            }

            pokemonDetail.then(res => {
                setPokemonDetails(res);
            })
        }
    }, [id]);

    return (
        <div>
            <Head>
                <title>{pokemon.name}</title>
            </Head>
            <h1 >{pokemon.names.find(res => res.language.name === language)?.name}</h1>
            <div>
                <div>
                    {!!pokemonNamePrev && <div>
                        <Link href={`/pokemon/${id - 1}`}>
                            <a>
                                <ArrowLeftTwoToneIcon />
                            </a>
                        </Link>
                        <Link href={`/pokemon/${id - 1}`}>
                            <a>
                                <Image height={52} width={52} alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id - 1}.png`} />
                            </a>
                        </Link>
                        <Link href={`/pokemon/${id - 1}`}>
                            <a>
                                <p>
                                    {pokemonNamePrev}
                                    <br />
                                    {(id - 1).toString().padStart(3, "0")}
                                </p>
                            </a>
                        </Link>
                    </div>}
                    <div>
                        <p>
                            {pokemon.name}
                            <br />
                            {id.toString().padStart(3, "0")}
                        </p>
                    </div>
                    {!!pokemonNameNext && <div>
                        <Link href={`/pokemon/${id + 1}`}>
                            <a>
                                <Image height={52} width={52} alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id + 1}.png`} />
                            </a>
                        </Link>
                        <Link href={`/pokemon/${id + 1}`}>
                            <a>
                                <p>
                                    {pokemonNameNext}
                                    <br />
                                    {(id + 1).toString().padStart(3, "0")}
                                </p>
                            </a>
                        </Link>
                        <Link href={`/pokemon/${id + 1}`}>
                            <a>
                                <ArrowRightTwoToneIcon />
                            </a>
                        </Link>
                    </div>}
                </div>
            </div>
            <div>
                <Image height={200} width={200} alt={pokemon.name} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} />
                {PokemonDetails.sprites.front_female && <Image height={200} width={200} src={PokemonDetails.sprites.front_female} alt="" />}
                <Image height={200} width={200} alt={pokemon.name + " shiny"} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`} />
                {PokemonDetails.sprites.front_shiny_female && <Image height={200} width={200} src={PokemonDetails.sprites.front_shiny_female} alt="" />}
            </div>
            {flavor_text.map((res, index) => (<div key={"flavor_" + index}>
                <h3>{res.version.name}</h3>
                <p>{res.flavor_text}</p>
            </div>)
            )}
            <p>
                {pokemon.evolves_from_species ? pokemon.evolves_from_species.name : "No Evolution"}
            </p>
            <h2>
                Species: {pokemon.genera.find(res => res.language.name === language)?.genus}
            </h2>
            <p>
                weight: {PokemonDetails.weight}
                height: {PokemonDetails.height}
            </p>
        </div>
    );
}
