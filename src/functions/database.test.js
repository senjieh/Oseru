const {
    createUserDataProfile,
    updateUserDataProfile,
    getUserDataProfile
} = require('./cloudFunctions');
  
// Important to note that there is a difference between user login and user data. Google Firebase Authentication is used to handle user login, while Google Firebase Firestore is used to handle user data. The user login is handled in the UserFirebaseLoginContext.test.js file, while the user data is handled in this file.

// Integration tests
describe('UserDataProfile', () => {

    test('create and get user profile should maintain database integrity', async () => {
        const newUser = {
        id: 'test123',
        username: 'testuser',
        email: 'test@example.com',
        stats: { gamesPlayed: 0, highScore: 0 }
        };
    
        // Create new user profile
        await createUserDataProfile(newUser);
    
        // Get created user profile
        const userProfile = await getUserDataProfile(newUser.id);
        expect(userProfile).toEqual(newUser);
    });

    test('update user profile should process user activity/requests server-side', async () => {
        const updatedProfile = {
            id: 'test123',
            username: 'testuser',
            email: 'test@example.com',
            stats: { gamesPlayed: 1, highScore: 1000 }
        };
    
        // Update user profile
        await updateUserDataProfile(updatedProfile);
    
        // Get updated user profile
        const userProfile = await getUserDataProfile(updatedProfile.id);
        expect(userProfile).toEqual(updatedProfile);
    });
});