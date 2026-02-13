import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/user.model';

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  const setup = () => {
    const service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    return service;
  };

  beforeEach(() => {
    localStorage.clear(); // ✅ clear BEFORE any service is created

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
  });

  afterEach(() => {
    // httpMock exists only if setup() was called in the test
    if (httpMock) httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    const service = setup();
    expect(service).toBeTruthy();
  });

  it('should login successfully and store auth', () => {
    const service = setup();

    const credentials: LoginRequest = { username: 'admin', password: 'password' };
    const mockResponse: LoginResponse = {
      token: 'test-token',
      user: { id: '1', username: 'admin' }
    };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()?.username).toBe('admin');
      expect(localStorage.getItem('auth_token')).toBe('test-token');
      expect(JSON.parse(localStorage.getItem('auth_user') || '{}').username).toBe('admin');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear auth data', () => {
    const service = setup();

    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', username: 'admin' }));

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });

  it('should get token from localStorage', () => {
    const service = setup();

    localStorage.setItem('auth_token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  // ✅ Branch: token && userStr is TRUE, JSON.parse succeeds
  it('should load stored auth on construction when token and user are valid', () => {
    // Reset module so AuthService is NOT created yet
    TestBed.resetTestingModule();
    localStorage.clear();

    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: '1', username: 'admin' }));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    const fresh = TestBed.inject(AuthService);

    expect(fresh.isAuthenticated()).toBe(true);
    expect(fresh.currentUser()?.username).toBe('admin');
  });

  // ✅ Branch: token && userStr TRUE, JSON.parse throws -> catch -> logout()
  it('should logout during loadStoredAuth when stored user JSON is invalid', () => {
    TestBed.resetTestingModule();
    localStorage.clear();

    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem('auth_user', '{invalid-json');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    const fresh = TestBed.inject(AuthService);

    expect(fresh.isAuthenticated()).toBe(false);
    expect(fresh.currentUser()).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
  });
  it('should NOT authenticate if user exists but token is missing', () => {
    TestBed.resetTestingModule();
    localStorage.clear();

    localStorage.setItem('auth_user', JSON.stringify({ id: '1', username: 'admin' }));
    // ❌ no token

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    const fresh = TestBed.inject(AuthService);

    expect(fresh.isAuthenticated()).toBe(false);
    expect(fresh.currentUser()).toBeNull();
  });

});
