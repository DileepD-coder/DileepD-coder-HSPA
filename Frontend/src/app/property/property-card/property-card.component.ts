import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common'; // ✅ Import CommonModule

@Component({
  selector: 'app-property-card',
  standalone: true, // ✅ Mark as standalone
  imports: [CommonModule], // ✅ Add CommonModule here
  templateUrl: 'property-card.component.html',
  styleUrls: ['property-card.component.css']
})
export class PropertyCardComponent {
  @Input() property: any;

  ngOnInit() {
    console.log(this.property); // Log the received property object
  }
}


