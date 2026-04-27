import { Link, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <div className="p-8">
      <p className="mt-4 text-lg">
        Oferta de programas, para ir al dashboard:
        <Link to="/dashboard" className="ml-4 text-blue-500 hover:underline">
          Click aquí!!
        </Link>
      </p>
    </div>
  );
}
