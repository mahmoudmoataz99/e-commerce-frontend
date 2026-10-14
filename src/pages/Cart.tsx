import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Grid,
  Paper,
  Divider,
  Skeleton,
} from '@mui/material';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCartStore } from '../store/cartStore';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const { items, isLoading, fetchCart, updateQuantity, removeItem, subtotal } = useCartStore();
  const { enqueueSnackbar } = useSnackbar();
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQty = async (id: number, qty: number) => {
    if (qty < 1) return;
    setUpdating(id);
    try {
      await updateQuantity(id, qty);
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (id: number) => {
    setUpdating(id);
    try {
      await removeItem(id);
      enqueueSnackbar('Item removed', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    } finally {
      setUpdating(null);
    }
  };

  const total = subtotal();
  const tax = total * 0.08;
  const shipping = total >= 75 ? 0 : 5.99;
  const grand = total + tax + shipping;

  if (isLoading && items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton width={200} height={40} sx={{ mb: 3 }} />
        {[1, 2].map((i) => (
          <Skeleton key={i} height={120} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 5 }}>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore our collection and find something you love."
          actionLabel="Start Shopping"
          actionTo="/shop"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper
              key={item.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                display: 'flex',
                gap: 2,
                opacity: updating === item.id ? 0.6 : 1,
              }}
            >
              <Box
                component={Link}
                to={`/product/${item.product.id}`}
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 100, sm: 120 },
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  flexShrink: 0,
                  bgcolor: '#f5f5f5',
                }}
              >
                <Box
                  component="img"
                  src={item.product.image}
                  alt={item.product.name}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component={Link}
                  to={`/product/${item.product.id}`}
                  variant="subtitle1"
                  sx={{ fontWeight: 600, textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {item.product.name}
                </Typography>
                {(item.selected_size || item.selected_color) && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {[item.selected_size, item.selected_color].filter(Boolean).join(' · ')}
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 1 }}>
                  ${Number(item.product.price).toFixed(2)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updating === item.id}
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQty(item.id, item.quantity + 1)}
                      disabled={updating === item.id}
                      sx={{ border: '1px solid', borderColor: 'divider' }}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Box>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleRemove(item.id)}
                    disabled={updating === item.id}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'sticky', top: 88 }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Tax (8%)</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</Typography>
            </Box>
            {total < 75 && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Free shipping on orders over $75
              </Typography>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Total
              </Typography>
              <Typography variant="subtitle1" fontWeight={700}>
                ${grand.toFixed(2)}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/checkout"
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{ py: 1.5 }}
            >
              Checkout
            </Button>
            <Button component={Link} to="/shop" fullWidth sx={{ mt: 1.5 }}>
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
