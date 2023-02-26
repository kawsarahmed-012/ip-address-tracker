import { useEffect, useState } from 'react';
import IpMap from './IpMap';
import axios from 'axios';
import { ReactComponent as ArrowIcon } from './assets/icon-arrow.svg';

import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const VITE_API_KEY = import.meta.env.VITE_API_KEY;
const DOMAIN_REGEX = /^([\S]+\.)[\S]+$/;
const IP_REGEX = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;

const defaultInformation = {
  ip: '8.8.8.8',
  location: {
    country: 'US',
    region: 'California',
    city: 'Mountain View',
    lat: 37.40599,
    lng: -122.078514,
    postalCode: '94043',
    timezone: '-07:00',
    geonameId: 5375481,
  },
  domains: ['0d2.net', '003725.com', '0f6.b0094c.cn', '007515.com', '0guhi.jocose.cn'],
  as: {
    asn: 15169,
    name: 'Google LLC',
    route: '8.8.8.0/24',
    domain: 'https://about.google/intl/en/',
    type: 'Content',
  },
  isp: 'Google LLC',
};

function App() {
  const [information, setInformation] = useState(defaultInformation);
  const [error, setError] = useState('');

  useEffect(() => {
    error && alert(error);
  }, [error]);

  function fetchLocationData(url) {
    axios
      .get(url)
      .then((res) => {
        setInformation(res.data);
      })
      .catch((err) => setError(err.response.data.messages || err.message));
  }

  function submitHandler(e) {
    e.preventDefault();
    const inputData = e.target[0].value;
    let isDomain = null;

    if (DOMAIN_REGEX.test(inputData)) isDomain = true;
    if (IP_REGEX.test(inputData)) isDomain = false;

    if (isDomain === null) {
      alert('Enter an ip address or domain name');
      return;
    }

    fetchLocationData(`https://geo.ipify.org/api/v2/country,city?apiKey=${VITE_API_KEY}&${isDomain ? 'domain' : 'ipAddress'}=${inputData}`);
    e.target[0].value = '';
  }

  return (
    <>
      <header className="h-64 bg-[url('/images/pattern-bg.png')] bg-center overflow-visible relative z-[1000] bg-cover">
        <h1 className="w-11/12 xs:w-10/12 mx-auto text-3xl py-6 text-white font-medium">IP Address Tracker</h1>
        <form onSubmit={submitHandler} className="max-w-xl w-11/12 xs:w-10/12 mx-auto flex">
          <label htmlFor="ipInput" className="hidden">
            Type Ip or domain to track
          </label>
          <input className="px-6 py-3 rounded-l-2xl text-lg w-full" id="ipInput" type="text" placeholder="IP address or domain" />
          <button className="bg-black min-w-min px-6 flex-shrink-0 rounded-r-2xl" aria-label="submit">
            <ArrowIcon />
          </button>
        </form>
        <div className="w-11/12 xs:w-10/12 max-w-6xl mx-auto mt-6 sm:mt-8 py-4 sm:p-6 md:p-8 grid sm:grid-cols-2 xl:grid-cols-4 gap-y-4 sm:gap-y-8 bg-white rounded-2xl shadow-2xl">
          {[
            { id: 1, title: 'ip address', info: information.ip },
            { id: 2, title: 'location', info: `${information.location.city}, ${information.location.country} ${information.location.postalCode}` },
            { id: 3, title: 'timezome', info: `UTC${information.location.timezone}` },
            { id: 4, title: 'isp', info: information.isp },
          ].map(({ id, title, info }) => (
            <div className="w-full px-4 sm:px-8 xl:text-left xl:border-r border-r-slate-300 last:border-0" key={id}>
              <p className="text-[#969696] font-medium text-xs md:text-sm uppercase">{title}</p>
              <p className="mt-1 md:mt-2 text-slate-800 font-medium text-xl md:text-2xl">{info}</p>
            </div>
          ))}
        </div>
      </header>
      <main>
        {information.location && (
          <MapContainer zoomControl={false}>
            <IpMap information={information} />
          </MapContainer>
        )}
      </main>
    </>
  );
}

export default App;
