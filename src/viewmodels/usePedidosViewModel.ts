import { useState, useEffect, useCallback } from 'react';
import { Linking } from 'react-native';
import { RepartidorRepository } from '../models/repositories/RepartidorRepository';
import type { EvidenciaEntregaForm } from '../components/DeliveryEvidenceModal';

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

            await abrirRuta(direccion_entrega);
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        }
    };

    const abrirRuta = async (direccion_entrega: string) => {
        if (!direccion_entrega?.trim()) {
            alert('Este pedido no tiene una dirección disponible para abrir la ruta.');
            return;
        }

        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(direccion_entrega)}&travelmode=driving`;
        try {
            const puedeAbrir = await Linking.canOpenURL(url);
            if (!puedeAbrir) throw new Error('No se pudo abrir Google Maps.');
            await Linking.openURL(url);
        } catch {
            alert('No fue posible abrir la ruta en Google Maps. Intenta nuevamente.');
        }
    };

    const confirmarEntrega = async (id_pedido: number, evidencia: EvidenciaEntregaForm): Promise<boolean> => {
        try {
            await RepartidorRepository.confirmarEntrega(id_pedido, evidencia);
            // Quitar el pedido de la lista ya que fue entregado
            setPedidos(prev => prev.filter(p => p.id_pedido !== id_pedido));
            alert('¡Entrega confirmada con éxito!');
            return true;
        } catch (err: any) {
            alert(`Error: ${err.message}`);
            return false;
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
        abrirRuta,
        confirmarEntrega,
    };
};
