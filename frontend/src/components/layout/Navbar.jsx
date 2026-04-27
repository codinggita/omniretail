import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Omni<span>Retail</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/search" className="nav-link">Search</Link>
          <Link to="/locator" className="nav-link">Store Locator</Link>
          
          <div className="nav-actions">
            <Link to="/cart" className="cart-icon">
              🛒 <span className="cart-count">{items.length}</span>
            </Link>
            
            {user ? (
              <div className="user-menu">
                <span className="user-name">Hello, {user.name}</span>
                <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
