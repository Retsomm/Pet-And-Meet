import { useMemo } from "react";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import AnimalCard from "../components/AnimalCard";
import { useNavigate } from "react-router";
import AnimalSkeleton from "../components/AnimalSkeleton";
function getRandomElementsFromArray(array, count) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交換元素
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
const AnimalSkeletons = ({ count = 3 }) => (
  <div className="flex flex-wrap justify-center items-center gap-3 m-3 px-4">
    {Array.from({ length: count }).map((_, idx) => (
      <AnimalSkeleton key={idx} />
    ))}
  </div>
);
export default function Home() {
  const { animals, loading, error } = useFetchAnimals();
  const navigate = useNavigate();
  const dailyAnimals = useMemo(() => {
    if (!animals || animals.length === 0) return [];
    return getRandomElementsFromArray(animals, 3);
  }, [animals]);

  return (
    <>
      {/* 主視覺區域 */}
      <div className="hero sm:min-h-80 bg-gradient-to-r rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <p className="py-6">遇見生命中的小夥伴，讓愛與陪伴延續</p>
            <button className="btn" onClick={() => navigate("/data")}>
              開始尋找毛孩
            </button>
          </div>
        </div>
      </div>

      {/* 使用流程時間軸 */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center">🏠 領養流程</h2>
        <ul className="timeline timeline-vertical">
          <li>
            <div className="timeline-middle">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                🔍
              </div>
            </div>
            <div className="timeline-end timeline-box">
              <div className="font-semibold">瀏覽毛孩資料</div>
              <div className="text-sm">查看可愛的毛孩們等待新家</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="w-8 h-8rounded-full flex items-center justify-center">
                ❤️
              </div>
            </div>
            <div className="timeline-end timeline-box">
              <div className="font-semibold">加入我的最愛</div>
              <div className="text-sm">收藏心儀的毛孩資料</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                📞
              </div>
            </div>
            <div className="timeline-end timeline-box">
              <div className="font-semibold">聯絡收容所</div>
              <div className="text-sm">與收容所預約見面時間</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="w-8 h-8rounded-full flex items-center justify-center">
                🏡
              </div>
            </div>
            <div className="timeline-end timeline-box">
              <div className="font-semibold">前往收容所</div>
              <div className="text-sm">親自到收容所與毛孩相見</div>
            </div>
            <hr />
          </li>
          <li>
            <hr />
            <div className="timeline-middle">
              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                🎉
              </div>
            </div>
            <div className="timeline-end timeline-box ">
              <div className="font-semibold ">完成領養手續</div>
              <div className="text-sm ">帶毛孩回到溫暖的新家</div>
            </div>
          </li>
        </ul>
      </div>

      {/* 每日推薦區域 */}
      <div className="mb-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center">今日毛孩</h2>
        {loading ? (
          <AnimalSkeletons count={3} />
        ) : error ? (
          <div className="text-center text-red-500">資料載入失敗</div>
        ) : (
          <div className="flex flex-wrap justify-center">
            {dailyAnimals.map((animal) => (
              <AnimalCard key={animal.animal_id} animal={animal} from="/" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
