import { DataTable } from "./DataTable";
import { useEffect, useState } from "react";

const URL_STATION_STATUS =
  "https://gbfs.citibikenyc.com/gbfs/en/station_status.json";
const URL_STATION_INFO =
  "https://gbfs.citibikenyc.com/gbfs/en/station_information.json";

export default function App() {
  const [count, setCount] = useState(0);
  const [stations, setStations] = useState([]);
  const [stationsMeta, setStationsMeta] = useState([]);

  useEffect(() => {
    function doFetch() {
      fetch(URL_STATION_STATUS)
        .then((res) => res.json())
        .then((statusJson) => setStations(statusJson.data.stations));
      fetch(URL_STATION_INFO)
        .then((res) => res.json())
        .then((infoJson) => setStationsMeta(infoJson.data.stations));
    }
    function doCount() {
      setCount((c) => c + 1);
    }

    doFetch();
    const intervalId = setInterval(doFetch, 5000);

    let countIntervalId;
    const timeoutId = setTimeout(() => {
      doCount();
      countIntervalId = setInterval(doCount, 1000);
    }, 500);

    return () => {
      clearInterval(intervalId);
      clearInterval(countIntervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  const stationsMetaLookup = Object.fromEntries(
    stationsMeta.map((station) => [station.station_id, station.name])
  );

  const data = stations.map((station) => {
    return {
      id: station.station_id,
      station: stationsMetaLookup[station.station_id] || "missing name",
      docksAvailable: station.num_docks_available,
      bikesAvailable: station.num_bikes_available,
      ebikesAvailable: station.num_ebikes_available,
      bikesDisabled: station.num_bikes_disabled,
    };
  });

  const summary = (() => {
    if (!stations) {
      // TODO constant
      return {};
    }
    // TODO constant
    const initSummary = {
      docksAvailable: 0,
      bikesAvailable: 0,
      ebikesAvailable: 0,
      bikesDisabled: 0,
      station: 0,
    };
    stations.forEach((station) => {
      const docksAvailable = station.num_docks_available;
      const bikesAvailable = station.num_bikes_available;
      const ebikesAvailable = station.num_ebikes_available;
      const bikesDisabled = station.num_bikes_disabled;

      initSummary.docksAvailable += docksAvailable;
      initSummary.bikesAvailable += bikesAvailable;
      initSummary.ebikesAvailable += ebikesAvailable;
      initSummary.bikesDisabled += bikesDisabled;
      initSummary.station += 1;
    });
    return initSummary;
  })();

  return (
    <div className="App">
      <span>{count}</span>
      <DataTable summary={summary} data={data} />
    </div>
  );
}
