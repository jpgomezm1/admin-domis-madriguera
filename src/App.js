import React, { useEffect, useState } from 'react';
import { Container, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, IconButton, Typography, Grid, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import OrdersTable from './components/OrdersTable/OrdersTable';
import { deliveryCosts } from './data/domicilios';
import ProductCard from './components/ProductCard/ProductCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
  },
});

const productPrices = {
  1: 12000, // Crokie Tradicional
  2: 13000, // Crookie Blanco
  3: 25000  // Mini Cajita de Crookies
};

const estadoColores = {
  'Pedido Recibido': 'white',
  'Pedido Confirmado': 'yellow',
  'Pedido Enviado': 'lightgreen',
  'Pedido Rechazado': 'red'
};

const estadoOpciones = ['Pedido Recibido', 'Pedido Confirmado', 'Pedido Enviado', 'Pedido Rechazado'];

function App() {
  const [pedidos, setPedidos] = useState([]);
  const [filtroFecha, setFiltroFecha] = useState(new Date().toISOString().slice(0, 10)); // Fecha actual
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [fechasUnicas, setFechasUnicas] = useState([]);
  const [summary, setSummary] = useState({ totalVentas: 0, totalUnidades: {} });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/pedidos`)
      .then(response => {
        const parsedPedidos = response.data.map(pedido => ({
          ...pedido,
          ...calculateTotals(pedido.productos, pedido.barrio)
        }));
        setPedidos(parsedPedidos);
        const fechas = [...new Set(parsedPedidos.map(pedido => pedido.fecha_hora.split(' ')[0]))];
        setFechasUnicas(fechas);
        updateSummary(parsedPedidos);
      })
      .catch(error => console.error('Error al obtener los pedidos:', error));
  }, []);

  useEffect(() => {
    const filteredPedidos = filtroFecha ? pedidos.filter(pedido => pedido.fecha_hora.includes(filtroFecha)) : pedidos;
    updateSummary(filteredPedidos);
  }, [filtroFecha, pedidos]);

  const handleOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEstadoChange = (event, id) => {
    const nuevosPedidos = pedidos.map(pedido => {
      if (pedido.id === id) {
        return { ...pedido, estado: event.target.value };
      }
      return pedido;
    });
    setPedidos(nuevosPedidos);
  };

  const actualizarEstadoPedido = (id, nuevoEstado) => {
    axios.put(`${process.env.REACT_APP_API_URL}/pedido/${id}/estado`, { estado: nuevoEstado })
      .then(response => {
        alert('Estado actualizado');
        const updatedPedidos = pedidos.map(pedido => {
          if (pedido.id === id) {
            return { ...pedido, estado: nuevoEstado };
          }
          return pedido;
        });
        setPedidos(updatedPedidos);
      })
      .catch(error => console.error('Error al actualizar el estado:', error));
  };

  const calculateTotals = (productosJson, barrio) => {
    const productos = JSON.parse(productosJson);
    let totalProducto = 0;
    const productosDict = {
      'Crokie Tradicional': 0,
      'Crookie Blanco': 0,
      'Mini Cajita de Crookies': 0
    };

    productos.forEach(producto => {
      const cantidad = producto.quantity;
      const precio = productPrices[producto.id] || 0;
      totalProducto += cantidad * precio;
      switch(producto.id) {
        case 1:
          productosDict['Crokie Tradicional'] += cantidad;
          break;
        case 2:
          productosDict['Crookie Blanco'] += cantidad;
          break;
        case 3:
          productosDict['Mini Cajita de Crookies'] += cantidad;
          break;
        default:
          break; // O manejar productos desconocidos
      }
    });

    const deliveryCost = deliveryCosts[barrio] || 0;
    const totalPedido = totalProducto + deliveryCost;

    return { productosParsed: productosDict, totalProducto, totalPedido, deliveryCost };
  };

  const updateSummary = (pedidos) => {
    let totalVentas = 0;
    const totalUnidades = {
      'Crokie Tradicional': 0,
      'Crookie Blanco': 0,
      'Mini Cajita de Crookies': 0
    };
  
    // Filtrar los pedidos con estados confirmados y enviados
    const pedidosFiltrados = pedidos.filter(pedido => ['Pedido Confirmado', 'Pedido Enviado'].includes(pedido.estado));
  
    pedidosFiltrados.forEach(pedido => {
      totalVentas += pedido.totalPedido;
      Object.keys(pedido.productosParsed).forEach(producto => {
        totalUnidades[producto] += pedido.productosParsed[producto];
      });
    });
  
    setSummary({ totalVentas, totalUnidades });
  };

  const renderProductCards = () => {
    return Object.keys(summary.totalUnidades).map(producto => (
      <ProductCard
        key={producto}
        producto={producto}
        unidadesVendidas={summary.totalUnidades[producto]}
        precioUnitario={productPrices[producto]}
      />
    ));
  };

  const pedidosFiltrados = filtroFecha ? pedidos.filter(pedido => pedido.fecha_hora.includes(filtroFecha)) : pedidos;

  const cardStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '16px',
    backgroundColor: '#e3f2fd',
    border: '1px solid black',
    padding: '20px',
    marginTop: '10px'
  };


  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Container maxWidth="xxl" sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Card sx={cardStyles}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold'}}>
                  Total Ventas
                </Typography>
                <Typography variant="h4" component="div" fontWeight="bold" color="primary.main">
                  ${summary.totalVentas.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {renderProductCards()}
        </Grid>
        <FormControl margin="normal" sx={{ minWidth: 165, maxWidth: 165 }}>
          <InputLabel id="filtro-fecha-label">Filtrar por Fecha</InputLabel>
          <Select
            labelId="filtro-fecha-label"
            value={filtroFecha}
            label="Filtrar por Fecha"
            onChange={(e) => setFiltroFecha(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {fechasUnicas.map(fecha => (
              <MenuItem key={fecha} value={fecha}>{fecha}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <OrdersTable
          pedidosFiltrados={pedidosFiltrados}
          estadoColores={estadoColores}
          estadoOpciones={estadoOpciones}
          handleEstadoChange={handleEstadoChange}
          actualizarEstadoPedido={actualizarEstadoPedido}
          handleOpen={handleOpen}
        />
      </Container>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Comprobante de Pago
          <IconButton aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img src={selectedImage} alt="Comprobante de Pago" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </div>
    </ThemeProvider>
  );
}

export default App;

