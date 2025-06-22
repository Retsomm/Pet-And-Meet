import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import useAuthStore from "../stores/useAuthStore";

export default function Collect() {
  const { isLoggedIn } = useAuthStore();
  const { collects, loading } = useUserCollects();

  if (!isLoggedIn) {
    return (
      <div className="w-full mx-auto flex flex-col items-center  h-screen justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">我的收藏</h2>
        <div className="text-center">請先登入</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen justify-center">
      <h2 className="text-2xl font-bold mb-4 text-center sm:mt-5">我的收藏</h2>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : collects && collects.length === 0 ? (
        <div className="text-center">尚未收藏任何毛孩</div>
      ) : (
        <div className="flex flex-wrap justify-center items-center">
          {collects.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              isCollected={true}
              from="collect"
            />
          ))}
        </div>
      )}
    </div>
  );
}
