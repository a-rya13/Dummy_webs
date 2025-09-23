import React, { useState } from "react";
import Header from "../components/Header";
import ManageHeaders from "../components/ManageHeaders";
import ManagePosts from "../components/ManagePosts";
import WebsiteSettings from "../components/WebsiteSettings";

function AdminDashboard() {
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans">
      <Header />
      <main className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ManageHeaders headers={headers} setHeaders={setHeaders} />
        <ManagePosts headers={headers} posts={posts} setPosts={setPosts} />
        <WebsiteSettings />
      </main>
    </div>
  );
}

export default AdminDashboard;
