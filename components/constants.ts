import type { Pokemon, PokemonSpecies } from "../type";

const pokemonSpeciesInit: PokemonSpecies = {
    base_happiness: 0,
    capture_rate: 0,
    color: {
        name: "",
        url: ""
    },
    egg_groups: [],
    evolution_chain: {
        url: ""
    },
    evolves_from_species: {
        name: "",
        url: ""
    },
    flavor_text_entries: [],
    form_descriptions: [],
    forms_switchable: false,
    gender_rate: 0,
    genera: [],
    generation: {
        name: "",
        url: ""
    },
    growth_rate: {
        name: "",
        url: ""
    },
    habitat: {
        name: "",
        url: "",
    },
    has_gender_differences: false,
    hatch_counter: 0,
    id: 0,
    is_baby: false,
    is_legendary: false,
    is_mythical: false,
    name: "",
    names: [],
    order: 0,
    pal_park_encounters: [],
    pokedex_numbers: [],
    shape: {
        name: "",
        url: "",
    },
    varieties: []
};

const pokemonInit: Pokemon = {
    sprites: {
        front_default: "",
        back_default: "",
        front_shiny: "",
        back_shiny: "",
        back_female: "",
        back_shiny_female: "",
        front_female: "",
        front_shiny_female: ""
    },
    height: "0",
    weight: "0",
    name: "",
    species: {
        name: "",
        url: ""
    },
    id: 0
};

export {
    pokemonInit,
    pokemonSpeciesInit
}