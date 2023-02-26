import { icon } from 'leaflet';
import { useMap, Marker, TileLayer } from 'react-leaflet';

const myMarkerIcon = icon({
  iconUrl: '/images/icon-location.svg',
  iconSize: [46, 56],
});

function IpMap({ information } = children) {
  const map = useMap();
  map.setView([information.location.lat, information.location.lng], 18);

  return (
    <>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker alt="marker" icon={myMarkerIcon} position={[information.location.lat, information.location.lng]} />
    </>
  );
}

export default IpMap;
