import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { api, getErrorMessage } from '../api/client';
import { useCartStore } from '../store/cartStore';
import type { Address, PaymentMethod, Order } from '../types';

export default function Checkout() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { items, fetchCart, subtotal, clearCart } = useCartStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [shippingMethod, setShippingMethod] = useState('std');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const load = async () => {
      await fetchCart();
      try {
        const [addrRes, payRes] = await Promise.all([
          api.get<Address[]>('/addresses'),
          api.get<PaymentMethod[]>('/payment-methods'),
        ]);
        setAddresses(addrRes.data);
        setPayments(payRes.data);
        const defAddr = addrRes.data.find((a) => a.is_default) || addrRes.data[0];
        const defPay = payRes.data.find((p) => p.is_default) || payRes.data[0];
        if (defAddr) setSelectedAddress(defAddr.id);
        if (defPay) setSelectedPayment(defPay.id);
      } catch {
        enqueueSnackbar('Failed to load checkout data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchCart, enqueueSnackbar]);

  const total = subtotal();
  const tax = total * 0.08;
  const shippingCost = shippingMethod === 'exp' ? 9.99 : total >= 75 ? 0 : 5.99;
  const grand = total + tax - promoDiscount + shippingCost;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    try {
      const { data } = await api.post<{ valid: boolean; discount: number; message: string }>(
        '/promo-codes/check',
        { code: promoCode, subtotal: total }
      );
      if (data.valid) {
        setPromoDiscount(data.discount);
        setPromoApplied(promoCode.toUpperCase());
        enqueueSnackbar(data.message || 'Promo applied!', { variant: 'success' });
      } else {
        enqueueSnackbar(data.message || 'Invalid promo code', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      enqueueSnackbar('Please select address and payment method', { variant: 'warning' });
      return;
    }
    const addr = addresses.find((a) => a.id === selectedAddress);
    const pay = payments.find((p) => p.id === selectedPayment);
    if (!addr || !pay) return;

    setSubmitting(true);
    try {
      const { data } = await api.post<Order>('/orders', {
        address: addr.address,
        payment_method: `${pay.label} •••• ${pay.last4}`,
        shipping_method: shippingMethod,
        promo_code: promoApplied || null,
      });
      setOrder(data);
      await clearCart();
      enqueueSnackbar('Order placed successfully!', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err), { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (order) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <CheckCircle size={64} color="#4caf50" strokeWidth={1.5} />
        <Typography variant="h4" sx={{ mt: 3, mb: 1 }}>
          Order Confirmed!
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          Order number: <strong>{order.order_number}</strong>
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Total: ${Number(order.total).toFixed(2)}
        </Typography>
        <Button component={Link} to="/orders" variant="contained" sx={{ mr: 1.5 }}>
          View Orders
        </Button>
        <Button component={Link} to="/shop" variant="outlined">
          Continue Shopping
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Your cart is empty</Typography>
        <Button component={Link} to="/shop" variant="contained">
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 4, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
        Checkout
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          {/* Address */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Shipping Address
            </Typography>
            {addresses.length === 0 ? (
              <Alert severity="warning">
                No addresses found.{' '}
                <Link to="/account/addresses">Add one</Link>
              </Alert>
            ) : (
              <FormControl fullWidth>
                <RadioGroup
                  value={selectedAddress}
                  onChange={(e) => setSelectedAddress(Number(e.target.value))}
                >
                  {addresses.map((a) => (
                    <FormControlLabel
                      key={a.id}
                      value={a.id}
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="subtitle2">
                            {a.label} {a.is_default && '(Default)'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {a.address}
                          </Typography>
                        </Box>
                      }
                      sx={{ mb: 1, alignItems: 'flex-start' }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Paper>

          {/* Payment */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Payment Method
            </Typography>
            {payments.length === 0 ? (
              <Alert severity="warning">
                No payment methods.{' '}
                <Link to="/account/payments">Add one</Link>
              </Alert>
            ) : (
              <FormControl fullWidth>
                <RadioGroup
                  value={selectedPayment}
                  onChange={(e) => setSelectedPayment(Number(e.target.value))}
                >
                  {payments.map((p) => (
                    <FormControlLabel
                      key={p.id}
                      value={p.id}
                      control={<Radio />}
                      label={`${p.label} •••• ${p.last4}${p.is_default ? ' (Default)' : ''}`}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          </Paper>

          {/* Shipping */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Shipping Method
            </Typography>
            <FormControl fullWidth>
              <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
                <FormControlLabel
                  value="std"
                  control={<Radio />}
                  label={`Standard (5–7 days) — ${total >= 75 ? 'Free' : '$5.99'}`}
                />
                <FormControlLabel value="exp" control={<Radio />} label="Express (2–3 days) — $9.99" />
              </RadioGroup>
            </FormControl>
          </Paper>

          {/* Promo */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Promo Code
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                size="small"
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={!!promoApplied}
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={applyPromo}
                disabled={!!promoApplied || !promoCode.trim()}
              >
                Apply
              </Button>
            </Box>
            {promoApplied && (
              <Alert severity="success" sx={{ mt: 1.5 }}>
                {promoApplied} applied (−${promoDiscount.toFixed(2)})
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Summary */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, position: 'sticky', top: 88 }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Order Summary
            </Typography>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <Box
                  component="img"
                  src={item.product.image}
                  alt=""
                  sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover' }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap fontWeight={500}>
                    {item.product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Qty {item.quantity} · ${Number(item.product.price).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Tax</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</Typography>
            </Box>
            {promoDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="success.main">Discount</Typography>
                <Typography color="success.main">−${promoDiscount.toFixed(2)}</Typography>
              </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700}>${grand.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={placeOrder}
              disabled={submitting || !selectedAddress || !selectedPayment}
              sx={{ py: 1.5 }}
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
