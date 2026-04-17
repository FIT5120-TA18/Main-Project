import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import Button from '../components/common/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-[#1f3c88] mb-4">404</h1>
        <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Page not found</p>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2"
        >
          <FiHome /> Back to Home
        </Button>
      </motion.div>
    </div>
  );
}
