import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Alert } from "react-native";
import { useCallback, useLayoutEffect, useState } from "react";
import IconButton from "../components/UI/IconButton";

function Maps({ navigation, route }) {
  const initialLocation = route.params && {
    lat: route.params.initialLat,
    lng: route.params.initialLng,
  };

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const region = {
    latitude: initialLocation ? initialLocation.lat : 17.0,
    longitude: initialLocation ? initialLocation.lng : 78.3,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  function selectLocationHandler(event) {
    if (initialLocation) {
      return;
    }
    
    const lat = event.nativeEvent.coordinate.latitude;
    const lng = event.nativeEvent.coordinate.longitude;

    setSelectedLocation({ lat: lat, lng: lng });
  }

  //since function is passed as a parameter in useLayoutEffect hook,
  //to avoid multiple re-render cycles or potential infinite loops,
  //we'll wrap this function using useCallback,
  //which helps us ensure that a function defined inside of a component is not recreated un-necessarily

  const savePickedLocationHandler = useCallback(() => {
    if (!selectedLocation) {
      Alert.alert(
        "No Location Picked",
        "Pick a location by tapping on Map first!"
      );
      return;
    }

    navigation.navigate("AddPlace", {
      pickedLat: selectedLocation.lat,
      pickedLng: selectedLocation.lng,
    });
  }, [navigation, selectedLocation]);

  //used to render a piece of code when rendered for the first time

  useLayoutEffect(() => {
    if (initialLocation) {
      return;
    }

    navigation.setOptions({
      headerRight: ({ tintColor }) => (
        <IconButton
          icon="save"
          size={24}
          color={tintColor}
          onPress={savePickedLocationHandler}
        />
      ),
    });
  }, [navigation, savePickedLocationHandler, initialLocation]);

  return (
    <MapView
      style={styles.maps}
      initialRegion={region}
      onPress={selectLocationHandler}
    >
      {selectedLocation && (
        <Marker
          title="Picked Location"
          coordinate={{
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
          }}
        />
      )}
    </MapView>
  );
}

export default Maps;

const styles = StyleSheet.create({
  maps: {
    flex: 1,
  },
});
