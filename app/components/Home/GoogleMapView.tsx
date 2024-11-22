"use client";

import React, { useContext, useEffect, useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import Markers from "./Markers";
import { Business } from "../../types";
import { useUserLocation } from "@/app/context/UserLocationContext";
import { useSelectedBusiness } from "@/app/context/SelectedBusinessContext";
import { IListing } from "@/app/lib/database/models/listing.model";

interface GoogleMapViewProps {
  businessList: IListing[];
}

const GoogleMapView: React.FC<GoogleMapViewProps> = ({ businessList }) => {

  const context = useUserLocation();
  const { userLocation } = context;

  const contextBusiness = useSelectedBusiness();

  if (!contextBusiness) {
    throw new Error("SelectedBusinessContext must be used within a SelectedBusinessProvider");
  }

  const { selectedBusiness, setSelectedBusiness } = contextBusiness;

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  useEffect(() => {
    if (map && selectedBusiness) {
      map.panTo(selectedBusiness.location);
    }
  }, [map, selectedBusiness]);

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ""}
        mapIds={["327f00d9bd231a33"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={
            !selectedBusiness?.title
              ? userLocation
              : selectedBusiness.location
          }
          options={{ mapId: "327f00d9bd231a33" }}
          zoom={13}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {/* User Location Marker */}
          <MarkerF
            position={userLocation}
            icon={{
              url: "/user-location.png",
              scaledSize: {
                width: 50,
                height: 50,
              },
            }}
          />

          {/* Business Markers */}
          {businessList.map(
            (item, index) =>
              index <= 7 && <Markers business={item} key={item.id || index} />
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapView;
