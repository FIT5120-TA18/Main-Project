import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrendingDown } from 'react-icons/fi';
import Button from '../common/Button';

export default function MovingCostsGuide() {
  const navigate = useNavigate();

  const costs = [
    {
      item: 'Bond (deposit)',
      range: '$500 - $1,200',
      description: 'Usually 4-6 weeks rent held as security deposit',
    },
    {
      item: 'First rent payment',
      range: '$500 - $1,500',
      description: 'First fortnight or month of rent upfront',
    },
    {
      item: 'Utilities setup',
      range: '$100 - $300',
      description: 'Connection fees for electricity, water, internet',
    },
    {
      item: 'Furniture and bedding',
      range: '$300 - $1,500',
      description: 'Bed, chairs, table - new or secondhand',
    },
    {
      item: 'Kitchen essentials',
      range: '$200 - $600',
      description: 'Pots, pans, cutlery, dishes, utensils',
    },
    {
      item: 'Initial groceries',
      range: '$150 - $400',
      description: 'Pantry staples to get you started',
    },
    {
      item: 'Household items',
      range: '$200 - $500',
      description: 'Cleaning supplies, towels, toilet paper, etc.',
    },
    {
      item: 'Moving costs',
      range: '$0 - $500',
      description: 'Truck hire or removalist if needed',
    },
  ];

  const savingsTips = [
    'Buy secondhand furniture and items from Facebook Marketplace, Gumtree, or op shops',
    'Ask friends and family for hand-me-downs or borrowed items',
    'Move during off-peak times (weekdays or mid-month) for lower costs',
    'Split moving costs with housemates if renting together',
    'Start buying essentials gradually before you move',
    'Check if your new rental is furnished or comes with some items',
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

  const totalMin = costs.reduce((sum, cost) => {
    const min = parseInt(cost.range.split(' - ')[0].replace('$', ''));
    return sum + min;
  }, 0);

  const totalMax = costs.reduce((sum, cost) => {
    const max = parseInt(cost.range.split(' - ')[1].replace('$', ''));
    return sum + max;
  }, 0);

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
            Moving Out: Initial Costs
          </h1>
          <p className="text-gray-600">
            Here is what you should budget for when moving to your own place.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.section variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Initial moving costs</h2>
            <div className="space-y-3">
              {costs.map((cost, idx) => (
                <div key={idx} className="flex justify-between items-start p-3 hover:bg-blue-50 rounded">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{cost.item}</p>
                    <p className="text-sm text-gray-600">{cost.description}</p>
                  </div>
                  <span className="font-bold text-[#1f3c88] whitespace-nowrap ml-4">
                    {cost.range}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-[#1f3c88]">
              <p className="text-gray-700 mb-2">Total Initial Moving Costs</p>
              <p className="text-3xl font-bold text-[#1f3c88]">
                {totalMin.toLocaleString()} - {totalMax.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Budget for approximately weeks of savings at minimum
              </p>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FiTrendingDown className="text-green-600 w-6 h-6" />
              <h2 className="text-2xl font-bold text-green-900">💡 Money-saving tips</h2>
            </div>
            <ul className="space-y-3">
              {savingsTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 bg-white p-3 rounded-lg hover:shadow-md transition-shadow">
                  <span className="text-green-600 font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-gray-800 font-medium">{tip}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-green-100 rounded-lg border-l-4 border-green-600">
              <p className="text-sm text-green-900 font-semibold">
                Tip: You can save 30-50% of moving costs by buying secondhand and planning ahead!
              </p>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="bg-amber-50 border border-amber-200 p-6 rounded-xl"
          >
            <p className="text-gray-700">
              Planning tip: These are one-time costs. After moving, your ongoing monthly
              expenses will be lower. Factor in 6-12 months of savings to comfortably cover
              these costs without financial stress.
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
