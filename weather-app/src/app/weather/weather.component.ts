// src/app/weather/weather.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule for *ngIf
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../service-weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,  // Enables standalone mode
  imports: [CommonModule, FormsModule],  // Include CommonModule and FormsModule
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent {
  city: string = '';
  weatherData: any;
  errorMessage: string = '';

  constructor(private weatherService: WeatherService) {}

  getWeather() {
    if (this.city) {
      this.weatherService.getWeather(this.city).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.errorMessage = '';
        },
        error: (err) => {
          this.weatherData = null;
          this.errorMessage = err.message;
        }
      });
    }
  }
}
