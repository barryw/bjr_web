/*
Promisify setState
*/
export const setAsyncState = (self, newState) =>
    new Promise((resolve) => self.setState(newState, resolve));
