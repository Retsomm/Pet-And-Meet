import AnimalCard from "../components/AnimalCard";
import { useUserCollects } from "../hooks/useUserCollects";
import useAuthStore from "../stores/useAuthStore";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import { useSyncFavoritesWithAPI } from "../hooks/useSyncFavoritesWithAPI";

export default function Collect() {
  const { isLoggedIn } = useAuthStore();
  const { collects, loading } = useUserCollects();
  const { animals, loading: animalsLoading } = useFetchAnimals();

  // 同步移除不存在於 API 的收藏
  useSyncFavoritesWithAPI(animals);

  // 只顯示 API 仍存在的收藏
  const validCollects =
    collects?.filter((c) => animals.some((a) => a.animal_id === c.animal_id)) ||
    [];

  if (!isLoggedIn) {
    return (
      <div className="w-full mx-auto flex flex-col items-center mt-10 h-screen justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">我的收藏</h2>
        <div className="text-center">請先登入</div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto h-screen justify-center mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center sm:mt-5">我的收藏</h2>
      {loading || animalsLoading ? (
        <div className="flex justify-center items-center h-40">
          <span className="loading loading-infinity loading-xl"></span>
        </div>
      ) : validCollects.length === 0 ? (
        <div className="text-center">尚未收藏任何毛孩</div>
      ) : (
        <div className="flex flex-wrap justify-center items-center">
          {validCollects.map((animal) => (
            <AnimalCard
              key={animal.id || animal.animal_id}
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
