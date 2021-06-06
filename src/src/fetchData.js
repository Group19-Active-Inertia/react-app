 import firebase, { auth, provider } from "./firebase.js";

const fetchData = centerCoordinates => {
	const newFeaturesList = [];
	for (let i = 0; i < 20; i++){
		const id = i;
		const {latitude,longitude} = firebase.database().ref('items/coordinates');
		newFeaturesList.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      properties: {
        id,
        name: firebase.database().ref('items/name'),
      },
    });
  }

  return Promise.resolve({
    type: 'FeatureCollection',
    features: newFeaturesList,
  });
};