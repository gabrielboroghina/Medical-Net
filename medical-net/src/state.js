export const loggedUser = () => {
    const userProfile = document.cookie
        .split(';')
        .map(cookie => cookie.trim().split('='))
        .filter(cookie => cookie[0] === 'user_profile');

    if (!userProfile)
        return null;
    return JSON.parse(userProfile[0][1]);
};
