import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Rating,
  Skeleton,
} from '@mui/material';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import type { Product } from '../types';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useNavigate } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useCartStore((s) => s.addToCart);
  const { isInWishlist, toggle } = useWishlistStore();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  const price = Number(product.price);
  const original = product.original_price ? Number(product.original_price) : null;
  const discount =
    original && original > price ? Math.round(((original - price) / original) * 100) : 0;
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setWishlistLoading(true);
    try {
      const nowIn = await toggle(product.id);
      enqueueSnackbar(nowIn ? 'Added to wishlist' : 'Removed from wishlist', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCartLoading(true);
    try {
      await addToCart(product.id, 1);
      enqueueSnackbar('Added to cart', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar(err instanceof Error ? err.message : 'Failed', { variant: 'error' });
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        textDecoration: 'none',
        color: 'inherit',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          '& .product-actions': { opacity: 1 },
          '& .product-img': { transform: 'scale(1.04)' },
        },
      }}
    >
      {/* Badges */}
      <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {product.tags?.includes('new') && (
          <Chip label="New" size="small" sx={{ bgcolor: '#1a1a1a', color: '#fff', fontWeight: 600, height: 24 }} />
        )}
        {discount > 0 && (
          <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: '#c9a86c', color: '#1a1a1a', fontWeight: 600, height: 24 }} />
        )}
        {!product.in_stock && (
          <Chip label="Sold Out" size="small" sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 600, height: 24 }} />
        )}
      </Box>

      {/* Wishlist */}
      <IconButton
        className="product-actions"
        onClick={handleWishlist}
        disabled={wishlistLoading}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 2,
          bgcolor: 'rgba(255,255,255,0.9)',
          opacity: { xs: 1, md: inWishlist ? 1 : 0 },
          transition: 'opacity 0.2s',
          '&:hover': { bgcolor: '#fff' },
        }}
        size="small"
      >
        <Heart
          size={18}
          fill={inWishlist ? '#d32f2f' : 'none'}
          color={inWishlist ? '#d32f2f' : '#1a1a1a'}
        />
      </IconButton>

      {/* Image */}
      <Box sx={{ position: 'relative', pt: '125%', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
        {!imgLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{ position: 'absolute', inset: 0 }}
            animation="wave"
          />
        )}
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          className="product-img"
          onLoad={() => setImgLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
            opacity: imgLoaded ? 1 : 0,
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, '&:last-child': { pb: 2 } }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textTransform: 'uppercase', letterSpacing: 0.8, mb: 0.5 }}
        >
          {product.category?.name || 'Collection'}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 500,
            mb: 0.5,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Rating value={Number(product.rating)} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            ({product.review_count})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${price.toFixed(2)}
            </Typography>
            {original && original > price && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${original.toFixed(2)}
              </Typography>
            )}
          </Box>

          <IconButton
            className="product-actions"
            onClick={handleAddToCart}
            disabled={!product.in_stock || cartLoading}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: '#fff',
              opacity: { xs: 1, md: 0 },
              transition: 'opacity 0.2s',
              '&:hover': { bgcolor: 'primary.light' },
              '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
            }}
          >
            <ShoppingBag size={16} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
