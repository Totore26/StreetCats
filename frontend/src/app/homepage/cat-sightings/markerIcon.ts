import { icon } from 'leaflet';

export var catIcon = icon({
    iconUrl: './catIcon.png',
    shadowUrl: './shadoww.png',

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [60, 60], // size of the shadow
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 28],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

export var UserIcon = icon({
    iconUrl: './userIcon.png',
    shadowUrl: './shadoww.png',

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [60, 60], // size of the shadow
    iconAnchor:   [20, 20], // point of the icon which will correspond to marker's location
    shadowAnchor: [15, 28],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});