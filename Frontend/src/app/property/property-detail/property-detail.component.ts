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

  // Change router to public
  constructor(public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Initialize the pagination pages
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisiblePages();

    // Subscribe to route changes to detect page number change
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        const pageMatch = url.match(/property-detail\/(\d+)/);
        if (pageMatch) {
          this.currentPage = +pageMatch[1];
          this.updateVisiblePages();
          this.fetchPropertyDetails(this.currentPage); // Fetch property details based on the page number
        }
      }
    });

    // Set the initial page if the route contains a page ID
    const initialPage = this.route.snapshot.paramMap.get('id');
    if (initialPage) {
      this.currentPage = +initialPage;
      this.fetchPropertyDetails(this.currentPage); // Fetch property details based on the page number
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from route changes when component is destroyed
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  updateVisiblePages(): void {
    // Show the pages 1, 2, 3, 4 only. You can expand this to display more pages.
    const firstFourPages = this.pages.slice(0, 4);
    this.visiblePages = [...firstFourPages];
  }

  fetchPropertyDetails(page: number): void {
    // Simulate fetching the property details for the given page number.
    // You can replace this with a real service call to get property data from an API or a mock data source.
    this.propertyId = `Property ID: ${page}`;
  }

  onBack() {
    this.router.navigate(['/']);
  }

  goToPrevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.router.navigate(['/property-detail', this.currentPage]);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.router.navigate(['/property-detail', this.currentPage]);
    }
  }
}
