import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit, OnDestroy {
  propertyId!: number;
  SellRent!: number;  // Track whether it's Rent (2) or Buy (1)
  currentPage: number = 1;
  totalPages: number = 50;
  pages: number[] = [];
  visiblePages: number[] = [];
  private routeSub: Subscription | undefined;

  constructor(public router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();

    // Listen for route changes
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange();
      }
    });

    this.handleRouteChange(); // Handle initial route
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  handleRouteChange(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const sellRentParam = this.route.snapshot.queryParamMap.get('type');

    if (!id || isNaN(+id)) {
      this.router.navigate(['/property-detail', 1], { queryParams: { type: 1 } });
      return;
    }

    this.propertyId = +id;
    this.SellRent = sellRentParam ? +sellRentParam : 1; // Default to Buy if missing
    this.fetchPropertyDetails(this.propertyId);
    this.updateVisiblePages();

    console.log(`Navigated to Property Detail: ID=${this.propertyId}, SellRent=${this.SellRent}`);
  }

  updateVisiblePages(): void {
    this.visiblePages = this.pages.slice(0, 4);
  }

  fetchPropertyDetails(propertyId: number): void {
    this.propertyId = propertyId;
  }

  onBack() {
    const returnUrl = this.SellRent === 2 ? '/rent-property' : '/';
    this.router.navigate([returnUrl]); // Go back to correct listing page
  }

  goToPrevPage() {
    if (this.propertyId > 1) {
      this.router.navigate(['/property-detail', this.propertyId - 1], { queryParams: { type: this.SellRent } });
    }
  }

  goToNextPage() {
    if (this.propertyId < this.totalPages) {
      this.router.navigate(['/property-detail', this.propertyId + 1], { queryParams: { type: this.SellRent } });
    }
  }
}
