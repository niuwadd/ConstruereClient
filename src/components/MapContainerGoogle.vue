<template>
  <div class="size-full">
    <GoogleMap id="map" api-key="AIzaSyAkMlYYB9w2F5Pr3Y_xtyjCEDH-NHIEUPs" style="width: 100%; height: 500px"
      :center="center" :zoom="15">
      <AdvancedMarker :options="{ position: center }" />
    </GoogleMap>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import { formatTime, formatDistanceAdvanced } from "../utils";
import { onMounted, onUnmounted } from "vue";
import { useI18n } from 'vue-i18n'
import { GoogleMap, AdvancedMarker } from 'vue3-google-map'
import '@amap/amap-jsapi-types';
const { t } = useI18n()
const props = defineProps({
  startPoint: String,
  endPoint: String
});
const emit = defineEmits(["updateDistance", "updateTime"]);
const { startPoint, endPoint } = toRefs(props);
declare global {
  interface Window {
    _AMapSecurityConfig?: { securityJsCode?: string };
  }
}
let map: any = null;
onMounted(async () => {
  initMap()
});

onUnmounted(() => {
  map?.destroy();
});


let mapPolylines: google.maps.Polyline[] = [];
const center = { lat: 37.447646, lng: -122.113878 }; // Palo Alto, CA

// Initialize and add the map.
async function initMap(): Promise<void> {
  //  Request the needed libraries.
  const [{ Map }, { Place }, { Route }] = await Promise.all([
    google.maps.importLibrary('maps') as Promise<google.maps.MapsLibrary>,
    google.maps.importLibrary(
      'places'
    ) as Promise<google.maps.PlacesLibrary>,
    //@ts-ignore
    google.maps.importLibrary('routes') as Promise<google.maps.Routes>,

  ]);
  console.log(Place);
  map = new Map(document.getElementById('map') as HTMLElement, {
    zoom: 12,
    center: center,
    mapTypeControl: false,
    mapId: 'DEMO_MAP_ID',
  });

  // Define a routes request.
  const request = {
    origin: startPoint?.value,
    destination: endPoint?.value,
    travelMode: 'DRIVING',
    fields: ['path', 'legs'], // Request fields needed to draw polylines.
  };

  // Call computeRoutes to get the directions.
  const { routes } =
    await Route.computeRoutes(request);

  // Use createPolylines to create polylines for the route.
  mapPolylines = routes[0].createPolylines();
  // Add polylines to the map.
  mapPolylines.forEach((polyline) => polyline.setMap(map));

  // Create markers to start and end points.
  const markers = await routes[0].createWaypointAdvancedMarkers();
  // Add markers to the map
  markers.forEach((marker: any) => marker.setMap(map));
  const { distanceMeters, durationMillis } = routes[0].legs[0];
  console.log(formatDistanceAdvanced(distanceMeters, 1, t), formatTime(durationMillis, t));
  emit("updateDistance", formatDistanceAdvanced(durationMillis, 1, t))
  emit("updateTime", formatTime(distanceMeters, t))
  // Fit the map to the path.
  fitMapToPath(routes[0].path!);
}

// Helper function to fit the map to the path.
async function fitMapToPath(path: google.maps.LatLng[]) {
  const { LatLngBounds } = (await google.maps.importLibrary(
    'core'
  )) as google.maps.CoreLibrary;
  const bounds = new LatLngBounds();
  path.forEach((point) => {
    bounds.extend(point);
  });
  map.fitBounds(bounds);
}
</script>
<style scoped lang="scss">
#container {
  width: 100%;
  height: 100%
}
</style>