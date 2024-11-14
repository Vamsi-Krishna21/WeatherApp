// src/app/weather.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private openMeteoUrl = 'https://api.open-meteo.com/v1/forecast';
  private geolocationUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private geoApiKey = 'd6832173325444f7978ecf1bbcd05d7d';  // my OpenCage API Key

  constructor(private http: HttpClient) {}

  getWeather(city: string) {
    return this.http.get<any>(`${this.geolocationUrl}`, {
      params: {
        q: city,
        key: this.geoApiKey,
      }
    }).pipe(
      switchMap((geoData) => {
        if (geoData.results.length > 0) {
          const { lat, lng } = geoData.results[0].geometry;
          return this.http.get<any>(this.openMeteoUrl, {
            params: {
              latitude: lat,
              longitude: lng,
              current_weather: 'true',
            },
          });
        } else {
          throw new Error('City not found');
        }
      }),
      map((weatherData) => ({
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      })),
      catchError((error) => of({ error: error.message || 'Could not fetch data' }))
    );
  }
}
