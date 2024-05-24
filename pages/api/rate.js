// /* eslint-disable react-hooks/rules-of-hooks */
// import axios from "axios";
// import { useState, useEffect } from "react";

// export function RateApi() {
//   const [rates, setRates] = useState([]);
//   useEffect(() => {
//     axios
//       .get(
//         "http://api.exchangeratesapi.io/v1/latest?access_key=3f64795a5f8cd497d7a823ffacf26680"
//       )
//       .then((res) => setRates(res));
//     if (!rates) return null;
//     return rates;
//   }, []);
// }
