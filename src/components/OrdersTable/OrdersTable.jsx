import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, IconButton, Typography, Button
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import * as XLSX from 'xlsx';
import DownloadIcon from '@mui/icons-material/Download';

const OrdersTable = ({ pedidosFiltrados, estadoColores, estadoOpciones, handleEstadoChange, actualizarEstadoPedido, handleOpen }) => {

  // Función para exportar la tabla a Excel
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById('orders-table'));
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    XLSX.writeFile(wb, 'pedidos.xlsx');
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table id="orders-table" aria-label="simple table">
          <TableHead>
            <TableRow>
              {[
                'Nombre', 'Teléfono', 'Dirección', 'Barrio', 
                'Crokie Tradicional', 'Crookie Blanco', 'Mini Cajita de Crookies', 
                'Costo de Domicilio', 'Total Producto', 'Total Pedido', 'Método de Pago', 
                'Fecha Pedido', 'Estado', 'Actualizar'
              ].map(header => (
                <TableCell key={header} align="center" sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  padding: 1
                }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidosFiltrados.map((pedido) => (
              <TableRow key={pedido.id} style={{ backgroundColor: estadoColores[pedido.estado] }}>
                <TableCell align="center">{pedido.nombre_completo}</TableCell>
                <TableCell align="center">{pedido.numero_telefono}</TableCell>
                <TableCell align="center">{pedido.direccion}</TableCell>
                <TableCell align="center">{pedido.barrio}</TableCell>
                <TableCell align="center">{pedido.productosParsed['Crokie Tradicional']}</TableCell>
                <TableCell align="center">{pedido.productosParsed['Crookie Blanco']}</TableCell>
                <TableCell align="center">{pedido.productosParsed['Mini Cajita de Crookies']}</TableCell>
                <TableCell align="center">{pedido.deliveryCost.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell align="center">{pedido.totalProducto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell align="center">{pedido.totalPedido.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</TableCell>
                <TableCell align="center">
                  {pedido.metodo_pago === 'Transferencia' ? (
                    <Typography
                      variant="body2"
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: 'black',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 255, 0.04)',
                        }
                      }}
                      onClick={() => handleOpen(pedido.comprobante_pago)}
                    >
                      Transferencia
                    </Typography>
                  ) : pedido.metodo_pago}
                </TableCell>
                <TableCell align="center">{pedido.fecha_hora}</TableCell>
                <TableCell align="center">
                  <Select
                    value={pedido.estado}
                    onChange={(e) => handleEstadoChange(e, pedido.id)}
                    sx={{ color: 'black', minWidth: 140, maxWidth: 140, fontSize: '12px', fontWeight: 'bold' }}
                  >
                    {estadoOpciones.map(opcion => (
                      <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => actualizarEstadoPedido(pedido.id, pedido.estado)}>
                    <DoneIcon sx={{ color: 'green' }}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={exportToExcel} sx={{ backgroundColor: '#0F7940', '&:hover': { backgroundColor: '#3e9366' }, color: '#fff', fontFamily: 'Poppins', borderRadius: '10px', textTransform: 'none', padding: '10px 7px', fontSize: '17px', mt: 2, mb: 2, ml: 1 }}>
        <DownloadIcon /> Descargar en Excel
      </Button>
    </div>
  );
};

export default OrdersTable;



