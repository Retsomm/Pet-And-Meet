import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getAuth } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import AnimalCard from "../components/AnimalCard"; // 這裡引入 AnimalCard

export default function Collect() {
  const [collects, setCollects] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const collectsRef = ref(db, `users/${user.uid}/collects`);
    const unsubscribe = onValue(collectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCollects(
          Object.entries(data).map(([id, value]) => ({ id, ...value }))
        );
      } else {
        setCollects([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center mt-10">我的收藏</h2>
      {collects.length === 0 ? (
        <div>尚未收藏任何毛孩</div>
      ) : (
        <div className="flex flex-wrap justify-center items-center">
          {collects.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} from="collect" />
          ))}
        </div>
      )}
    </div>
  );
}
