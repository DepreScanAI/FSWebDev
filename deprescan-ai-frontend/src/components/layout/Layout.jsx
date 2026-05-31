import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';

//wrapper untuk membungkus konten main terdapat navbar dan footer
export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

Layout.propTypes = { children: PropTypes.node.isRequired };
