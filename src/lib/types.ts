
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
    priceSinhalaNote: number | null;
    priceSinhalaAssignment: number | null;
    priceEnglishNote: number | null;
    priceEnglishAssignment: number | null;
    pdfUrlSinhalaNote: string | null;
    pdfUrlSinhalaAssignment: string | null;
    pdfUrlEnglishNote: string | null;
    pdfUrlEnglishAssignment: string | null;
    orderIndex: number;
};

export type CartItem = {
    unitId: string;
    unitCode: string;
    itemName: string;
    price: number;
    itemType: 'sinhalaNote' | 'sinhalaAssignment' | 'englishNote' | 'englishAssignment';
    title: string;
    sinhalaTitle: string;
};

export type Order = {
    id: string;
    orderCode: string;
    userId: string;
    userDisplayName: string;
    userEmail: string;
    items: CartItem[];
    total: number;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    createdAt: any; // Firestore timestamp
}

export type SiteSettings = {
    id?: string;
    announcement: {
        message: string;
        enabled: boolean;
    };
    testimonials: {
        id: string;
        name: string;
        role: string;
        text: string;
        rating: number;
    }[];
}
