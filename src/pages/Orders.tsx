import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Skeleton,
  Divider,
} from '@mui/material';
import { Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Order } from '../types';
import EmptyState from '../components/EmptyState';

const statusColor: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'> = {
  processing: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Order[]>('/orders')
      .then((r) => setOrders(r.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        My Orders
      </Typography>

      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} height={100} sx={{ mb: 2, borderRadius: 2 }} />
        ))
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
          actionLabel="Start Shopping"
          actionTo="/shop"
        />
      ) : (
        orders.map((order) => (
          <Paper
            key={order.id}
            elevation={0}
            component={Link}
            to={`/orders/${order.id}`}
            sx={{
              p: 2.5,
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              textDecoration: 'none',
              color: 'inherit',
              display: 'block',
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 2 },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {order.order_number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
              <Chip
                label={order.status}
                size="small"
                color={statusColor[order.status] || 'default'}
                sx={{ textTransform: 'capitalize' }}
              />
            </Box>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700}>${Number(order.total).toFixed(2)}</Typography>
                <ChevronRight size={18} color="#6b6b6b" />
              </Box>
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
}
