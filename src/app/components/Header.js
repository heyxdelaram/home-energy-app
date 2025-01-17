// components/Header.js
export default function Header({ name, date }) {
  return (
    <header className="p-6 bg-white shadow">
      <h1 className="text-2xl font-semibold">Hello, {name}</h1>
      <p className="text-gray-500">Track your energy consumption</p>
      <p className="text-gray-700 font-medium">{date}</p>
    </header>
  );
}
