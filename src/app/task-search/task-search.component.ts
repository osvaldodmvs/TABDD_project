import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.css']
})
export class TaskSearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  categories: string[] = [];

  constructor(private firestore: AngularFirestore) {}

  search(): void {
    this.searchResults = [];

    const collections = ['done', 'inProgress', 'todo'];
    const searchQueryLower = this.searchQuery.toLowerCase();
    const uniqueCategories = new Set<string>();

    collections.forEach(collection => {
      this.firestore.collection(collection).valueChanges().subscribe((data: any[]) => {
        const filteredData = data.filter(item => {
          const lowerCaseTitle = item.title.toLowerCase();
          const lowerCaseDescription = item.description.toLowerCase();

          return (
            lowerCaseTitle.includes(searchQueryLower) ||
            lowerCaseDescription.includes(searchQueryLower)
          );
        }).map(item => ({ ...item, collection }));
        filteredData.forEach(item => {
          if (item.category) {
            uniqueCategories.add(item.category);
          }
        });
  
        this.searchResults = [...this.searchResults, ...filteredData];
        this.categories = Array.from(uniqueCategories);
      });
    });
  }

  getUniqueCategories(): string[] {
    const uniqueCategories = new Set<string>();
    this.searchResults.forEach(task => {
      if (task.category) {
        uniqueCategories.add(task.category);
      }
    });
    return Array.from(uniqueCategories);
  }
  
  selectedCategories: string[] = [];

filterByCategory(category: string): void {
  const index = this.selectedCategories.indexOf(category);
  if (index === -1) {
    this.selectedCategories.push(category);
  } else {
    this.selectedCategories.splice(index, 1);
  }
  this.applyCategoryFilters();
}

applyCategoryFilters(): void {
  const filteredResults: any[] = [];

  if (this.selectedCategories.length === 0) {
    this.search();
    return;
  }

  this.selectedCategories.forEach(selectedCategory => {
    const filteredData = this.searchResults.filter(
      task => task.category === selectedCategory
    );
    filteredResults.push(...filteredData);
  });

  this.searchResults = [...filteredResults];
}

sortTasksAscending(): void {
  this.searchResults.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
}

sortTasksDescending(): void {
  this.searchResults.sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA > titleB) {
      return -1;
    }
    if (titleA < titleB) {
      return 1;
    }
    return 0;
  });
}

}
