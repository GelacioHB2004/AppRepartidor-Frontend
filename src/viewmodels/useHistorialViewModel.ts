import { useState, useEffect, useCallback } from 'react';
import { RepartidorRepository } from '../models/repositories/RepartidorRepository';

export const useHistorialViewModel = () => {
    const [historial, setHistorial] = useState<any[]>([]);
    
    // Fechas seleccionadas
    const [fechaInicio, setFechaInicio] = useState<Date>(new Date());
    const [fechaFin, setFechaFin] = useState<Date>(new Date());
    
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Totales calculados
    const [totalEntregas, setTotalEntregas] = useState(0);
    const [totalDinero, setTotalDinero] = useState(0);

    const cargarHistorial = async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const formatFecha = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const data = await RepartidorRepository.obtenerHistorial(formatFecha(fechaInicio), formatFecha(fechaFin));
            setHistorial(data);
            
            // Calcular totales
            setTotalEntregas(data.length);
            const suma = data.reduce((acc: number, pedido: any) => acc + (Number(pedido.total) || 0), 0);
            setTotalDinero(suma);
            
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Recargar cuando cambie cualquier fecha
    useEffect(() => {
        void cargarHistorial();
    }, [fechaInicio, fechaFin]);

    const onRefresh = useCallback(() => {
        void cargarHistorial(true);
    }, [fechaInicio, fechaFin]);

    return {
        historial,
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        totalEntregas,
        totalDinero,
        isLoading,
        isRefreshing,
        error,
        onRefresh,
    };
};
