import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private revealObserver?: IntersectionObserver;
  private routerSubscription?: Subscription;

  private readonly revealSelector = [
    'main.body section',
    'main.body .introduction > *',
    'main.body .subheading',
    'main.body .content',
    'main.body .developer',
    'main.body .card-service',
    'main.body .card-experience',
    'main.body .tech-item',
    'main.body .project-box',
    'main.body .modal',
    'main.body .phone',
    'main.body .email',
    'main.body .city',
    'main.body .getting-in-touch form',
    'main.body .message-me',
    'main.body .profile',
    'main.body .about',
    'main.body .experience',
    'main.body .education',
    'main.body .skills',
    'main.body .footer-info',
    'main.body .card'
  ].join(', ');

  constructor(private readonly router: Router) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          this.revealObserver?.unobserve(entry.target);
        });
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px 12% 0px'
      }
    );

    this.observeTargets();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.setTimeout(() => this.observeTargets(), 0);
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
    this.revealObserver?.disconnect();
  }

  private observeTargets(): void {
    if (!this.revealObserver) {
      return;
    }

    const targets = document.querySelectorAll<HTMLElement>(this.revealSelector);
    targets.forEach((target, index) => {
      if (target.classList.contains('no-reveal')) {
        return;
      }

      target.classList.add('reveal-on-scroll');
      target.classList.remove('is-visible');
      target.style.setProperty('--reveal-delay', `${Math.min(index, 10) * 55}ms`);
      this.revealObserver?.observe(target);
    });
  }
}
