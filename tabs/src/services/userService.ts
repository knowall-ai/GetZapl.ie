// Methods concerning the logged in user/users

const getCurrentUser = async (): Promise<User | null> => {
  // TODO: Implement this Akash
  const user: User = {
    id: '3a6c78a3-5b9b-420a-8d1b-d44d01ff781b',
    displayName: 'Akash Jadhav',
    profileImg:
      'https://knowallai.sharepoint.com/_layouts/15/userphoto.aspx?AccountName=akash.jadhav@knowall.ai	',
    aadObjectId: '3a6c78a3-5b9b-420a-8d1b-d44d01ff781b',
    email: 'akash.jadhav@knowall.ai	',
    privateWallet: null, // You get the idea
    allowanceWallet: null,
    type: 'Teammate',
  };
  return user;
};

const getAllUsers = async (): Promise<User[] | null> => {
  throw new Error('Not implemented');
};

const getFriends = async (): Promise<User[] | null> => {
  throw new Error('Not implemented');
};

export { getCurrentUser, getAllUsers, getFriends };
