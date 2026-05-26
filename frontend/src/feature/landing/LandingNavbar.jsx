import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { X, Building2 } from 'lucide-react';
import './style/LandingNavbar.css';

function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Tính năng', href: '#features' },
    { label: 'Cách sử dụng', href: '#how-it-works' },
    { label: 'Đánh giá', href: '#testimonials' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} className="mobile-drawer">
      <Box className="drawer-header">
        <IconButton onClick={handleDrawerToggle}>
          <X />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton component="a" href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/signin">
            <ListItemText primary="Đăng nhập" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={RouterLink} to="/signup">
            <ListItemText primary="Đăng ký miễn phí" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
        <AppBar 
          position="sticky"
          className={`landing-navbar ${scrollY > 50 ? 'scrolled' : ''}`}
          elevation={0}
          sx={{
              top: 0,
              background: scrollY > 50 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'linear-gradient(to bottom right, #ffffff 0%, #eff6ff 50%, #b6c6f6 100%)',
              backdropFilter: scrollY > 50 ? 'blur(10px)' : 'none',
              boxShadow: scrollY > 50 
              ? '0 2px 10px rgba(0, 0, 0, 0.15)' 
              : 'none',
              transition: 'all 0.3s ease'
          }}
        >

        <Container maxWidth="lg">
          <Toolbar disableGutters className="navbar-toolbar">
            {/* Logo */}
            <Box className="navbar-logo">
              <Building2 size={32} className="navbar-logo-icon" />
              <Typography variant="h6" component="div" className="navbar-logo-text">
                VIM SMARTCITY
              </Typography>
            </Box>

            {/* Desktop Menu */}
            <Box className="desktop-menu">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Desktop Auth Buttons */}
            <Box className="desktop-auth-buttons">
              <Button component={RouterLink} to="/signin" className="signin-button">
                Đăng nhập
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained" className="signup-button">
                Đăng ký miễn phí
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            {/* <IconButton
              className="mobile-menu-icon"
              onClick={handleDrawerToggle}
            > */}
              {/* <Menu />
            </IconButton> */}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="mobile-drawer-container"
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default LandingNavbar;
