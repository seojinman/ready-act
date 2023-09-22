import { AppContext } from '@/App';
import arrowLeft from '@/assets/icons/arrowLeft.svg';
import Button from '@/components/Button';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Location.module.css';

const { kakao } = window;

function Location() {
  const { updateCreateRoomForm } = useContext(AppContext);
  const locationMapRef = useRef(null);
  const [data, setData] = useState();

  useEffect(() => {
    if (kakao) {
      const mapContainer = locationMapRef.current,
        mapOption = {
          center: new kakao.maps.LatLng(37.57157200866145, 126.9763416696016),
          level: 4,
        };

      const map = new kakao.maps.Map(mapContainer, mapOption);

      const geocoder = new kakao.maps.services.Geocoder();

      const marker = new kakao.maps.Marker(),
        infowindow = new kakao.maps.InfoWindow({ zindex: 1 });

      searchAddrFromCoords(map.getCenter(), displayCenterInfo);

      kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        searchDetailAddrFromCoords(
          mouseEvent.latLng,
          function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              let detailAddr = !!result[0].address.address_name
                ? result[0].address.address_name
                : '위치정보를 불러올 수 없음';
              setData(detailAddr);

              const content = `<div className="bAddr">${detailAddr}</div>`;

              marker.setPosition(mouseEvent.latLng);
              marker.setMap(map);

              infowindow.setContent(content);
              infowindow.open(map, marker);
            }
          }
        );
      });

      kakao.maps.event.addListener(map, 'idle', function () {
        searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      });

      function searchAddrFromCoords(coords, callback) {
        geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
      }

      function searchDetailAddrFromCoords(coords, callback) {
        geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      }

      function displayCenterInfo(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const infoDiv = document.getElementById('centerAddr');

          for (let i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
              infoDiv.innerHTML = result[i].address_name;
              break;
            }
          }
        }
      }
    } else {
      console.error('kakao에 접근할 수 없습니다.');
    }
  }, []);

  useEffect(() => {
    updateCreateRoomForm('meetingPoint', data);
  }, [data]);

  return (
    <div className="h-full">
      <p className="my-4">만날 장소</p>

      <div className="map_wrap">
        <div ref={locationMapRef} className="w-full h-[420px]"></div>
        <div className="hAddr flex">
          <span id="centerAddr" className="p-4">
            {data}
          </span>

          <Link
            to="/createroom"
            className="bg-white w-full absolute max-w-xl bottom-0 p-4 drop-shadow-2xl"
          >
            <Button type="submit" className="activeButton lgFontButton w-full ">
              이 위치로 설정
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Location;