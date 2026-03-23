import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { shopifyService } from '../services/shopifyService';

interface UserProfile {
    name: string;
    email: string;
    picture: string;
    token?: string; // Token de Acesso da Shopify
}

interface AuthContextType {
    user: UserProfile | null;
    login: (profile: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    termsAccepted: boolean;
    setTermsAccepted: (accepted: boolean) => void;
    canPurchase: boolean;
    showLoginPrompt: boolean;
    promptLogin: () => void;
    dismissLoginPrompt: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [termsAccepted, setTermsAcceptedState] = useState<boolean>(() => {
        return localStorage.getItem('veltrion_terms_accepted') === 'true';
    });
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    useEffect(() => {
        // Recuperar usuário salvo localmente ao iniciar
        const savedUser = localStorage.getItem('veltrion_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const setTermsAccepted = (accepted: boolean) => {
        setTermsAcceptedState(accepted);
        localStorage.setItem('veltrion_terms_accepted', String(accepted));
    };

    const promptLogin = () => {
        setShowLoginPrompt(true);
    };

    const dismissLoginPrompt = () => {
        setShowLoginPrompt(false);
    };

    const login = async (profile: any) => {
        setTermsAccepted(true);
        setShowLoginPrompt(false); // Fechar modal ao logar

        const deterministicPassword = `Veltrion_Social_${profile.email.split('@')[0]}_9012`;
        
        let finalToken = '';

        try {
            const authResult = await shopifyService.loginCustomer(profile.email, deterministicPassword);
            
            if (authResult?.customerAccessToken?.accessToken) {
                finalToken = authResult.customerAccessToken.accessToken;
            } else {
                const [firstName, ...lastNameParts] = profile.name.split(' ');
                const lastName = lastNameParts.join(' ') || 'Cliente';
                
                const createResult = await shopifyService.createCustomer(profile.email, firstName, lastName, deterministicPassword);
                
                if (createResult) {
                    const secondAttempt = await shopifyService.loginCustomer(profile.email, deterministicPassword);
                    finalToken = secondAttempt?.customerAccessToken?.accessToken || '';
                }
            }
        } catch (error) {
            console.error("Erro na ponte de identidade Shopify:", error);
        }

        const userData = { ...profile, token: finalToken };
        setUser(userData);
        localStorage.setItem('veltrion_user', JSON.stringify(userData));
        if (finalToken) localStorage.setItem('shopify_customer_token', finalToken);
    };

    const logout = () => {
        setUser(null);
        setTermsAccepted(false);
        localStorage.removeItem('veltrion_user');
        localStorage.removeItem('shopify_customer_token');
        localStorage.removeItem('veltrion_terms_accepted');
    };

    const isAuthenticated = !!user;
    const canPurchase = isAuthenticated && termsAccepted;

    return (
        <AuthContext.Provider value={{ 
            user, login, logout, isAuthenticated, termsAccepted, setTermsAccepted, canPurchase,
            showLoginPrompt, promptLogin, dismissLoginPrompt
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
