import { motion } from 'framer-motion';

export default function TileSelect({ options, value, onChange, label }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {options.map((option) => (
          <motion.button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`py-3 px-3 rounded-lg font-medium transition-all border-2 ${
              value === option
                ? 'bg-[#1f3c88] text-white border-[#1f3c88]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-[#1f3c88]'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
