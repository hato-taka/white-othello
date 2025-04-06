import Roulette from "./Roulette";

export default function Home() {
  const items = [
    "46円",
    "460円",
    "4,600円",
  ]
  return (
    <>
      <Roulette items={items} />
    </>
  );
}
