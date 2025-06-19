import { useMemo } from "react";
import { useFetchAnimals } from "../hooks/useFetchAnimals";
import AnimalCard from "../components/AnimalCard";

function getRandomElementsFromArray(array, count) {
  const indexes = [];
  const arrayLength = array.length;
  const num = Math.min(count, arrayLength);
  while (indexes.length < num) {
    const randomIndex = Math.floor(Math.random() * arrayLength);
    if (!indexes.includes(randomIndex)) {
      indexes.push(randomIndex);
    }
  }
  return indexes.map((index) => array[index]);
}

export default function Home() {
  const { animals, loading, error } = useFetchAnimals();

  const dailyAnimals = useMemo(() => {
    if (!animals || animals.length === 0) return [];
    return getRandomElementsFromArray(animals, 3);
  }, [animals]);

  return (
    <>
      {/* 主視覺區域 */}
      <div className="hero min-h-96 bg-gradient-to-r rounded-box mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <p className="py-6">
              每一隻毛孩都值得被愛，每一個家庭都值得擁有溫暖的陪伴。
              讓我們一起為牠們找到永遠的家！
            </p>
            <button className="btn">開始尋找毛孩</button>
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
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="skeleton w-96 h-48 rounded-lg"></div>
            <div className="skeleton w-96 h-48 rounded-lg"></div>
            <div className="skeleton w-96 h-48 rounded-lg"></div>
          </div>
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
      <div>
        每一隻毛孩都值得被愛，每一個家庭都值得擁有溫暖的陪伴。讓我們一起為牠們找到永遠的家！
      </div>
    </>
  );
}
