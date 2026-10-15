import { useState, useEffect, useCallback } from 'react';
import { RepartidorRepository } from '../models/repositories/RepartidorRepository';

export const useInicioViewModel = () => {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarDashboard = async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const data = await RepartidorRepository.obtenerDashboard();
            setDashboardData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        cargarDashboard();
    }, []);

    const onRefresh = useCallback(() => {
        cargarDashboard(true);
    }, []);

    return {
        dashboardData,
        isLoading,
        isRefreshing,
        error,
        onRefresh,
        usuarioNombre: dashboardData?.repartidor_nombre || 'Repartidor'
    };
};
