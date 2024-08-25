import React, { useEffect, useRef, memo } from "react";

function TradingviewChart({ type, coin }) {
  const container = useRef(null);
  useEffect(() => {
    // Clear the container before appending a new script to avoid duplicates
    if (container.current) {
      container.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.textContent = `
      {
         "width": "100%",
         "height": "370",
         "symbol": "${type}:${coin}",
         "interval": "30",
         "timezone": "Etc/UTC",
         "theme": "light",
         "style": "1",
         "locale": "en",
         "hide_legend": true,
         "allow_symbol_change": false,
         "save_image": false,
         "calendar": false,
         "hide_volume": true,
         "support_host": "https://www.tradingview.com"
      }`;

    // Delay the script loading to ensure DOM is fully available
    const timeoutId = setTimeout(() => {
      if (container.current) {
        container.current.appendChild(script);
      }
    }, 500); // Adjust timeout if necessary

    return () => {
      clearTimeout(timeoutId); // Clean up timeout on component unmount
    };
  }, [type, coin]); // Ensure this effect only runs once by passing an empty dependency array

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "500px", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "500px", width: "100%" }}
      ></div>
    </div>
  );
}

export default memo(TradingviewChart);
