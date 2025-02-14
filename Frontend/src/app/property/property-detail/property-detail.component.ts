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
  propertyId: string | null = null;
  currentPage: number = 1;
  totalPages: number = 50;
  pages: number[] = [];
  visiblePages: number[] = [];
  private routeSub: Subscription | undefined;

  constructor(public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();

    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.handleRouteChange();
      }
    });

    this.handleRouteChange(); // Handle route on initial load
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  handleRouteChange(): void {
    let id = this.route.snapshot.paramMap.get('id');

    // If no ID is provided, redirect to property 1
    if (!id) {
      this.router.navigate(['/property-detail', 1]);
      return;
    }

    // Check if ID is a valid number and within range
    if (isNaN(+id) || +id < 1 || +id > this.totalPages) {
      this.router.navigate(['/']); // Redirect to home if invalid
      return;
    }

    this.currentPage = +id;
    this.fetchPropertyDetails(this.currentPage);
    this.updateVisiblePages();
  }

  updateVisiblePages(): void {
    this.visiblePages = this.pages.slice(0, 4);
  }

  fetchPropertyDetails(page: number): void {
    this.propertyId = `Property ID: ${page}`;
  }

  onBack() {
    this.router.navigate(['/']);
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.router.navigate(['/property-detail', this.currentPage - 1]);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.router.navigate(['/property-detail', this.currentPage + 1]);
    }
  }
}
