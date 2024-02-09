import React, { useEffect } from 'react';
import './index.scss';

const NotFound = () => {
  useEffect(() => {
    const animatePaths = () => {
      const path = document.querySelectorAll('.firstPath');
      const pathLast = document.querySelectorAll('.lastPath');

      for (let index = 0; index < path.length; index++) {
        path[index].style.strokeDasharray = `${path[index].getTotalLength()}`;
        path[index].style.strokeDashoffset = `${path[index].getTotalLength()}`;
        path[index].style.animation = `strokeLetter ${(index + 1) * 0.7}s ${(index + 1) * 0.3}s ease forwards`;

        pathLast[index].style.strokeDasharray = `${pathLast[index].getTotalLength()}`;
        pathLast[index].style.strokeDashoffset = `${pathLast[index].getTotalLength()}`;
        pathLast[index].style.animation = `strokeLetter 1s 2s ease forwards`;
      }
    };
    animatePaths();
  }, []);

  return (
    <section className="section">
      <div className="section__notFound">
        <svg width="92" height="39" viewBox="0 0 92 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="firstPath" d="M78.7856 37V37.5H79.2856H84.4855H84.9855V37V28H90.5855H91.0855V27.5V22.55V22.05H90.5855H84.9855V2V1.5H84.4855H80.3355H80.0983L79.9483 1.68373L62.7983 22.6837L62.5917 22.9367L62.7403 23.2276L65.0403 27.7276L65.1796 28H65.4855H78.7856V37ZM78.7856 12.0275V22.05H70.582L78.7856 12.0275Z" stroke="#2C6298"/>
            <path className="firstPath" d="M39.2589 35.6958L39.2623 35.6983C41.2912 37.2375 43.7001 38 46.4644 38C49.2288 38 51.6377 37.2375 53.6666 35.6983C55.686 34.1664 57.2199 32.0181 58.2807 29.2807L58.2814 29.2787C59.3418 26.5082 59.8644 23.2448 59.8644 19.5C59.8644 15.7559 59.3419 12.5084 58.281 9.77013C57.2208 7.00037 55.6872 4.83449 53.6666 3.30165C51.6377 1.76245 49.2288 1 46.4644 1C43.7001 1 41.2912 1.76245 39.2623 3.30165L39.2622 3.30164L39.2589 3.3042C37.2728 4.83736 35.7573 7.0026 34.6978 9.77034C33.637 12.5086 33.1144 15.7559 33.1144 19.5C33.1144 23.2448 33.6372 26.5082 34.6975 29.2787L34.6982 29.2807C35.7582 32.016 37.274 34.1636 39.2589 35.6958ZM51.6819 10.1008L51.6835 10.1035C52.9525 12.2609 53.6144 15.3752 53.6144 19.5C53.6144 23.6232 52.9531 26.7556 51.6827 28.9478C50.4305 31.0758 48.7034 32.1 46.4644 32.1C44.2255 32.1 42.4985 31.0758 41.2462 28.9478C39.9758 26.7556 39.3145 23.6232 39.3145 19.5C39.3145 15.3752 39.9764 12.2609 41.2454 10.1035L41.2454 10.1035L41.247 10.1008C42.501 7.93769 44.2286 6.89999 46.4644 6.89999C48.7003 6.89999 50.4279 7.93769 51.6819 10.1008Z" stroke="#2C6298"/>
            <path className="firstPath" d="M17.4086 37V37.5H17.9086H23.1086H23.6086V37V28H29.2086H29.7086V27.5V22.55V22.05H29.2086H23.6086V2V1.5H23.1086H18.9586H18.7214L18.5713 1.68373L1.42133 22.6837L1.21473 22.9367L1.36338 23.2276L3.66336 27.7276L3.80261 28H4.10858H17.4086V37ZM17.4086 12.0275V22.05H9.20508L17.4086 12.0275Z" stroke="#2C6298"/>
        </svg>
        <svg width="92" height="39" viewBox="0 0 92 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="lastPath" d="M78.7856 37V37.5H79.2856H84.4855H84.9855V37V28H90.5855H91.0855V27.5V22.55V22.05H90.5855H84.9855V2V1.5H84.4855H80.3355H80.0983L79.9483 1.68373L62.7983 22.6837L62.5917 22.9367L62.7403 23.2276L65.0403 27.7276L65.1796 28H65.4855H78.7856V37ZM78.7856 12.0275V22.05H70.582L78.7856 12.0275Z" stroke="#2C6298"/>
            <path className="lastPath" d="M39.2589 35.6958L39.2623 35.6983C41.2912 37.2375 43.7001 38 46.4644 38C49.2288 38 51.6377 37.2375 53.6666 35.6983C55.686 34.1664 57.2199 32.0181 58.2807 29.2807L58.2814 29.2787C59.3418 26.5082 59.8644 23.2448 59.8644 19.5C59.8644 15.7559 59.3419 12.5084 58.281 9.77013C57.2208 7.00037 55.6872 4.83449 53.6666 3.30165C51.6377 1.76245 49.2288 1 46.4644 1C43.7001 1 41.2912 1.76245 39.2623 3.30165L39.2622 3.30164L39.2589 3.3042C37.2728 4.83736 35.7573 7.0026 34.6978 9.77034C33.637 12.5086 33.1144 15.7559 33.1144 19.5C33.1144 23.2448 33.6372 26.5082 34.6975 29.2787L34.6982 29.2807C35.7582 32.016 37.274 34.1636 39.2589 35.6958ZM51.6819 10.1008L51.6835 10.1035C52.9525 12.2609 53.6144 15.3752 53.6144 19.5C53.6144 23.6232 52.9531 26.7556 51.6827 28.9478C50.4305 31.0758 48.7034 32.1 46.4644 32.1C44.2255 32.1 42.4985 31.0758 41.2462 28.9478C39.9758 26.7556 39.3145 23.6232 39.3145 19.5C39.3145 15.3752 39.9764 12.2609 41.2454 10.1035L41.2454 10.1035L41.247 10.1008C42.501 7.93769 44.2286 6.89999 46.4644 6.89999C48.7003 6.89999 50.4279 7.93769 51.6819 10.1008Z" stroke="#2C6298"/>
            <path className="lastPath" d="M17.4086 37V37.5H17.9086H23.1086H23.6086V37V28H29.2086H29.7086V27.5V22.55V22.05H29.2086H23.6086V2V1.5H23.1086H18.9586H18.7214L18.5713 1.68373L1.42133 22.6837L1.21473 22.9367L1.36338 23.2276L3.66336 27.7276L3.80261 28H4.10858H17.4086V37ZM17.4086 12.0275V22.05H9.20508L17.4086 12.0275Z" stroke="#2C6298"/>
        </svg>
        <p>NOT FOUND</p>
      </div>
    </section>
  );
};

export default NotFound;