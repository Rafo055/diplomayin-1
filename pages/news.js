import React from "react";
import { mockData } from "../mockData";
import moment from "moment";
import Link from "next/link";
import Sidebar from "./sidebar";
import { slide as Menu } from "react-burger-menu";
import Doth from "./components/doth";
import { useRouter } from "next/router";
import css from "../styles/second/SecondPage.module.css";

console.log(mockData);
const News = () => {
  const router = useRouter();

  return (
    <div style={{ background: "#143047db" }}>
      <Sidebar outerContainerId={"App"} />
      <Menu right>
          <div
              style={{
                  fontSize: "15px",
                  display: "flex",
                  top: "140px",
                  position: "absolute",
              }}
              className="menu-item"
          >
              <img src="./images/icons/euro.svg" alt=""/>

              <Link href="/main">Գլխավոր</Link>
          </div>
          <div
              style={{
                  fontSize: "15px",
            display: "flex",
            top: "190px",
            position: "absolute",
          }}
          className="menu-item"
        >
              <img src="./images/icons/euro.svg" alt=""/>


              <Link href="/main">Արտարժույթի փոխանակում</Link>
        </div>
        <div
          style={{
            fontSize: "15px",
            display: "flex",
            top: "240px",
            position: "absolute",
          }}
          id="about"
          className="menu-item"
          href="/news"
        >
            <img src="./images/icons/euro.svg" alt=""/>
            <Link href="/news">Նորություններ</Link>
        </div>
      </Menu>
      <h3
        style={{
          paddingTop: "10px",
          textAlign: "center",
          color: "red",
          margin: "0",
        }}
      >
        N E W S ({mockData.totalResults})
      </h3>

      {mockData.articles.map((section) => (
        // eslint-disable-next-line react/jsx-key
        <div className="news">
          <div className="news__img">
            <img
              src={section.urlToImage}
              alt="news"
              className="news__img-img"
            />
          </div>
          <div className="news__info">
            <div className="top_part">
              <div className="warn mark top_part-level"></div>
              <div className=" mark time">
                {moment(section.publishedAt).format("MMM Do YY")}
              </div>
            </div>

            <div className="title">{section.title}</div>
            <div className="context">{section.description}</div>
            <div className="news__info-3 author">
              <span>
                  <img src="./images/pencil.svg" alt=""/>
                {section.author}
              </span>
              {/* <span className="">Ruben Abelyan</span> */}

              <div className="center">
                  <img src="./images/share.svg" alt=""/>
                <span>{Math.floor(Math.random() * 100)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className={css.secondPageFooter}>
          <div>
              <img onClick={() => router.back()} src="./images/icons/back.svg" alt=""/>
          </div>
          <div style={{position: "relative"}}>
              <Link href="main">
                  <img src="./images/icons/map.svg" alt=""/>
              </Link>
          </div>
          <div>
              <Link href="rates">
                  <img src="./images/icons/euro.svg" alt=""/>
              </Link>
          </div>
          <div style={{position: "relative"}}>
              <img src="./images/icons/news.svg" alt=""/>
              <Doth left={-6}/>
          </div>

          <span style={{opacity: "0", width: "20px" }}>
          <img src={"./images/search_3.png"} alt="list" />
        </span>
      </div>
    </div>
  );
};

export default News;
