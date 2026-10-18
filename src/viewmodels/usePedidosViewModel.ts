import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { RepartidorRepository } from '../models/repositories/RepartidorRepository';

export const usePedidosViewModel = () => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarPedidos = async (isRefresh = false) => {
        if (isRefresh) {
            setIsRefreshing(true);
        } else {
            setIsLoading(true);
        }
        setError(null);

        try {
            const data = await RepartidorRepository.obtenerPedidosAsignados();
            setPedidos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const iniciarEntrega = async (id_pedido: number, direccion_entrega: string) => {
        try {
            await RepartidorRepository.iniciarEntrega(id_pedido);
            // Actualizar estado localmente
            setPedidos(prev => prev.map(p => 
                p.id_pedido === id_pedido ? { ...p, estado: 'En camino' } : p
            ));

            // Abrir Google Maps para trazar la ruta
            if (direccion_entrega) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion_entrega)}&travelmode=driving`;
                Linking.openURL(url);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const confirmarEntrega = async (id_pedido: number) => {
        try {
            await RepartidorRepository.confirmarEntrega(id_pedido);
            // Quitar el pedido de la lista ya que fue entregado
            setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
            alert('¡Entrega confirmada con éxito!');
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    // Cargar al montar el componente
    useEffect(() => {
        void cargarPedidos();
    }, []);

    const onRefresh = useCallback(() => {
        void cargarPedidos(true);
    }, []);

    return {
        pedidos,
        isLoading,
        isRefreshing,
        error,
        onRefresh,
        iniciarEntrega,
        confirmarEntrega,
    };
};
