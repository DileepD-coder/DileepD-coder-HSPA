import { Component } from "@angular/core";

@Component({
  selector: 'app-property-card',

  //template: `<h2>I am card</h2>`  // ✅ Fix: Inline template added
  templateUrl:'property-card.component.html',
  styleUrls: ['property-card.component.css']

})
export class PropertyCardComponent {
   property: any ={
   "Id":1,
   "Name": "Dee House",
   "Type":"House",
   "Price":12000
  }
   
  
 }
