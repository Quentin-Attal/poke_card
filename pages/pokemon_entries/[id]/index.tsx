import axios from "axios";
import type { ApiResponse, getStaticProps, Pokemon } from "../../../type";

export async function getStaticPaths() {
    const { data }: ApiResponse = await axios.get(
        `https://pokeapi.co/api/v2/pokedex/1/`
    );
    
    return {
        paths: data.pokemon_entries.map((res, index) => `/pokemon_entries/${index + 1}`),
        fallback: false
    };
}

export async function getStaticProps({ params }: getStaticProps) {
    const { id } = params;

    const { data: card } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    const { data: pokemon } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

    return {
        props: {
            card: card,
            id: id,
            pokemon: pokemon
        }
    };
}

export default function Card({ card, id, pokemon }: { card: Pokemon, id: string, pokemon: any }) {

    const language = "en";
    const flavor_text = card.flavor_text_entries.filter(res => res.language.name === language);

    return (
        <div>
            <h2>{card.names.find(res => res.language.name === language)?.name}</h2>
            <div>
                {pokemon.sprites.front_default && <img src={pokemon.sprites.front_default} alt="" />}
                {pokemon.sprites.front_female && <img src={pokemon.sprites.front_female} alt="" />}
                {pokemon.sprites.front_shiny && <img src={pokemon.sprites.front_shiny} alt="" />}
                {pokemon.sprites.front_shiny_female && <img src={pokemon.sprites.front_shiny_female} alt="" />}
            </div>
            {flavor_text.map(res => (<>
                <h3>{res.version.name}</h3>
                <p>{res.flavor_text}</p></>)
            )}
            <p>
                {card.evolves_from_species ? card.evolves_from_species.name : "No Evolution"}
            </p>
            <h2>
                Species: {card.genera.find(res => res.language.name === language)?.genus}
            </h2>
            <p>
                weight: {pokemon.weight}
                height: {pokemon.height}
            </p>
        </div>
    );
}
