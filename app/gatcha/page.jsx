'use client';
import PokemonCard from '@components/PokemonCard';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Gatcha = () => {
  const [locationList, setLocationList] = useState();
  const [locationAreaList, setLocationAreaList] = useState();
  const [pokemonEncounters, setPokemonEncounters] = useState();
  const [pokemonEncountersOtherInfo, setPokemonEncountersOtherInfo] =
    useState();
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selectedLocationArea, setSelectedLocationArea] = useState({});
  const [pokemonDetail, setPokemonDetail] = useState();

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await fetch('https://pokeapi.co/api/v2/location/', {
        method: 'GET',
      });

      let locations = await response.json();

      setLocationList(locations.results);
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation.name) {
      const fetchLocationArea = async () => {
        const response = await fetch(selectedLocation.url, {
          method: 'GET',
        });

        let locationAreas = await response.json();

        setLocationAreaList(locationAreas.areas);
      };

      fetchLocationArea();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedLocationArea.name) {
      const fetchLocationAreaDetail = async () => {
        const response = await fetch(selectedLocationArea.url, {
          method: 'GET',
        });

        let locationDetail = await response.json();
        const finalPokemonEncounters = [];
        const finalPokemonEncountersOtherInfo = { max_chance: 0 };

        locationDetail.pokemon_encounters.forEach((item) => {
          let pokemonEncounter = {
            ...item.pokemon,
            ...item.version_details[0],
          };

          finalPokemonEncountersOtherInfo.max_chance +=
            item.version_details[0].max_chance;

          finalPokemonEncounters.push(pokemonEncounter);
        });

        setPokemonEncounters(finalPokemonEncounters);
        setPokemonEncountersOtherInfo(finalPokemonEncountersOtherInfo);
      };

      fetchLocationAreaDetail();
    }
  }, [selectedLocationArea]);

  const onGatcha = async () => {
    const rand = Math.floor(
      Math.random() * pokemonEncountersOtherInfo.max_chance + 1
    );

    let maxValue = 0;
    for (let i = 0; i < pokemonEncounters.length; i++) {
      maxValue += pokemonEncounters[i].max_chance;
      if (rand <= maxValue) {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonEncounters[i].name}`,
          {
            method: 'GET',
          }
        );

        const pokemon = await response.json();

        setPokemonDetail(pokemon);
        return;
      }
    }
  };

  return (
    <section className="section-container">
      <p className="font-semibold text-lg">Location</p>
      <div className="grid grid-cols-4 gap-3 mt-3">
        {locationList ? (
          locationList.map((item, index) => (
            <button
              onClick={() => {
                setSelectedLocation(item);
              }}
              className={`px-3 py-2 rounded-lg border border-gray-200 ${
                selectedLocation.name === item.name &&
                'border border-blue-500 bg-blue-50'
              }`}
              key={index}
            >
              {item.name}
            </button>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      {selectedLocation.name && (
        <>
          <p className="font-semibold text-lg mt-6">Location Area</p>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {locationAreaList ? (
              locationAreaList.map((item, index) => (
                <button
                  onClick={() => {
                    setSelectedLocationArea(item);
                  }}
                  className={`px-3 py-2 rounded-lg border border-gray-200 ${
                    selectedLocationArea.name === item.name &&
                    'border border-blue-500 bg-blue-50'
                  }`}
                  key={index}
                >
                  {item.name}
                </button>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </>
      )}

      {selectedLocationArea.name && (
        <>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded-lg mt-8"
            onClick={() => {
              onGatcha();
            }}
          >
            Gatcha
          </button>
        </>
      )}

      {pokemonDetail && (
        <div className="mt-4 mb-8 flex flex-start items-start flex-col">
          <p className="mb-3">You have received</p>
          <div className="p-2 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
            <Image
              alt="sprite-image"
              width={100}
              height={100}
              sizes="100vw"
              src={pokemonDetail.sprites['front_default']}
            />
            <p className="text-center">{pokemonDetail.name}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gatcha;
