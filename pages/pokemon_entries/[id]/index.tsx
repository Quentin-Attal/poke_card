import axios from "axios";
import Image from "next/image";

import type { ApiResponse, getStaticProps, Pokemon, PokemonDetails } from "../../../type";

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

    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    const pokemonDetails = await getPokemonData(url);

    url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const pokemon = await getPokemonData(url);

    return {
        props: {
            pokemonDetails: pokemonDetails,
            pokemon: pokemon
        }
    };
}

export default function Card({ pokemonDetails, pokemon }: { pokemonDetails: Pokemon, pokemon: PokemonDetails }) {

    const language = "en";
    const flavor_text = pokemonDetails.flavor_text_entries.filter(res => res.language.name === language);

    return (
        <div>
            <h2>{pokemonDetails.names.find(res => res.language.name === language)?.name}</h2>
            <div>
                {pokemon.sprites.front_default && <Image height={200} width={200} src={pokemon.sprites.front_default} alt="" />}
                {pokemon.sprites.front_female && <Image height={200} width={200} src={pokemon.sprites.front_female} alt="" />}
                {pokemon.sprites.front_shiny && <Image height={200} width={200} src={pokemon.sprites.front_shiny} alt="" />}
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
        </div>
    );
}
