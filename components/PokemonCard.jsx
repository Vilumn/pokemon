import Image from 'next/image';
import Link from 'next/link';

const PokemonCard = ({ data }) => {
  return (
    <Link
      href={`/${data.name}`}
      className="flex items-center border border-gray-200 shadow-sm hover:shadow-blue-100 rounded-lg space-x-2 transition hover:shadow-md"
    >
      <Image
        src={data.sprites.front_default}
        alt={data.name}
        width={64}
        height={64}
      />
      <p>{data.name}</p>
    </Link>
  );
};

export default PokemonCard;
