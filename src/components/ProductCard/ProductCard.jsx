import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const ProductCard = ({ producto, unidadesVendidas }) => {
  // Función para calcular el total vendido basado en el nombre del producto
  const calcularTotalVendido = (producto, unidades) => {
    const precios = {
      "Crokie Tradicional": 12000,
      "Crookie Blanco": 13000,
      "Mini Cajita de Crookies": 25000
    };

    return precios[producto] * unidades;
  };

  // Calcular el total vendido para este producto
  const totalVendido = calcularTotalVendido(producto, unidadesVendidas);

  // Estilos para las tarjetas con borde negro
  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // sombra suave
    borderRadius: '16px', // bordes redondeados
    backgroundColor: '#f9f9f9', // color de fondo suave
    border: '1px solid black' // borde de color negro
  };

  // Estilos para el texto del total vendido
  const totalStyle = {
    marginTop: '10px',
    fontWeight: 'bold',
    color: '#4a90e2' // color azul suave para darle un toque especial al total
  };

  return (
    <Grid item xs={12} sm={6} md={4} key={producto}> 
      <Card sx={cardStyles}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold'}}>
            {producto}
          </Typography>
          <Typography variant="body1">
            Unidades Vendidas: {unidadesVendidas}
          </Typography>
          {/* Mostrar el total vendido */}
          <Typography variant="body1" style={totalStyle}>
            Total Vendido: ${totalVendido.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;



