import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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

const blogsToSeed = [
  {
    title: "Japan: The Art of Miyuki Beads ✨",
    category: "Craftsmanship",
    author: "Velouraz Editorial Team",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Japan is known for its love of simplicity, precision and detail. Discover the fascinating history and craftsmanship of Miyuki glass seed beads born in Hiroshima.",
    content: `Japan is known for its love of simplicity, precision and detail. These qualities come beautifully together in one of its most fascinating contributions to jewellery — Miyuki beads.

Born in Hiroshima in the 1930s, MIYUKI has spent decades perfecting glass seed beads, developing an extraordinary range of colours, shapes, sizes and finishes. Today, its beads are used by designers and artisans around the world.

🌸 The Beauty Is in the Detail
Miyuki beads may be tiny, but their precision is what makes them extraordinary. From classic round seed beads to the distinctive Delica cylinder beads and two-hole TILA beads, each shape opens up new possibilities for jewellery design.

🎨 A World of Colour
One of the most captivating qualities of Miyuki beads is their incredible variety. Subtle neutrals, delicate pastels, rich metallics and vibrant shades can be combined to create jewellery that feels playful, elegant or completely minimal.

🇯🇵 Japanese Precision, Global Inspiration
Miyuki’s glass beads are produced with a strong focus on consistency and craftsmanship. Their precision allows designers to create detailed patterns, clean geometric designs and intricate beadwork that would be difficult to achieve with ordinary beads.

✨ The Centre of Attraction
The beauty of Miyuki jewellery is that the smallest details can become the main attraction.

A single carefully designed bracelet, necklace or pair of earrings can add colour and personality without overwhelming the look.
That is the essence of Japanese-inspired jewellery — precision, balance and beauty in the smallest details.
Sometimes, the tiniest bead creates the biggest impression.
Japanese-inspired styling is about balance. Let one beautiful detail stand out rather than wearing everything at once.`
  },
  {
    title: "Paris: The World Capital of Luxury Jewellery ✨",
    category: "Trends",
    author: "Velouraz Editorial Team",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200",
    excerpt: "For generations, Paris and Place Vendôme have been at the heart of haute joaillerie. Explore legendary houses like Cartier, Van Cleef & Arpels, Boucheron, and Chaumet.",
    content: `When we think of luxury jewellery, one city immediately comes to mind — Paris.
For generations, Paris has been at the heart of jewellery design, craftsmanship and haute joaillerie. At the centre of this world is Place Vendôme, one of the most famous addresses in the jewellery industry. The square and nearby Rue de la Paix are home to legendary jewellery houses including Cartier, Van Cleef & Arpels, Boucheron, Chaumet, Bulgari and Dior Joaillerie.

💎 Cartier — The Icon of Parisian Jewellery
Cartier has been creating jewellery since 1847 and has become one of the most recognised names in luxury jewellery.

🌸 Van Cleef & Arpels — Jewellery Inspired by Nature
Van Cleef & Arpels opened its first boutique at 22 Place Vendôme in 1906.
One of its most recognizable creations is the Alhambra, introduced in 1968 and inspired by the idea of luck.

🐍 Boucheron — A Pioneer of Place Vendôme
Boucheron became the first jeweller to establish itself on Place Vendôme in 1893, helping transform the area into the legendary jewellery destination it is today.

👑 Chaumet — Jewellery Fit for Royalty
Chaumet’s history goes back to 1780 and is deeply connected with French history. The Maison became the official jeweller to Empress Joséphine and became particularly renowned for its tiaras and royal jewellery.`
  },
  {
    title: "India: The Soul of Silver Jewellery ✨",
    category: "Craftsmanship",
    author: "Velouraz Editorial Team",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1611591475281-8d995e85764d?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Behind India's grand jewellery traditions lies a metal with an equally fascinating story. Explore the heritage of silver from Rajasthan to Odisha's Tarakasi filigree.",
    content: `When we think of Indian jewellery, gold often takes centre stage. But behind India’s grand jewellery traditions lies another metal with an equally fascinating story — silver.
For centuries, silver jewellery has been part of India’s cultural and artistic heritage. From royal ornaments to tribal jewellery and everyday adornments, silver has travelled across generations and regions, taking on a different character in every part of the country.

💎 Rajasthan — Silver with a Royal Soul
Rajasthan is known for bold, detailed jewellery where traditional motifs, intricate carving and oxidised finishes create a distinctive heritage look. Silver jewellery here reflects the colours, architecture and rich craftsmanship of the region.

🌿 Odisha — The Art of Silver Filigree
Cuttack is famous for Tarakasi, its delicate silver filigree tradition. Artisans transform fine silver wires into intricate, lace-like patterns, creating jewellery that looks almost impossibly light and detailed.

🌙 Silver Across India
From Himachal Pradesh and Maharashtra to Gujarat and South India, silver appears in anklets, bangles, rings, necklaces and traditional ornaments. Floral patterns, geometric details, nature-inspired motifs and regional symbols make each piece tell its own story.

✨ Why Silver Still Matters
What makes Indian silver jewellery special is its ability to feel both traditional and effortlessly modern. A centuries-old craft can become a delicate everyday ring, a statement bracelet or a contemporary necklace without losing its connection to Indian artistry.

Silver is not simply a metal in India — it is a part of the country’s craftsmanship, culture and history.
And that is what makes Indian silver jewelry timeless.`
  },
  {
    title: "Pearls of the Korean Seas: A Quiet Legacy of Ocean-Born Beauty ✨",
    category: "Style Guide",
    author: "Velouraz Editorial Team",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200",
    excerpt: "Discover the quiet history of ocean-born Akoya saltwater pearls around Jeju Island, South Korea, and what gives these sea treasures their mirror-like lustre.",
    content: `Pearls have always carried a sense of elegance, but some of the most fascinating stories come from the quiet waters of Asia. South Korea has its own history with saltwater Akoya pearls, particularly around the waters of Jeju Island.

Unlike freshwater pearls, which are mainly cultivated in lakes and ponds, Akoya pearls are born in the sea. They are grown inside the Pinctada fucata oyster and are celebrated for their remarkably bright, mirror-like lustre and refined round shapes.

Jeju’s Pearl Story
South Korea was one of the countries where Akoya pearl cultivation was introduced with Japanese expertise. Pearl farming developed around Jeju Island, although the industry later declined as production became less commercially competitive.

This makes Korean Akoya pearls an interesting piece of pearl history rather than simply a mass-production centre.

What Makes Akoya Pearls Special?
Akoya pearls are generally smaller than South Sea pearls, but their strength lies in their exceptional lustre. Their nacre is made up of very fine, tightly packed layers, creating the sharp reflection often described as a “mirror-like” glow.

They are typically found in elegant white, cream and silver tones, sometimes with beautiful pink or rose overtones.

A Fascinating New Pearl Fact
Here is something particularly relevant to jewellery lovers today: some modern freshwater pearls can now look remarkably similar to Akoya pearls.

In 2026, the Gemological Institute of America highlighted the growing popularity of small, bead-nucleated freshwater pearls from China that can have round shapes, bright white colour and impressive lustre—qualities traditionally associated with Akoya pearls.

But they are not “freshwater Akoya.” Akoya refers to a specific saltwater pearl type, so the origin and growing environment matter—not just how the pearl looks.

From Japan to Korea and Beyond
Japan remains the name most strongly associated with Akoya pearls, with famous pearl-growing regions including Mie, Ehime and Nagasaki. South Korea, China and Vietnam have also had Akoya cultivation, showing how the pearl travelled across East Asian waters and cultures.

Perhaps that is what makes pearls so captivating: their beauty is shaped not only by the oyster, but by the sea, the climate and the place in which they grow.
For jewellery, an ocean-born pearl is more than an accessory—it is a tiny piece of the sea, transformed into something timeless.`
  }
];

async function seed() {
  console.log("Seeding 4 blogs into Firestore...");
  for (const blog of blogsToSeed) {
    try {
      const docRef = await addDoc(collection(db, "blogs"), {
        ...blog,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Successfully added: "${blog.title}" with ID: ${docRef.id}`);
    } catch (err) {
      console.error(`Failed to add "${blog.title}":`, err);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
