/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import css from "../styles/second/SecondPage.module.css";
import Link from "next/link";
import Doth from "./components/doth";
import Sidebar from "./sidebar";
import { slide as Menu } from "react-burger-menu";

const rates = () => {
  const router = useRouter();

  const [rate, setRate] = useState({});
  const [inputValue, setInputValue] = useState(1);
  const [currencyList, setCurrencyList] = useState([]);
  const [result, setResult] = useState(1);
  const [unit, setUnit] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("Bitcoin");
  const [fromCurrency, setFromCurrency] = useState("Bitcoin");

  const fetchData = async () => {
    try {
      const response = await fetch(
          "https://api.coingecko.com/api/v3/exchange_rates"
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Error: ${response.status}`);
      }

      const responseData = await response.json();
      const objectValues = Object.values(responseData.rates);
      setCurrencyList(objectValues);
      setFromCurrency(objectValues[0].name);
      setToCurrency(objectValues[0].name);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const callback = useCallback(() => {
    const calculate = () => {
      const obj1 = currencyList.find((cur) => cur.name === fromCurrency);
      let xToBTC = obj1.value;
      let BTCtoX = 1 / xToBTC;
      let obj2 = currencyList.find((cur) => cur.name === toCurrency);
      let yToBTC = obj2.value;
      let calc = BTCtoX * yToBTC * inputValue;
      let unit = obj2.unit;
      let result = { calc, unit };
      return result;
    };
    return calculate();
  }, [currencyList, fromCurrency, toCurrency, inputValue]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
            "https://api.currencyapi.com/v3/latest?apikey=cur_live_31pxGGWDwy9TaMgR065mKodSg75bLs3rm0Lnpien"
        );
        const data = await response.json();
        setRate(data.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRates();

    if (currencyList.length !== 0) {
      const { calc, unit } = callback();
      setUnit(unit);
      setResult(calc);
    }
  }, [callback, currencyList.length]);

  if (!rate) return null;
  console.log(router.pathname);

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
            <img src="./images/icons/euro.svg" alt=""/>
            <Link href="/news">Նորություններ</Link>
          </div>
        </Menu>
        <div
            className={css.secondPage}
            style={{ background: "#1a3a55e6" }}
        >
          <div>
            <h3
                style={{
                  textAlign: "center",
                  color: "white",
                  margin: "0",
                  paddingBottom: "1rem",
                }}
            >
              E X C H A N G E
            </h3>
            <div style={{ padding: "1rem" }}>
              <table style={{ width: "100%", textAlign: "center" }}>
                <thead>
                <tr style={{ fontSize: "12px" }}>
                  <th
                      style={{
                        padding: "0 10px",
                        backgroundColor: "#84b1d0",
                        fontWeight: "100",
                      }}
                  >
                    Country
                  </th>
                  <th
                      style={{
                        padding: "0 10px",
                        backgroundColor: "#84b1d0",
                        fontWeight: "100",
                      }}
                  >
                    ISO(կոդ)
                  </th>
                  <th
                      style={{
                        padding: "0 10px",
                        backgroundColor: "#84b1d0",
                        fontWeight: "100",
                      }}
                  >
                    Արտարժույթ
                  </th>
                  <th
                      style={{
                        padding: "0 10px",
                        backgroundColor: "#84b1d0",
                        fontWeight: "100",
                      }}
                  >
                    Տատանում
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <img src="./images/1x1/am.svg" style={{ width: "30px" }} alt=""/>
                  </td>
                  <td style={{ backgroundColor: "#dedede" }}>ARM</td>
                  <td style={{ backgroundColor: "#dedede" }}>
                    {rate.AMD?.value}
                  </td>
                  <td style={{ backgroundColor: "#dedede" }}>
                    <span style={{ color: "green", fontSize: "32px" }}>
                      &#8593;
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{backgroundColor: "#efefef"}}>
                    <img src="./images/1x1/bj.svg" style={{width: "30px"}} alt=""/>
                  </td>
                  <td style={{backgroundColor: "#efefef"}}>BOB</td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    {rate.BOB?.value}
                  </td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <span style={{ color: "red", fontSize: "32px" }}>
                      &#8595;
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <img src="./images/1x1/ru.svg" style={{width: "30px"}} alt=""/>
                  </td>
                  <td style={{backgroundColor: "#dedede"}}>RUB</td>
                  <td style={{ backgroundColor: "#dedede" }}>
                    {rate.RUB?.value}
                  </td>
                  <td style={{ backgroundColor: "#dedede" }}>
                    <span style={{ color: "green", fontSize: "32px" }}>
                      &#8593;
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <img src="./images/1x1/ae.svg" style={{width: "30px"}} alt=""/>
                  </td>
                  <td style={{backgroundColor: "#efefef"}}>AED</td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    {rate.AED?.value}
                  </td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <span style={{ color: "red", fontSize: "32px" }}>
                      &#8595;
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <img src="./images/1x1/nl.svg" style={{width: "30px"}} alt=""/>
                  </td>
                  <td style={{backgroundColor: "#efefef"}}>ANG</td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    {rate.ANG?.value}
                  </td>
                  <td style={{ backgroundColor: "#efefef" }}>
                    <span style={{ color: "red", fontSize: "32px" }}>
                      &#8595;
                    </span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <div className="App">
              <div className="container">
                <div className="result">
                  <p
                      style={{ fontFamily: "monospace", color: "white" }}
                  >{`${Number(result.toFixed(2)).toLocaleString(
                      "en"
                  )} ${unit}`}</p>
                </div>
                <label htmlFor="value__input" style={{ color: "white" }}>
                  Քանակ:
                  <input
                      style={{
                        padding: "0 18px",
                        color: "#9e9e9e",
                        border: "1px solid #F86070",
                        borderRadius: "8px",
                      }}
                      className="input"
                      id="value__input"
                      type="number"
                      onChange={(e) => setInputValue(Number(e.target.value))}
                      value={inputValue}
                  />
                </label>
                <label htmlFor="fromCurrency" style={{ color: "white" }}>
                  Արտ. 1:
                  <select
                      style={{
                        color: "#9e9e9e",
                      }}
                      id="fromCurrency"
                      className="input"
                      aria-label="select From Currency"
                      onChange={(e) => setFromCurrency(e.target.value)}
                  >
                    {currencyList &&
                        currencyList.map((currency) => (
                            <option key={currency.name} value={currency.name}>
                              {currency.name}
                            </option>
                        ))}
                  </select>
                </label>
                <label htmlFor="toCurrency" style={{ color: "white" }}>
                  Արտ. 2:
                  <select
                      style={{
                        color: "#9e9e9e",
                      }}
                      id="toCurrency"
                      className="input"
                      aria-label="select To Currency"
                      onChange={(e) => setToCurrency(e.target.value)}
                  >
                    {currencyList &&
                        currencyList.map((currency) => (
                            <option key={currency.name} value={currency.name}>
                              {currency.name}
                            </option>
                        ))}
                  </select>
                </label>
              </div>
            </div>
            <div className={css.secondPageFooter}>
              <div>
                <img src="./images/icons/back.svg"  onClick={() => router.back()}  alt=""/>
              </div>
              <div style={{ position: "relative" }}>
                <Link href="main">
                  <img src="./images/icons/map.svg" alt=""/>
                </Link>
              </div>
              <div style={{position: "relative"}}>
                <img src="./images/icons/euro.svg" alt=""/>
                <Doth left={-3}/>
              </div>
              <div>
                <Link href="news">
                  <img src="./images/icons/news.svg" alt=""/>
                </Link>
              </div>
              <span style={{opacity: "0", width: "20px" }}>
              <img src={"./images/search_3.png"} alt="list" />
            </span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default rates;
