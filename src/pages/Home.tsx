import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Skeleton,
  Chip,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowRight} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { api } from '../api/client';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

const HERO_SLIDES = [
  {
    title: 'New Season Arrivals',
    subtitle: 'Discover the latest trends in premium fashion',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80',
    cta: 'Shop New',
    to: '/shop?tag=new',
  },
  {
    title: 'Up to 40% Off',
    subtitle: 'Limited time offers on selected pieces',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80',
    cta: 'Shop Sale',
    to: '/shop?tag=sale',
  },
  {
    title: 'Timeless Essentials',
    subtitle: 'Curated wardrobe staples for every day',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80',
    cta: 'Explore',
    to: '/shop',
  },
];

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [sale, setSale] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, saleRes, catRes] = await Promise.all([
          api.get<Product[]>('/products?tag=bestseller'),
          api.get<Product[]>('/products?tag=sale'),
          api.get<Category[]>('/categories'),
        ]);
        setFeatured(featRes.data.slice(0, 8));
        setSale(saleRes.data.slice(0, 8));
        setCategories(catRes.data);
      } catch {
        // fallback: get all
        try {
          const { data } = await api.get<Product[]>('/products');
          setFeatured(data.slice(0, 8));
          setSale(data.filter((p) => p.tags?.includes('sale')).slice(0, 8));
        } catch { /* ignore */ }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box>
      {/* Hero Swiper */}
      <Box sx={{ position: 'relative' }}>
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          style={{ height: 'min(70vh, 560px)' }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <SwiperSlide key={i}>
              <Box
                sx={{
                  height: '100%',
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.45)), url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: '#fff',
                  px: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                      textShadow: '0 2px 12px rgba(0,0,0,0.3)',
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 400,
                      mb: 3,
                      opacity: 0.9,
                      fontSize: { xs: '1rem', md: '1.25rem' },
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Button
                    component={Link}
                    to={slide.to}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowRight size={18} />}
                    sx={{
                      bgcolor: '#fff',
                      color: '#1a1a1a',
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                    }}
                  >
                    {slide.cta}
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 1 }}>
          Shop by Category
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
          Find exactly what you're looking for
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={2} key={cat.id}>
              <Box
                component={Link}
                to={`/shop?category=${cat.slug}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  textDecoration: 'none',
                  color: 'text.primary',
                  transition: 'all 0.25s',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: 3,
                    transform: 'translateY(-3px)',
                    '& .cat-icon': { color: 'secondary.main' },
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {cat.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bestsellers */}
      <Box sx={{ bgcolor: 'neutral.main', py: { xs: 5, md: 7 } }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
            <Box>
              <Chip label="Popular" size="small" sx={{ mb: 1, bgcolor: 'secondary.main', fontWeight: 600 }} />
              <Typography variant="h4">Bestsellers</Typography>
            </Box>
            <Button component={Link} to="/shop?tag=bestseller" endIcon={<ArrowRight size={16} />}>
              View all
            </Button>
          </Box>
          <Grid container spacing={2.5}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Grid item xs={6} sm={4} md={3} key={i}>
                    <Skeleton variant="rectangular" height={320} sx={{ borderRadius: 2 }} />
                    <Skeleton width="60%" sx={{ mt: 1 }} />
                    <Skeleton width="40%" />
                  </Grid>
                ))
              : featured.map((p) => (
                  <Grid item xs={6} sm={4} md={3} key={p.id}>
                    <ProductCard product={p} />
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      {/* Sale */}
      {sale.length > 0 && (
        <Container maxWidth="xl" sx={{ py: { xs: 5, md: 7 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
            <Box>
              <Chip label="Limited Offer" size="small" sx={{ mb: 1, bgcolor: 'error.main', color: '#fff', fontWeight: 600 }} />
              <Typography variant="h4">On Sale</Typography>
            </Box>
            <Button component={Link} to="/shop?tag=sale" endIcon={<ArrowRight size={16} />}>
              View all
            </Button>
          </Box>
          <Grid container spacing={2.5}>
            {sale.map((p) => (
              <Grid item xs={6} sm={4} md={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* CTA Banner */}
      <Box
        sx={{
          bgcolor: '#1a1a1ad8',
          color: '#fff',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ mb: 2, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Elevate Your Style
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.75, mb: 3 }}>
            Join thousands of customers who trust E-Commerce for premium quality and timeless design.
          </Typography>
          <Button
            component={Link}
            to="/shop"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'secondary.main',
              color: '#1a1a1a',
              px: 4,
              fontWeight: 600,
              '&:hover': { bgcolor: 'secondary.light' },
            }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
