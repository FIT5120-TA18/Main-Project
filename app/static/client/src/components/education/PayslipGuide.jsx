import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import Button from '../common/Button';

export default function PayslipGuide() {
  const navigate = useNavigate();

  const terms = [
    {
      term: 'Gross Income',
      explanation:
        'Your total earnings before any deductions. This is the amount your employer pays you before taxes, superannuation, and other withholdings.',
      example: '$800',
    },
    {
      term: 'Tax Withheld',
      explanation:
        'Income tax your employer deducts from your pay and forwards to the ATO. The amount depends on your income level and tax file number details.',
      example: '-$104 (13%)',
    },
    {
      term: 'Superannuation',
      explanation:
        'Compulsory retirement savings. Your employer contributes 11.5% of your gross income (as of 2024) to your superannuation account.',
      example: '-$92 (11.5%)',
    },
    {
      term: 'Net Pay',
      explanation:
        'Your take-home pay after all deductions. This is what actually goes into your bank account each pay period.',
      example: '$604',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4"
          >
            <FiArrowLeft /> Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f3c88] mb-2">
            Understanding Your Payslip
          </h1>
          <p className="text-gray-600">
            Learn what each component of your payslip means and how it affects your take-home
            pay.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {terms.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#1f3c88]"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.term}</h3>
              <p className="text-gray-600 mb-3">{item.explanation}</p>
              <div className="bg-blue-50 p-3 rounded text-sm font-mono text-[#1f3c88]">
                {item.example}
              </div>
            </motion.div>
          ))}

          <motion.section variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Example breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Gross Weekly Income</span>
                <span className="font-bold text-gray-900">$800.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Tax Withheld (13%)</span>
                <span className="font-bold text-red-600">-$104.00</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-700">Superannuation (11.5%)</span>
                <span className="font-bold text-gray-600">-$92.00</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-blue-50 px-3 rounded mt-4">
                <span className="font-semibold text-gray-900">Net Weekly Pay</span>
                <span className="text-2xl font-bold text-[#1f3c88]">$604.00</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="bg-amber-50 border border-amber-200 p-6 rounded-xl"
          >
            <p className="text-gray-700">
              amount). Your gross income includes amounts that go to taxes and superannuation that              
              you won't see.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
