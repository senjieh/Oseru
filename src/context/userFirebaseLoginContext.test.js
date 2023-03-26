import { UserAuth } from './UserContext';

// All of these are white-box tests for the UserAuth() functiion
describe('createUser', () => {
  test('should create a new user with the given email and password', async () => {
    const { createUser } = UserAuth();
    const email = 'test@test.com';
    const password = 'password123';

    const result = await createUser(email, password);

    expect(result.user.email).toBe(email);
    expect(result.user.uid).toBeDefined();
  });

  test('should sign out the current user', async () => {
    const { logout, user } = UserAuth();

    await logout();

    expect(user).toBe(null);
  });

  test('should update user state when a user is signed in', async () => {
    const { signIn, user } = UserAuth();
    const email = 'test@example.com';
    const password = 'password123';

    await signIn(email, password);

    expect(user).toBeDefined();
    expect(user.email).toBe(email);
  });
});
