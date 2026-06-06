import { AuthController } from '../presentation/http/controllers/auth.controller';
import { AuthService } from '../application/auth.service';

describe('AuthController', () => {
  const authService = {
    register: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    verifyEmail: jest.fn(),
    me: jest.fn(),
  } as unknown as jest.Mocked<AuthService>;

  let controller: AuthController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new AuthController(authService);
  });

  it('forwards register requests to the service', async () => {
    authService.register.mockResolvedValue({ message: 'ok' } as never);

    await controller.register({
      tenantId: 'tenant-1',
      firstName: 'Test',
      email: 'test@foodmesh.dev',
      password: 'Password1',
      role: 'STAFF' as never,
    });

    expect(authService.register).toHaveBeenCalled();
  });

  it('forwards profile lookup to the service', async () => {
    authService.me.mockResolvedValue({ id: 'user-1' } as never);

    await controller.me({
      sub: 'user-1',
      tenantId: 'tenant-1',
      email: 'test@foodmesh.dev',
      role: 'STAFF' as never,
      tokenType: 'access',
    });

    expect(authService.me).toHaveBeenCalled();
  });
});
