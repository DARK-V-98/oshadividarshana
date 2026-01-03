export type UserProfile = {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: 'user' | 'admin';
};

export type Unit = {
    id: string;
    code: string;
    title: string;
    sinhalaTitle: string;
    category: string;
};
