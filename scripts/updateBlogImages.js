import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKTCwXYM5BlOT8uhYvB5H3Bk4UiIX5aN4",
  authDomain: "velouraz-e708a.firebaseapp.com",
  projectId: "velouraz-e708a",
  storageBucket: "velouraz-e708a.firebasestorage.app",
  messagingSenderId: "427246020538",
  appId: "1:427246020538:web:f709bc8574fbcfe6061f83",
  measurementId: "G-6NH5MQ96B2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const imageMapping = [
  { keyword: "Japan", image: "/img/blogs/japan-miyuki.png" },
  { keyword: "Paris", image: "/img/blogs/paris-luxury.png" },
  { keyword: "India", image: "/img/blogs/india-silver.png" },
  { keyword: "Korean", image: "/img/blogs/korea-pearls.png" },
];

async function updateImages() {
  console.log("Fetching blogs from Firestore...");
  const snap = await getDocs(collection(db, "blogs"));
  
  for (const blogDoc of snap.docs) {
    const data = blogDoc.data();
    const title = data.title || "";

    for (const mapping of imageMapping) {
      if (title.includes(mapping.keyword)) {
        await updateDoc(doc(db, "blogs", blogDoc.id), {
          image: mapping.image
        });
        console.log(`Updated blog "${title}" (${blogDoc.id}) with image: ${mapping.image}`);
        break;
      }
    }
  }

  console.log("All blog images updated successfully!");
  process.exit(0);
}

updateImages();
