import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should require username and password', () => {
    expect(component.loginForm.invalid).toBe(true);
    
    component.loginForm.patchValue({ username: 'test' });
    expect(component.loginForm.invalid).toBe(true);
    
    component.loginForm.patchValue({ password: 'test' });
    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authService.login on submit', () => {
    authService.login.and.returnValue(of({ token: 'test', user: { id: '1', username: 'test' } }));
    component.loginForm.patchValue({ username: 'test', password: 'test' });
    
    component.onSubmit();
    
    expect(authService.login).toHaveBeenCalledWith({ username: 'test', password: 'test' });
  });

  it('should navigate to notes on successful login', () => {
    authService.login.and.returnValue(of({ token: 'test', user: { id: '1', username: 'test' } }));
    component.loginForm.patchValue({ username: 'test', password: 'test' });
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/notes']);
  });

  it('should display error message on login failure', () => {
    authService.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid credentials' } })));
    component.loginForm.patchValue({ username: 'test', password: 'wrong' });
    
    component.onSubmit();
    
    expect(component.errorMessage).toBe('Invalid credentials');
  });
});
