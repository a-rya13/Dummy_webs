// import React, { useState, useEffect } from "react";
// import axios from "axios";

// function Home() {
//   const [websiteName, setWebsiteName] = useState("News Web");
//   const [headers, setHeaders] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [selectedHeader, setSelectedHeader] = useState("");

//   useEffect(() => {
//     const fetchWebsite = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/website");
//         if (res.data?.title) setWebsiteName(res.data.title);
//       } catch (err) {
//         console.error("❌ Error fetching website title:", err.message);
//       }
//     };

//     const fetchHeaders = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/headers");
//         setHeaders(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching headers:", err.message);
//       }
//     };

//     const fetchPosts = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/post");
//         setPosts(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching posts:", err.message);
//       }
//     };

//     fetchWebsite();
//     fetchHeaders();
//     fetchPosts();
//   }, []);

//   const getPostsByCategory = (category) => {
//     const today = new Date();
//     const categoryPosts = posts.filter((p) => p.category === category);

//     const active = categoryPosts.filter((p) => new Date(p.last_date) >= today);
//     const expired = categoryPosts.filter((p) => new Date(p.last_date) < today);

//     return { active, expired };
//   };

//   const { active, expired } = selectedHeader
//     ? getPostsByCategory(selectedHeader)
//     : { active: [], expired: [] };

//   // ✅ Reusable Post Card
//   const PostCard = ({ post, highlight }) => (
//     <div
//       className={`bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700 hover:border-${highlight}-500 transition`}
//     >
//       <h4 className="text-lg font-bold mb-2">{post.title}</h4>
//       <div
//         className="text-gray-300 mb-2"
//         dangerouslySetInnerHTML={{ __html: post.description }}
//       />

//       {/* 🔗 Useful Links */}
//       {post.useful_links?.length > 0 && (
//         <div className="mt-2">
//           <p className="text-sm text-gray-300 font-semibold">Useful Links:</p>
//           <ul className="list-disc list-inside text-blue-400 break-words">
//             {post.useful_links.map((link, idx) => (
//               <li key={idx} className="truncate">
//                 <a
//                   href={link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="hover:underline break-all"
//                 >
//                   {link}
//                 </a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* 📅 Dates + Index */}
//       <p className="text-sm text-gray-400 mt-3 flex flex-wrap gap-3">
//         <span className="bg-green-900/40 text-green-300 px-2 py-1 rounded-md text-xs font-semibold">
//           🟢 Start: {new Date(post.start_date).toLocaleDateString()}
//         </span>
//         <span className="bg-red-900/40 text-red-300 px-2 py-1 rounded-md text-xs font-semibold">
//           🔴 Last: {new Date(post.last_date).toLocaleDateString()}
//         </span>
//         <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs">
//           #️⃣ Index: {post.index}
//         </span>
//       </p>
//     </div>
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
//       {/* Navbar */}
//       <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
//         <h1 className="text-2xl font-bold tracking-wide">{websiteName}</h1>
//         <nav>
//           <ul className="flex gap-6">
//             <li>
//               <button
//                 onClick={() => setSelectedHeader("")}
//                 className="hover:text-yellow-300 transition"
//               >
//                 Home
//               </button>
//             </li>
//             {headers.map((h) => (
//               <li key={h._id}>
//                 <button
//                   onClick={() => setSelectedHeader(h.name)}
//                   className="hover:text-yellow-300 transition"
//                 >
//                   {h.name}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 p-10">
//         <h2 className="text-2xl font-semibold mb-6 text-yellow-300">
//           {selectedHeader
//             ? `Posts under ${selectedHeader}`
//             : "✨ Latest Updates"}
//         </h2>

//         {selectedHeader ? (
//           active.length === 0 && expired.length === 0 ? (
//             <p className="text-gray-400">
//               No posts available for this category.
//             </p>
//           ) : (
//             <div className="space-y-10">
//               {/* Active Posts */}
//               {active.length > 0 && (
//                 <div>
//                   <h3 className="text-xl font-bold text-green-400 mb-4">
//                     ✅ Active Posts
//                   </h3>
//                   <div className="space-y-6">
//                     {active.map((p) => (
//                       <PostCard key={p._id} post={p} highlight="green" />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Expired Posts */}
//               {expired.length > 0 && (
//                 <div>
//                   <h3 className="text-xl font-bold text-red-400 mb-4">
//                     ❌ Expired Posts
//                   </h3>
//                   <div className="space-y-6">
//                     {expired.map((p) => (
//                       <PostCard key={p._id} post={p} highlight="red" />
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* ✅ Post Count */}
//               <p className="mt-6 text-lg font-semibold text-yellow-400">
//                 Total Posts in {selectedHeader}:{" "}
//                 {active.length + expired.length}
//               </p>
//             </div>
//           )
//         ) : (
//           <p className="text-gray-400">
//             Please select a category from the navigation above.
//           </p>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 text-center py-4 border-t border-gray-700">
//         <p>© 2025 {websiteName}. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

// export default Home;
// Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [websiteName, setWebsiteName] = useState("News Web");
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedHeaderId, setSelectedHeaderId] = useState("");
  const [selectedHeaderName, setSelectedHeaderName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");

      try {
        const [siteRes, headersRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/website`),
          axios.get(`${API_BASE_URL}/api/headers`),
          axios.get(`${API_BASE_URL}/api/post`),
        ]);

        if (siteRes.data?.title) setWebsiteName(siteRes.data.title);
        setHeaders(Array.isArray(headersRes.data) ? headersRes.data : []);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        setError("Failed to load content. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getActivePostsByCategory = (categoryId) => {
    const today = new Date();
    const categoryPosts = posts.filter((p) => p.category === categoryId);
    return categoryPosts.filter((p) => new Date(p.last_date) >= today);
  };

  const active = selectedHeaderId
    ? getActivePostsByCategory(selectedHeaderId)
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold tracking-wide">{websiteName}</h1>
        <nav>
          <ul className="flex gap-4 items-center">
            <li>
              <button
                onClick={() => {
                  setSelectedHeaderId("");
                  setSelectedHeaderName("");
                }}
                className={`hover:text-yellow-300 transition ${
                  selectedHeaderId === "" ? "underline" : ""
                }`}
              >
                Home
              </button>
            </li>
            {headers.map((h) => (
              <li key={h._id}>
                <button
                  onClick={() => {
                    setSelectedHeaderId(h._id);
                    setSelectedHeaderName(h.name);
                  }}
                  className={`hover:text-yellow-300 transition ${
                    selectedHeaderId === h._id ? "underline" : ""
                  }`}
                >
                  {h.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-300">
          {selectedHeaderId
            ? `Posts under ${selectedHeaderName}`
            : "✨ Latest Updates"}
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading content...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : selectedHeaderId ? (
          active.length === 0 ? (
            <p className="text-gray-400">
              No posts available for this category.
            </p>
          ) : (
            <ul className="space-y-3">
              {active.map((p) => (
                <li key={p._id}>
                  <Link
                    to={`/post/${p._id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          <div>
            <p className="text-gray-400 mb-6">
              Please select a category from the navigation above.
            </p>

            {/* Recent Active Posts */}
            <h3 className="text-xl font-bold text-yellow-300 mb-4">
              Recent Posts
            </h3>
            <ul className="space-y-3">
              {posts
                .filter((p) => new Date(p.last_date) >= new Date())
                .slice(0, 9)
                .map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/post/${p._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-400 text-center py-4 border-t border-gray-700">
        <p>© 2025 {websiteName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
