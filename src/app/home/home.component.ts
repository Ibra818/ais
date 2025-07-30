import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService, ContactFormData } from '../services/contact.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChildren('container') container!: QueryList<ElementRef>;
  @ViewChild('item') item!: ElementRef;
  @ViewChild('search') btnSearch !: ElementRef;
  @ViewChild('searchBar') searchBar !: ElementRef;
  @ViewChild('ticketSlider') ticketSlider !: ElementRef;
  @ViewChild('voyagesSlider') voyagesSlider !: ElementRef;
  @ViewChild('recherche') recherche !: ElementRef;
  @ViewChild('formContact') formContact !: ElementRef;

  destinations = [
    {
      id: 'rome',
      name: 'Rome',
      className: 'rome',
      image: '/assets/image.jpg',
      visible: true
    },
    {
      id: 'paris',
      name: 'Paris',
      className: 'paris',
      image: '/assets/image.jpg',
      visible: true
    },
    {
      id: 'mecca',
      name: 'Mecque',
      className: 'mecca',
      image: '/assets/image.jpg',
      visible: true
    },
    {
      id: 'sidney',
      name: 'Sidney',
      className: 'sidney',
      image: '/assets/image.jpg',
      visible: true
    },
    {
      id: 'canada',
      name: 'Montréal',
      className: 'canada',
      image: '/assets/image.jpg',
      visible: true
    },
    {
      id: 'tunisie',
      name: 'Tunis',
      className: 'tunisie',
      image: '/assets/image.jpg',
      visible: true
    }
  ];

  search = '';
  filteredDestinations = [...this.destinations];
  currentSlideIndex = 0;
  totalSlides = 3;
  contactForm: FormGroup;
  isSubmitting = false;
  submitMessage = '';

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      service: [''],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Initialiser le slider automatique pour les voyages réalisés
    this.startAutoSlider();
  }

  ngOnDestroy(): void {

  }

  ngAfterViewInit(): void {
    const container = this.container.toArray()
    container.forEach(element=>{
      this.renderer.listen(element.nativeElement, 'mouseenter', (event: MouseEvent) => {
      this.renderer.addClass(event.target, 'animate');
    })
    
    });

    container.forEach(element=>{
      this.renderer.listen(element.nativeElement, 'mouseleave', (event: MouseEvent) => {
      this.renderer.removeClass(event.target, 'animate');
    })
    
    });

    this.renderer.listen(this.btnSearch.nativeElement, 'click', (event: MouseEvent)=>{
      if(this.searchBar.nativeElement.classList.contains('animate')){
        this.renderer.removeClass(this.searchBar.nativeElement, 'animate')
        return
      } 
      this.renderer.addClass(this.searchBar.nativeElement, 'animate');
    });

    // Contrôle du slider - Pause au survol
    this.renderer.listen(this.ticketSlider.nativeElement, 'mouseenter', () => {
      const slides = this.ticketSlider.nativeElement.querySelectorAll('.slide');
      slides.forEach((slide: HTMLElement) => {
        slide.style.animationPlayState = 'paused';
      });
    });

    this.renderer.listen(this.ticketSlider.nativeElement, 'mouseleave', () => {
      const slides = this.ticketSlider.nativeElement.querySelectorAll('.slide');
      slides.forEach((slide: HTMLElement) => {
        slide.style.animationPlayState = 'running';
      });
    });

  }

    Input(){
      this.renderer.listen(this.recherche.nativeElement, 'input', (event: Event) => {
      this.search = (event.target as HTMLInputElement).value;
      console.log(this.search)
    })
  }

  // Méthode pour filtrer les destinations
  onSearchDestinations(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.search = searchTerm;
    
    if (searchTerm === '') {
      // Si la recherche est vide, afficher toutes les destinations
      this.filteredDestinations = [...this.destinations];
    } else {
      // Filtrer les destinations qui contiennent le terme de recherche
      this.filteredDestinations = this.destinations.filter(destination =>
        destination.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Appliquer l'animation de filtrage
    this.applySearchFilter();
  }

  // Méthode pour appliquer l'animation de filtrage
  private applySearchFilter() {
    // Récupérer tous les éléments de destination
    const destinationElements = document.querySelectorAll('.card-item');
    
    destinationElements.forEach((element: Element) => {
      const htmlElement = element as HTMLElement;
      const destinationId = this.getDestinationIdFromElement(htmlElement);
      const isVisible = this.filteredDestinations.some(dest => dest.id === destinationId);
      
      if (isVisible) {
        // Afficher avec animation
        htmlElement.style.display = 'block';
        htmlElement.style.opacity = '0';
        htmlElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          htmlElement.style.transition = 'all 0.3s ease';
          htmlElement.style.opacity = '1';
          htmlElement.style.transform = 'scale(1)';
        }, 50);
      } else {
        // Masquer avec animation
        htmlElement.style.transition = 'all 0.3s ease';
        htmlElement.style.opacity = '0';
        htmlElement.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          htmlElement.style.display = 'none';
        }, 300);
      }
    });

    // Afficher un message si aucun résultat
    this.showNoResultsMessage();
  }

  // Méthode pour obtenir l'ID de destination à partir de l'élément HTML
  private getDestinationIdFromElement(element: HTMLElement): string {
    if (element.classList.contains('rome')) return 'rome';
    if (element.classList.contains('paris')) return 'paris';
    if (element.classList.contains('mecca')) return 'mecca';
    if (element.classList.contains('sidney')) return 'sidney';
    if (element.classList.contains('canada')) return 'canada';
    if (element.classList.contains('tunisie')) return 'tunisie';
    return '';
  }

  // Méthode pour afficher/masquer le message "Aucun résultat"
  private showNoResultsMessage() {
    const destinationsContainer = document.querySelector('#destinations');
    const existingMessage = document.querySelector('.no-results-message');
    
    if (existingMessage) {
      existingMessage.remove();
    }
    
    if (this.filteredDestinations.length === 0 && this.search !== '') {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.className = 'no-results-message';
      noResultsDiv.innerHTML = `
        <div class="no-results-content">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19S2 15.194 2 10.5 5.806 2 10.5 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <h3>Aucune destination trouvée</h3>
          <p>Essayez avec des termes différents comme "Rome", "Paris", "Mecque"...</p>
        </div>
      `;
      
      const cardContainer = destinationsContainer?.querySelector('.card');
      if (cardContainer) {
        cardContainer.appendChild(noResultsDiv);
      }
    }
  }

  // Méthode pour nettoyer la recherche
  clearSearch() {
    this.search = '';
    this.filteredDestinations = [...this.destinations];
    
    // Remettre l'input à vide
    const searchInput = document.querySelector('#search input') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Réafficher toutes les destinations
    this.applySearchFilter();
  }

  startAutoSlider() {
    setInterval(() => {
      this.nextSlide();
    }, 5000); // Change de slide toutes les 5 secondes
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.totalSlides;
    this.showSlide(this.currentSlideIndex);
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.totalSlides) % this.totalSlides;
    this.showSlide(this.currentSlideIndex);
  }

  showSlide(index: number) {
    if (this.voyagesSlider) {
      const slides = this.voyagesSlider.nativeElement.querySelectorAll('.voyage-slide');
      const indicators = this.voyagesSlider.nativeElement.querySelectorAll('.indicator');
      
      slides.forEach((slide: HTMLElement, i: number) => {
        if (i === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      indicators.forEach((indicator: HTMLElement, i: number) => {
        if (i === index) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
  }

  // Méthodes globales pour les boutons de navigation
  changeSlide(direction: number) {
    if (direction > 0) {
      this.nextSlide();
    } else {
      this.prevSlide();
    }
  }

  currentSlide(index: number) {
    this.currentSlideIndex = index - 1;
    this.showSlide(this.currentSlideIndex);
  }

  // Méthode pour soumettre le formulaire de contact
  onSubmitContact() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitMessage = '';

      // Données du formulaire
      const formData: ContactFormData = {
        firstName: this.contactForm.value.firstName,
        lastName: this.contactForm.value.lastName,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone || '',
        service: this.contactForm.value.service || '',
        message: this.contactForm.value.message,
        timestamp: new Date().toISOString(),
        source: 'AIS Travel Website'
      };

      // Envoi vers l'API - utilisez submitContactForm() pour une vraie API
      // ou submitContactFormMock() pour tester
      this.contactService.submitContactFormMock(formData).subscribe({
        next: (response) => {
          console.log('Formulaire envoyé avec succès:', response);
          if (response.success) {
            this.submitMessage = 'Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.';
            this.contactForm.reset();
          } else {
            this.submitMessage = 'Une erreur est survenue: ' + response.message;
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi:', error);
          this.submitMessage = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched();
    }
  }

  // Méthode utilitaire pour marquer tous les champs comme touchés
  private markFormGroupTouched() {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  // Méthodes utilitaires pour la validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'Ce champ est requis';
      }
      if (field.errors['email']) {
        return 'Veuillez entrer un email valide';
      }
      if (field.errors['minlength']) {
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      }
    }
    return '';
  }
}
