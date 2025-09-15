export type Authentification = {
    token: string;
    refreshToken: string;
    utilisateur: {
        id: number;
        mail: string;
        nom: string;
        prenom: string;
        sexe: string;
        taille: number;
        point_bonus: number;
        point_jour: number;
    };
};
