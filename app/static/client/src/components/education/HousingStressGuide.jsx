import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiTrendingDown, FiHome, FiDollarSign } from 'react-icons/fi';
import Button from '../common/Button';

export default function HousingStressGuide() {
  const navigate = useNavigate();

  const reasons = [
    {
      icon: FiAlertCircle,
      title: 'Impacts your wellbeing',
      description: 'Housing stress can affect mental and physical health',
    },
    {
      icon: FiTrendingDown,
      title: 'Reduces savings capacity',
      description: 'High rent leaves less money for emergencies and goals',
    },
    {
      icon: FiHome,
      title: 'Limits life choices',
      description: 'Financial pressure can restrict career and study options',
    },
    {
      icon: FiDollarSign,
      title: 'Creates vulnerability',
      description: 'One income disruption can lead to housing insecurity',
    },
  ];

  const solutions = [
    {
      title: 'Consider different living arrangements',
      description:
        'Explore renting with housemates, staying with family longer, or house-sitting to reduce costs',
    },
    {
      title: 'Increase your income gradually',
      description:
        'Look for career development, higher-paying roles, or side income sources',
    },
    {
      title: 'Move to more affordable areas',
      description:
        'Research regions with lower rent and consider remote work options',
    },
    {
      title: 'Plan your timing',
      description: 'Build savings before moving out or coordinate moves with income increases',
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
            Understanding Housing Stress
          </h1>
          <p className="text-gray-600">
            When rent or housing costs take more than 30% of your income, you may be
            experiencing housing stress.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.section variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why it matters</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reasons.map((reason, idx) => {
                const Icon = reason.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <Icon className="text-[#d92d20] flex-shrink-0 w-6 h-6 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{reason.title}</h3>
                      <p className="text-sm text-gray-600">{reason.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you can do</h2>
            <div className="space-y-4">
              {solutions.map((solution, idx) => (
                <div key={idx} className="border-l-4 border-[#1f3c88] pl-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{solution.title}</h3>
                  <p className="text-gray-600 text-sm">{solution.description}</p>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="bg-blue-50 border border-blue-200 p-6 rounded-xl"
          >
            <p className="text-gray-700">
              and find a living arrangement that works for your budget.              
            </p>
          </motion.section>
        </motion.div>
      </div>
    </div>
  );
}
