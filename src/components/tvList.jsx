import React, { useState, useEffect } from "react";
import axios from "axios";
import TvBox from "./tvBox";
import m3u from "../m3uFile/new.m3u";
//import TheosPlayer from "@aka_theos/react-hls-player";
import ReactHlsPlayer from '@gumlet/react-hls-player';
import documentary from "../images/documentary.png";
import news from "../images/news.png";
import sport from "../images/sport.png";
import music from "../images/music.png";
import movies from "../images/movies.png";
import national from "../images/national.png";
import religion from "../images/religion.png";
import others from "../images/others.png";
import Footer from "./footer";
import Navbar from "./navbar";
//import { Adsense } from "@ctrl/react-adsense";

function TvList() {
  const [originalChannels, setOriginalChannels] = useState([]);
  const [tvChannels, setTvChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({});
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(m3u);
        const { channels, categories } = parseM3UContent(response.data);
        setTvChannels(channels);
        setOriginalChannels(channels);
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [isLightMode, setLightMode] = useState(true);

  const handleToggle = () => {
    setLightMode((prevMode) => !prevMode);
  };

  const parseM3UContent = (m3uContent) => {
    const channels = [];
    const categories = new Set();
    const lines = m3uContent.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("#EXTINF:")) {
        const nameMatch = line.match(/tvg-name="([^"]+)"/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const categoryMatch = line.match(/group-title="([^"]+)"/);

        if (nameMatch) {
          const name = nameMatch[1];
          const logo = logoMatch ? logoMatch[1] : "";
          const streamUrl = lines[i + 1].trim();
          const category = categoryMatch ? categoryMatch[1] : "Uncategorized";

          channels.push({ name, logo, streamUrl, category });
          categories.add(category);
        }
      }
    }

    return { channels, categories: Array.from(categories) };
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
  };

  const handleCategorySelect = (category) => {
    const filteredChannels = originalChannels.filter(
      (channel) => channel.category === category
    );
    setTvChannels(filteredChannels);
  };

  return (
    <>
      <div className="h-[100vh]">
        <Navbar handleToggle={handleToggle} isLightMode={isLightMode} />

        <div className="block md:flex">
          <div
            className={`flex w-[100%] md:w-[20%] ${
              isLightMode ? "light-mode" : "dark-mode"
            }`}
          >
            <div
              className={`flex flex-wrap  ${
                isLightMode ? "bg-gray" : "bg-darkBg"
              } max-h-[56vh] md:max-h-[90vh] h-[100%]  overflow-auto items-center justify-center `}
            >
              <div className="categories flex max-[768px]:w-full max-[768px]:items-center max-[768px]:justify-center backdrop-blur-sm sticky top-0 z-10 overflow-y-scroll">
                {categories.map((category, index) => (
                  <button
                    className={`p-2 ${
                      isLightMode
                        ? "bg-white text-black"
                        : "bg-darkBox text-white "
                    } rounded-xl m-2`}
                    key={index}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex flex-col items-center justify-around">
                      {category === "DOCUMENTARY" && (
                        <img src={documentary} className="w-8" alt={category} />
                      )}
                      {category === "NEWS" && (
                        <img src={news} className="w-8" alt={category} />
                      )}
                      {category === "SPORT" && (
                        <img src={sport} className="w-8" alt={category} />
                      )}
			{category === "RELIGION" && (
                        <img src={religion} className="w-8" alt={category} />
                      )}    
                      {category === "MUSIC" && (
                        <img src={music} className="w-8" alt={category} />
                      )}
			    {category === "MOVIES" && (
                        <img src={movies} className="w-8" alt={category} />
                      )}
                      {category === "NATIONAL" && (
                        <img src={national} className="w-8" alt={category} />
                      )}
					  {category === "OTHERS" && (
                        <img src={others} className="w-8" alt={category} />
                      )}
                      <h1 className="text-xs mt-2 font-semibold">{category}</h1>
                    </div>
                  </button>
                ))}
              </div>
              {tvChannels.map((channel, index) => (
                <TvBox
                  isLightMode={isLightMode}
                  key={index}
                  name={channel.name}
                  icon={channel.logo}
                  src={channel.streamUrl}
                  onSelect={() => handleChannelSelect(channel)}
                />
              ))}
            </div>
          </div>
          <div
            className={`flex h-[100%] w-[100%] md:w-[80%] ${
              isLightMode ? "light-mode" : "dark-mode"
            }`}
          >
            <TheosPlayer
              height={"100%"}
              width="100%"
              autoPlay={true}
              src={
                selectedChannel.streamUrl
                  ? selectedChannel.streamUrl
                  : "https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/bollywood-hd/43e99595-3ab3-4f82-a828-0d32dc308c98/0.m3u8"
              }
              title={selectedChannel.name ? selectedChannel.name : "BOLLYWOOD HD"}
            />
          </div>
        </div>

        <Footer isLightMode={isLightMode} />
      </div>
    </>
  );
}

export default TvList;
