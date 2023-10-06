'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const PokemonDetail = () => {
  const params = useParams();
  const [pokemon, setPokemon] = useState();
  const [abilitiesList, setAbilitiesList] = useState({});
  const [abilityActive, setAbilityActive] = useState();

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${params.name}`,
        {
          method: 'GET',
        }
      );

      const pokemonData = await response.json();
      setPokemon(pokemonData);
    };

    fetchPokemon();
  }, [params.name]);

  return (
    <section className="section-container">
      {pokemon ? (
        <div>
          <p className="font-bold text-lg text-center">{pokemon.name}</p>

          <div className="px-3 py-2 bg-blue-50 rounded-lg mt-5">
            <p className="font-semibold">Sprites</p>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {(() => {
              const spritesList = [];
              let index = 0;

              for (const key in pokemon.sprites) {
                const spriteLink = pokemon.sprites[key];
                if (key !== 'other' && key !== 'versions' && spriteLink) {
                  spritesList.push(
                    <div
                      key={index}
                      className="p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center"
                    >
                      <Image
                        alt="sprite-image"
                        width={100}
                        height={100}
                        sizes="100vw"
                        src={spriteLink}
                      />
                      <p className="text-center">{key.split('_').join(' ')}</p>
                    </div>
                  );
                  index++;
                }
              }

              return spritesList;
            })()}
          </div>

          <div className="px-3 py-2 bg-blue-50 rounded-lg mt-5">
            <p className="font-semibold">Abilities</p>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {pokemon.abilities.map((item, index) => (
              <button
                key={index}
                className={`px-3 py-2 border border-gray-200 hover:bg-blue-50 rounded-lg ${
                  abilityActive === item.ability.name &&
                  'bg-blue-50 border-blue-500'
                }`}
                onClick={async () => {
                  setAbilityActive('loading');
                  if (!abilitiesList[item.ability.name]) {
                    const response = await fetch(item.ability.url, {
                      method: 'GET',
                    });

                    const abilityData = await response.json();
                    setAbilitiesList((prev) => {
                      return { ...prev, [item.ability.name]: abilityData };
                    });
                  }

                  setAbilityActive(item.ability.name);
                }}
              >
                {item.ability.name}
              </button>
            ))}
          </div>
          {abilityActive === 'loading' ? (
            <div className="px-3 py-2 border border-blue-500 rounded-lg mt-3">
              <p>Loading...</p>
            </div>
          ) : (
            abilityActive && (
              <div className="px-3 py-2 border border-blue-500 rounded-lg mt-3">
                {abilitiesList[abilityActive].effect_entries.map((item) => {
                  if (item.language.name === 'en') {
                    return <div key={item.id}>{item.effect}</div>;
                  }
                })}
              </div>
            )
          )}

          <div className="px-3 py-2 bg-blue-50 rounded-lg mt-5">
            <p className="font-semibold">Forms</p>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {pokemon.forms.map((item, index) => (
              <p
                key={index}
                className="px-3 py-2 border border-gray-200 rounded-lg"
              >
                {item.name}
              </p>
            ))}
          </div>

          <div className="px-3 py-2 bg-blue-50 rounded-lg mt-5">
            <p className="font-semibold">Stats</p>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {pokemon.stats.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center"
              >
                <p className="min-w-[5rem] bg-yellow-200 rounded-lg min-h-[5rem] px-2 flex items-center justify-center font-semibold">
                  {item.stat.name.toUpperCase()}
                </p>
                <p className="text-center text-sm mt-2">
                  base: {item.base_stat}
                </p>
                <p className="text-center text-sm">effort: {item.effort}</p>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 bg-blue-50 rounded-lg mt-5">
            <p className="font-semibold">Types</p>
          </div>
          <div className="flex gap-3 mt-3 flex-wrap mb-8">
            {pokemon.types.map((item, index) => (
              <div
                key={index}
                className="p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center"
              >
                <p className="min-w-[5rem] bg-yellow-200 rounded-lg min-h-[5rem] px-2 flex items-center justify-center font-semibold">
                  {item.type.name.toUpperCase()}
                </p>
                <p className="text-center text-sm mt-2">slot: {item.slot}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </section>
  );
};

export default PokemonDetail;
