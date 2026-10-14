import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Search, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { Package } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category') || 'all';
  const tag = searchParams.get('tag') || '';
  const search = searchParams.get('search') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (tag) params.set('tag', tag);
      if (search) params.set('search', search);
      const { data } = await api.get<Product[]>(`/products?${params.toString()}`);
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, tag, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    api.get<Category[]>('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const handleCategory = (slug: string) => {
    const next = new URLSearchParams(searchParams);
    if (slug === 'all') next.delete('category');
    else next.set('category', slug);
    setSearchParams(next);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput.trim()) next.set('search', searchInput.trim());
    else next.delete('search');
    setSearchParams(next);
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return Number(a.price) - Number(b.price);
    if (sort === 'price-desc') return Number(b.price) - Number(a.price);
    if (sort === 'rating') return Number(b.rating) - Number(a.rating);
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ mb: 1, fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
        {tag === 'sale' ? 'Sale' : tag === 'new' ? 'New Arrivals' : tag === 'bestseller' ? 'Bestsellers' : 'Shop'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
      </Typography>

      {/* Filters bar */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
          alignItems: 'center',
        }}
      >
        <Box component="form" onSubmit={handleSearch} sx={{ flex: { xs: '1 1 100%', sm: '0 1 280px' } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>
            <MenuItem value="default">Sort by</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="rating">Top Rated</MenuItem>
            <MenuItem value="name">Name A–Z</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, v) => v && setView(v)}
          size="small"
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          <ToggleButton value="grid"><LayoutGrid size={18} /></ToggleButton>
          <ToggleButton value="list"><List size={18} /></ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Category chips */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
        <Chip
          label="All"
          onClick={() => handleCategory('all')}
          color={category === 'all' ? 'primary' : 'default'}
          variant={category === 'all' ? 'filled' : 'outlined'}
        />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            onClick={() => handleCategory(c.slug)}
            color={category === c.slug ? 'primary' : 'default'}
            variant={category === c.slug ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      {/* Products */}
      {loading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={6} sm={4} md={3} key={i}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              <Skeleton width="70%" sx={{ mt: 1 }} />
              <Skeleton width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your filters or search term."
          actionLabel="Clear filters"
          actionTo="/shop"
        />
      ) : (
        <Grid container spacing={2.5}>
          {sorted.map((p) => (
            <Grid
              item
              xs={view === 'grid' ? 6 : 12}
              sm={view === 'grid' ? 4 : 6}
              md={view === 'grid' ? 3 : 6}
              key={p.id}
            >
              <ProductCard product={p} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
