'use client';
import PokemonCard from '@components/PokemonCard';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Home = () => {
  const [pokemonList, setPokemonList] = useState();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('pokemonName')) {
      const fetchPokemonDetail = async () => {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${searchParams.get(
            'pokemonName'
          )}`,
          {
            method: 'GET',
          }
        );

        let pokemon = await response.json();

        setPokemonList([pokemon]);
      };

      fetchPokemonDetail();
    } else {
      const fetchPokemons = async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/', {
          method: 'GET',
        });

        let pokemons = await response.json();

        for (let i = 0; i < pokemons.results.length; i++) {
          const response2 = await fetch(pokemons.results[i].url, {
            method: 'GET',
          });

          const pokemon = await response2.json();
          pokemons.results[i]['sprites'] = {
            front_default: pokemon.sprites.front_default,
          };
        }

        setPokemonList(pokemons.results);
      };

      fetchPokemons();
    }
  }, [searchParams]);

  return (
    <section className="section-container space-y-5">
      <form className="flex space-x-3 items-center">
        <input
          className="focus:outline-0 border border-gray-200 rounded-lg px-3 py-2"
          name="pokemonName"
          type="text"
          placeholder="Cari pokemon..."
        />
        <button className="bg-blue-500 text-white px-3 py-1 rounded-lg">
          Search
        </button>
      </form>
      <div className="grid grid-cols-4 gap-3 ">
        {pokemonList ? (
          pokemonList.map((item, index) => (
            <PokemonCard data={item} key={index} />
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </section>
  );
};

export default Home;
