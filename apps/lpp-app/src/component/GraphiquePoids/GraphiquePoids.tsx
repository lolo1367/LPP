// src/component/GraphiquePoids/GraphiquePoids.tsx
import styles from './GraphiquePoids.module.css';
import React, { useState, useMemo } from 'react';
import { LigneJournalPoids } from '@lpp/communs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Tabs from '@/basicComponent/Tabs/Tabs';
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from '@/utils/date/date';
import { format } from 'date-fns';

// ==========================================================================================
// Types
// ==========================================================================================
interface GraphiquePoidsProps {
    poidsData: LigneJournalPoids[];
    dateDebut: Date,
    dateFin: Date,
    periode: 'semaine' | 'mois' | 'annee';
    onPeriodeChange: (periode: 'semaine' | 'mois' | 'annee') => void;
}

// ==========================================================================================
// Utilitaires pour générer les plages de dates
// ==========================================================================================
function addDays(date: Date, days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
}


// Génération des données continues selon la période
function generateContinuousData(
    data: LigneJournalPoids[],
    periode: 'semaine' | 'mois' | 'annee',
    dateDebut: Date,
    dateFin: Date
) {
    const map = new Map(data.map(d => [d.date, d.poids]));
    const result: { date: number; poids: number; estime: boolean }[] = [];
    let lastPoids: number | null = null;

    // Déterminer le pas
    let step: 'day' | 'week' | 'month' = 'day';
    if (periode === 'mois') step = 'week';
    else if (periode === 'annee') step = 'month';

    // Début
    let current: Date;
    if (periode === 'semaine') current = startOfWeek(dateDebut);
    else if (periode === 'mois') current = startOfMonth(dateDebut);
    else current = startOfYear(dateDebut);

    while (current <= dateFin) {
        const key = format(current, 'yyyy-MM-dd');
        const poids = map.get(key);

        if (poids !== undefined) {
            result.push({ date: current.getTime(), poids, estime: false });
            lastPoids = poids;
        } else if (lastPoids !== null) {
            // Points estimés uniquement à l'intérieur de la plage
            result.push({ date: current.getTime(), poids: lastPoids, estime: true });
        }

        // Avance en fonction du step
        if (step === 'day') current = addDays(current, 1);
        else if (step === 'week') current = addDays(current, 7);
        else current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return result;
}




// ==========================================================================================
// Composant
// ==========================================================================================
const GraphiquePoids: React.FC<GraphiquePoidsProps> = ({ poidsData, dateDebut,dateFin, periode, onPeriodeChange }) => {
    const tabsData = [
        { id: 's', title: '7 jours', periode: 'semaine' as const },
        { id: 'm', title: '1 mois', periode: 'mois' as const },
        { id: 'a', title: '1 an', periode: 'annee' as const },
    ];

    const [activeTab, setActiveTab] = useState<string>(tabsData[0]?.id || 's');

    // Données préparées en fonction de la période
    const data = useMemo(() => generateContinuousData(poidsData, periode, dateDebut,dateFin), [poidsData, periode]);

    const minPoids = Math.min(...poidsData.map(i => i.poids));
    const maxPoids = Math.max(...poidsData.map(i => i.poids));

    const handleTabChange = (id: string) => {
        setActiveTab(id);
        const t = tabsData.find(t => t.id === id);
        if (t) onPeriodeChange(t.periode);
    };

    return (
        <div style={{ padding: '16px', border: '1px solid #ddd', borderRadius: '8px' }}>
            <div className={styles.titre}>Évolution du poids</div> 
            
            {/* Onglets */}
            <div className={styles.zoneTabs}>
                <Tabs
                    tabs={tabsData}
                    activeTabId={activeTab}
                    onTabChange={(id) => handleTabChange(id)}
                />
            </div>

            {/* Graphique */}
            <div className={styles.graphContainer}>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                    dataKey="date"
                    type="number"
                    domain={[dateDebut.getTime(), dateFin.getTime()]}
                    tickFormatter={(ts) =>
                        new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                    }
                    tick={{ className: styles.axisLabel }}
                    />
                        <YAxis
                            domain={[minPoids, maxPoids]}
                            tick={{ className: styles.axisLabel }}
                        />
                    <Tooltip
                    labelFormatter={(ts) => new Date(ts as number).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                    formatter={(value, name, props) => {
                        const dataPoint = props.payload; // contient {date, poids, estime}
                        const suffix = dataPoint.estime ? ' (estimé)' : ' (réel)';
                        return [`${value}${suffix}`, name];
                    }}
                    />
                    {/* Ligne continue pour toutes les valeurs */}
                    <Line
                    type="monotone"
                    dataKey="poids"
                    stroke="#8884d8"
                    dot={false}
                    />

                    {/* Points réels */}
                    <Line
                    type="monotone"
                    dataKey="poids"
                    stroke="transparent"
                    dot={{ r: 6, fill: "blue" }}
                    isAnimationActive={false}
                    data={data.filter(d => !d.estime)}
                    />

                    {/* Points estimés */}
                    <Line
                    type="monotone"
                    dataKey="poids"
                    stroke="transparent"
                    dot={{ r: 6, fill: "white", stroke: "red", strokeWidth: 2 }}
                    isAnimationActive={false}
                    data={data.filter(d => d.estime)}
                    />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GraphiquePoids;
