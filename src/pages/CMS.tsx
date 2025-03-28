import { useState } from "react";
import axios from "axios";
import * as cheerio from "cheerio";

const CMS = () => {
  const [url, setUrl] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchHtml = async () => {
    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });
      const $ = cheerio.load(response.data);
      const cleanedHtml = $("body").html();
      setHtml(cleanedHtml || "No content found");
    } catch (error) {
      console.error("Error fetching the page:", error);
      setHtml("Failed to load content.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <input
        type="text"
        className="border p-2 w-full"
        placeholder="Enter URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={fetchHtml}
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch HTML"}
      </button>
      <iframe src="view-source:https://www.revolut.com/" ></iframe>
      <div className="mt-4 border p-4 bg-gray-100">
        <pre className="whitespace-pre-wrap text-sm">{html}</pre>
      </div>
    </div>
  );
};

export default CMS;
