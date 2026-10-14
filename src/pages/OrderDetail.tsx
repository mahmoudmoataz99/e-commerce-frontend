import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Button,
  Skeleton,
  Divider,
  Grid,
} from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Order } from '../types';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<Order>(`/orders/${id}`)
      .then((r) => setOrder(r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Skeleton height={40} width={200} sx={{ mb: 3 }} />
        <Skeleton height={200} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Order not found</Typography>
        <Button component={Link} to="/orders" startIcon={<ArrowLeft size={18} />}>
          Back to Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Button component={Link} to="/orders" startIcon={<ArrowLeft size={18} />} sx={{ mb: 3 }}>
        Back to Orders
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
            {order.order_number}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>
        <Chip label={order.status} color="primary" sx={{ textTransform: 'capitalize' }} />
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Items
        </Typography>
        {order.items?.map((item) => (
          <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box
              component="img"
              src={item.product_image}
              alt={item.product_name}
              sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={500}>{item.product_name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {[item.selected_size, item.selected_color].filter(Boolean).join(' · ')}
                {item.selected_size || item.selected_color ? ' · ' : ''}
                Qty {item.quantity}
              </Typography>
              <Typography fontWeight={600}>${Number(item.price).toFixed(2)}</Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Shipping Address
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.address}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
              Payment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.payment_method}
            </Typography>
            {order.promo_code && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Promo: {order.promo_code}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography>${Number(order.subtotal).toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Tax</Typography>
          <Typography>${Number(order.tax).toFixed(2)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography color="text.secondary">Shipping</Typography>
          <Typography>
            {Number(order.shipping_cost) === 0 ? 'Free' : `$${Number(order.shipping_cost).toFixed(2)}`}
          </Typography>
        </Box>
        {Number(order.discount) > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color="success.main">Discount</Typography>
            <Typography color="success.main">−${Number(order.discount).toFixed(2)}</Typography>
          </Box>
        )}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography fontWeight={700}>Total</Typography>
          <Typography fontWeight={700}>${Number(order.total).toFixed(2)}</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
