import React, {  useState } from "react";
import css from "../styles/second/SecondPage.module.css";
import styles from "../styles/data/Data.module.css";

import Link from "next/link";
import Sidebar from "./sidebar";
import { slide as Menu } from "react-burger-menu";
import "react-open-weather-widget/lib/css/ReactWeather.css";
import "bootstrap/dist/css/bootstrap.css";

import { useRouter } from "next/router";
import Doth from "./components/doth";
import { layer_names } from "../layerNames";
import Range from "./components/range";
import { isoCountries } from "../countries";
import Loader2 from "./loader/Loader2";

import Slider from "./components/slider";
import fullArray from "../utils/data";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCountryName(countryCode) {
  if (isoCountries.hasOwnProperty(countryCode)) {
    return isoCountries[countryCode];
  } else {
    return countryCode;
  }
}

function parsePlural(label) {
  var sb_single = new Array("");
  var sb_plural = new Array("");
  var spaces = 0;
  for (var i = 0; i < label.length; i++) {
    var ch = label.charAt(i);
    if (ch != "[") {
      sb_single.push(ch);
      sb_plural.push(ch);
      if (ch == " ") {
        spaces++;
      } else {
        spaces = 0;
      }
    } else {
      var sb = new Array("");
      var j = i + 1;
      for (; j < label.length; j++) {
        ch = label.charAt(j);
        if (ch == "]") break;
        sb.push(ch);
      }
      var len = j - i - 1;
      i = sb_plural.length;
      sb_plural.splice(Math.max(0, i - len), len);
      sb_plural.push(sb.join(""));
      if (spaces != 0) {
        i = sb_single.length;
        sb_single.splice(Math.max(0, i - spaces), spaces);
      }
      i = j;
    }
  }
  return {
    single: capitalizeFirstLetter(sb_single.join("")),
    plural: sb_plural.join(""),
  };
}

function getCategoryName(kinds) {
  let names = [];
  kinds.split(",").forEach(function (kind) {
    let item = layer_names[kind];
    if (item) names.push(parsePlural(item.n).single);
  });
  return names.join(", ");
}

const SecondPage = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState([]);
  const [data, setData] = useState(false);
  const [radius, setRadius] = useState(1000);
  const [search, setSearch] = useState(false);
  const [prevColApi, setPrevColApi] = useState(false);
  const [cordinats, setCordinants] = useState({});
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const apiKey = "5ae2e3f221c38a28845f05b6de78eb52c36e8f89040073523a3752d4";

  function apiGet(method, query) {
    return new Promise(function (resolve, reject) {
      var otmAPI =
        "https://api.opentripmap.com/0.1/en/places/" +
        method +
        "?apikey=" +
        apiKey;
      if (query !== undefined) {
        otmAPI += "&" + query;
      }
      fetch(otmAPI)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
          setPrevColApi(true);
          setData(true);
        })
        .catch(function (err) {
          console.log("Fetch Error :-S", err);
        });
    });
  }

  const pageLength = 5;
  let offset = 0;
  let lon = 0;
  let lat = 0;
  let count = 0;

  function onShowPOI(data) {
    let poi = document.getElementById("poi");
    poi.innerHTML = "";
    if (data.preview) {
      poi.innerHTML += `<img src="${data.preview.source}">`;
    }
    setShowInfoCard(true);
    poi.innerHTML += data.wikipedia_extracts
      ? data.wikipedia_extracts.html
      : data.info
      ? data.info.descr
      : `<span style='font-size: 16px;
      color: black;
      font-weight: 500;
      text-align: center;
      display: block;
      margin-top: 10px;'>Տեղեկություն չկա</span>`;
  }

  function createListItem(item) {
    let a = document.createElement("a");
    a.className = "list-group-item list-group-item-action";
    a.setAttribute("data-id", item.xid);
    a.innerHTML = `<h5 class="list-group-item-heading">${item.name}</h5>
          <p class="list-group-item-text">${getCategoryName(item.kinds)}</p>`;

    a.addEventListener("click", function () {
      document.querySelectorAll("#list a").forEach(function (item) {
        item.classList.remove("active");
      });
      this.classList.add("active");
      let xid = this.getAttribute("data-id");
      apiGet("xid/" + xid).then((data) => onShowPOI(data));
    });
    return a;
  }

  function loadList() {
    apiGet(
      "radius",
      `radius=${radius}&limit=${pageLength}&offset=${offset}&lon=${
        lon || cordinats.lon
      }&lat=${lat || cordinats.lat}&rate=2&format=json`
    ).then(function (data) {
      console.log(data);
      let list = document.getElementById("list");
      if (list) {
        list.innerHTML = "";
        data.forEach((item) => list.appendChild(createListItem(item)));
        let nextBtn = document.getElementById("next_button");
        if (count < offset + pageLength) {
          nextBtn.style.visibility = "hidden";
        } else {
          nextBtn.style.visibility = "visible";
          nextBtn.innerText = `Հաջորդ էջ (${offset + pageLength}-ը ${count}-ից)`;
        }
      }
    });
  }

  function firstLoad() {
    apiGet(
      "radius",
      `radius=${radius}&limit=${pageLength}&offset=${offset}&lon=${lon}&lat=${lat}&rate=2&format=count`
    ).then(function (data) {
      count = data.count;
      offset = 0;
      if (count < 1) {
        setShowInfoCard(false);
      }
      const infoElement = document.getElementById("info");
      if (infoElement) {
        infoElement.innerHTML += `<p style = 'color:white;'> գտնվել է <span style='font-size:16px;color:black;font-weight: 500;'>${count}</span> օբյեկտներ, ${radius}մ շառավղով</p>`;
      }
      loadList();
    });
  }

  const handleSearch = () => {
    apiGet("geoname", "name=" + inputValue).then(function (data) {
      let message = "Տարածաշրջանի անվանումը չի հայտնաբերվել";
      if (data.status == "OK") {
        message = data.name + ", " + getCountryName(data.country);
        lon = data.lon;
        lat = data.lat;
        setCordinants({ lat, lon });
        firstLoad();
      }
      const infoElement = document.getElementById("info");
      if (infoElement) {
        infoElement.innerHTML = `<p  style ='color:white;'>${message}</p>`;
      }
      setData(false);
    });

    setSearch(true);
    setTimeout(() => {
      setSearch(false);
    }, 1000);

    const lowercaseQuery = inputValue.toLowerCase();
    const results = fullArray.reduce((acc, placeType) => {
      const filteredPlaces = placeType.regions.flatMap((region) =>
        Object.values(region).flatMap((places) =>
          Array.isArray(places)
            ? places.filter((place) =>
                place.name.toLowerCase().includes(lowercaseQuery)
              )
            : []
        )
      );
      if (filteredPlaces.length > 0) {
        acc.push({ type: placeType.type, places: filteredPlaces });
      }
      return acc;
    }, []);
    setSearchResults(results);
  };

  // useEffect(() => {
  //   if (inputValue.length > 0) {
  //     handleSearch();
  //   }
  // }, [inputValue]);

  const newLocal = "col-12 col-lg-12";
  return (
    <div className={css.main}>
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
          {/*<Euro />*/}

          <Link href="/news">Նորություններ</Link>
        </div>
      </Menu>

      <div className={css.secondPage}>
        <div className={css.bg}>
          <div className={css.bgContainer}>
            <div style={{ height: "50px"}}>
               <img style={{height:'800%', marginTop:'20px'}} src={"./images/discover-logo.svg"} alt="search" />
            </div>
            <div className={css.firstSearchBlock}>
              <input
                onInput={({ target }) => setInputValue(target.value)}
                type="text"
                placeholder={"Մուտքագրեք տարածաշրջանը"}
              />
              <button
                className={css.searchButton}
                onClick={() => {
                  handleSearch();
                }}
              >
                {!search ? <div>Որոնել</div> : <Loader2 />}
              </button>
              {/* <div className={css.inputStyles}></div> */}
            </div>

            <div className={css.secondSearchBlock}>
              <div style={{ fontSize: "14px" }}>Շառավիղ {radius}մ</div>
              <Range onRadiusChange={(e) => setRadius(e.target.value)} />
            </div>
            <div
              style={{
                height: "50%",
                paddingTop: "10px",
                marginBottom: "80px",
              }}
              className={css.map}
            >
              {searchResults.length > 0 ? (
                <div className="container">
                  {/* Displaying search results */}
                  {searchResults.map((result, index) => (
                    <div key={index} className={css.searchResultsContainer}>
                      <h3 className={css.searchResultType}>{result.type}</h3>
                      <ul className={styles.Firstul}>
                        {result.places.map((place, idx) => (
                          <li key={idx} className={styles.Firstli}>
                            <div className={styles.Firstdiv}>
                              <img className={styles.Firstimg} src={place.imgSrc} alt={place.name} />
                              <div className={styles.Firstul}>
                                <h4 className={styles.Firstclass}>{place.name}</h4>
                                <p className={styles.Firstdescription}>{place.description}</p>
                                <p className={styles.Firstadress}>{place.address}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : prevColApi ? (
                <div className="container">
                  <div
                    id="info"
                    className="alert alert-primary"
                    style={{
                      color: "#2a1616",
                      backgroundColor: "#173a54e6",
                      borderColor: "#b6d4fe",
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <Loader2 />
                    </div>
                  </div>
                  <div className="row">
                    <div className={newLocal}>
                      <div id="list" className="list-group"></div>
                      <nav className="text-center">
                        {data && (
                          <button
                            onClick={() => {
                              offset += pageLength;
                              loadList();
                            }}
                            id="next_button"
                            type="button"
                            className="btn btn-primary"
                            style={{
                              background: "rgb(37 70 96 / 95%)",
                              borderColor: "white",
                              marginTop: "10px",
                              borderRadius: "8px",
                            }}
                          >
                            Հաջորդ էջ
                          </button>
                        )}
                      </nav>
                    </div>
                    <div className="col-12 col-lg-12">
                      <div
                        id="poi"
                        className={
                          showInfoCard ? "info-card alert " : "alert d-none"
                        }
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* <div>Գաղափարներ նոր ճամփորդության համար</div> */}
                  <Slider />
                </>
              )}

              {/* <YMaps>
                <Map
                  style={{ with: "80%", height: "75%", paddingTop: "10px" }}
                  defaultState={{ center: position, zoom: 13 }}
                  // instanceRef={(inst) => {
                  //   inst.events.add("click", console.log);
                  // }}
                >
                  <SearchControl sumbit={(events) => console.log(events)} />
                  <Placemark
                    geometry={position}
                    instanceRef={(inst) => {
                      console.log(
                        ":rocket: ~ file: App.js ~ line 22 ~ App ~ inst",
                        inst
                      );
                      inst &&
                        inst.events.add("click", (e) => {
                          console.log(
                            ":rocket: ~ file: App.js ~ line 26 ~ App ~ e",
                            e
                          );
                        });
                    }}
                  />
                  <Circle
                    geometry={[position, radius]}
                    defaultGeometry={[position, RADIUS]}
                    options={{
                      draggable: false,
                      fillColor: "#8998a377",
                      strokeColor: "#8998a3",
                      strokeOpacity: 0.9,
                      strokeWidth: 2,
                    }}
                  />
                </Map>
              </YMaps> */}
            </div>
          </div>
        </div>
        <div className={css.secondPageFooter}>
          <div>
            <img onClick={() => router.back()} src="./images/icons/back.svg" alt=""/>
          </div>
          <div style={{position: "relative"}}>
            <img src="./images/icons/map.svg" alt=""/>
            {router.pathname === "/main" && <Doth left={-6}/>}
          </div>
          <div>
            <Link href="rates">
              <img src="./images/icons/euro.svg" alt=""/>
            </Link>
          </div>
          <div>
            <Link href="/news">
              {/*<News />*/}
              <img src="./images/icons/news.svg" alt=""/>
            </Link>
          </div>
          <span style={{ opacity: "0", width: "20px" }}>
            {/*<Image src={img} alt="list" />*/}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecondPage;
