import React, { useState, useMemo } from 'react';
import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SalesSummary = ({ pedidos }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const calculateSummaries = (pedidos) => {
    const summary = {
      totalSold: 0,
      unitsPerProduct: {
        'Crokie Tradicional': 0,
        'Crookie Blanco': 0,
        'Mini Cajita de Crookies': 0
      }
    };
    pedidos.forEach(pedido => {
      summary.totalSold += pedido.totalPedido;
      Object.keys(pedido.productosParsed).forEach(product => {
        summary.unitsPerProduct[product] += pedido.productosParsed[product];
      });
    });
    return summary;
  };

  const filteredOrders = useMemo(() => {
    return pedidos.filter(pedido => selectedDate ? pedido.fecha_hora.includes(selectedDate) : true);
  }, [pedidos, selectedDate]);

  const summary = useMemo(() => calculateSummaries(filteredOrders), [filteredOrders]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Resumen de Ventas
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="date-selector-label">Seleccionar Fecha</InputLabel>
          <Select
            labelId="date-selector-label"
            value={selectedDate}
            label="Seleccionar Fecha"
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {/* Aquí deberías mapear fechas únicas de tus pedidos */}
          </Select>
        </FormControl>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Total Vendido: {summary.totalSold}
        </Typography>
        {/* Mapear resumen de unidades vendidas por producto */}
      </CardContent>
    </Card>
  );
};

export default SalesSummary;
