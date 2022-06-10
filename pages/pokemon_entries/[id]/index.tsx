import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { ApiResponse, getStaticProps, Pokemon, PokemonDetails } from "../../../type";
import { pokemonDetailsInit } from "../../../components/constants";

export async function getStaticPaths() {
    const { data }: ApiResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokedex/1/`
    );

    return {
        paths: data.pokemon_entries.map((res, index) => `/pokemon_entries/${index + 1}`),
        fallback: false
    };
}

async function getPokemonData(url: string): Promise<Pokemon | PokemonDetails> {
    const { data } = await axios.get(url);
    return data;
}

export async function getStaticProps({ params }: getStaticProps) {
    const { id } = params;

    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    const pokemon = await getPokemonData(url);

    return {
        props: {
            id: id,
            pokemon: pokemon
        }
    };
}

export default function Card({ id, pokemon }: { id: number, pokemon: Pokemon }) {

    const language = "en";

    const [PokemonDetails, setPokemonDetails] = useState<PokemonDetails>(pokemonDetailsInit);

    const flavor_text = pokemon.flavor_text_entries.filter(res => res.language.name === language);

    useEffect(() => {
        if (id) {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

            const pokemonDetail = getPokemonData(url);

            Promise.all([pokemonDetail]).then(([pokemonDetail]) => {
                if ("sprites" in pokemonDetail) {
                    setPokemonDetails(pokemonDetail);
                }
            });
        }
    }, [id]);

    return (
        <div>
            <Head>
                <title>{pokemon.name}</title>
            </Head>
            <h2>{pokemon.names.find(res => res.language.name === language)?.name}</h2>
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
