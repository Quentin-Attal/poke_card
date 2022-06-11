type PokemonResult = {
    entry_number: number;
    pokemon_species: {
        name: string;
        url: string;
    }
}

type Pokemon = {
    base_happiness: number;
    capture_rate: number;
    color: {
        name: string;
        url: string
    };
    egg_groups: Array<{
        name: string;
        url: string;
    }>;
    evolution_chain: {
        url: string
    };
    evolves_from_species: {
        name: string;
        url: string;
    };
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
            url: string;
        };
        version: {
            name: string;
            url: string;
        }
    }>;
    form_descriptions: Array<any>;
    forms_switchable: boolean;
    gender_rate: number;
    genera: Array<{
        genus: string;
        language: {
            name: string;
            url: string;
        }
    }>;
    generation: {
        name: string;
        url: string;
    };
    growth_rate: {
        name: string;
        url: string;
    };
    habitat: {
        name: string;
        url: string;
    };
    has_gender_differences: boolean;
    hatch_counter: number;
    id: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    name: string;
    names: Array<{
        language: {
            name: string;
            url: string;
        };
        name: string;
    }>;
    order: number;
    pal_park_encounters: Array<{
        area: {
            name: string;
            url: string;
        };
        base_score: number;
        rate: number;
    }>;
    pokedex_numbers: Array<{
        entry_number: number;
        pokedex: {
            name: string;
            url: string;
        };
    }>;
    shape: {
        name: string;
        url: string;
    };
    varieties: Array<{
        is_default: boolean;
        pokemon: {
            name: string;
            url: string;
        };
    }>;
}

type PokemonDetails = {
    sprites: {
        front_default: string;
        front_shiny: string;
        front_female: string;
        front_shiny_female: string;
        back_default: string;
        back_shiny: string;
        back_female: string;
        back_shiny_female: string;
    };
    weight: string;
    height: string;
    name: string;
}

type ApiResponse = {
    data: { pokemon_entries: PokemonResult[] }
}

type GetStaticProps = {
    params: {
        id: string;
    }
}

type HeaderHome = {
    search: string;
    setSearch: (value: string) => void;
    handleSearchSubmit: () => void
}

export type {
    Pokemon,
    PokemonResult,
    ApiResponse,
    GetStaticProps,
    PokemonDetails,
    HeaderHome
}
