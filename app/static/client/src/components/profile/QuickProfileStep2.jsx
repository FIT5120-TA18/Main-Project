import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiArrowLeft, FiHome, FiDollarSign, FiCompass } from 'react-icons/fi';
import { useAppStore } from '../../store/useAppStore';
import Button from '../common/Button';

export default function QuickProfileStep2() {
  const navigate = useNavigate();
  const { selectedGoals, setSelectedGoals } = useAppStore();

  const goals = [
    {
      id: 'moveout',
      title: 'Move out',
      description: 'Explore what it takes to live independently',
      icon: FiHome,
    },
    {
      id: 'savemoney',
      title: 'Save money',
      description: 'Find pathways to grow your savings',
      icon: FiDollarSign,
    },
    {
      id: 'understand',
      title: 'Understand options',
      description: 'Explore different life scenarios',
      icon: FiCompass,
    },
  ];

  const toggleGoal = (goalId) => {
    if (selectedGoals.includes(goalId)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalId));
    } else {
      setSelectedGoals([...selectedGoals, goalId]);
    }
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      navigate('/pathway-builder');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
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
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f3c88] mb-2">
            What are your goals?
          </h1>
          <p className="text-gray-600">Step 2 of 2 - Select one or more goals</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <motion.div
              initial={{ width: '50%' }}
              animate={{ width: '100%' }}
              className="bg-[#1f3c88] h-full rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 mb-8"
        >
          {goals.map((goal) => {
            const Icon = goal.icon;
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <motion.button
                key={goal.id}
                variants={itemVariants}
                onClick={() => toggleGoal(goal.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-[#1f3c88] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-[#1f3c88]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-[#1f3c88] bg-[#1f3c88]'
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <span className="text-white font-bold">check</span>}
                  </div>
                  <Icon
                    className={`w-6 h-6 ${
                      isSelected ? 'text-[#1f3c88]' : 'text-gray-400'
                    }`}
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{goal.title}</h3>
                    <p className="text-gray-600 text-sm">{goal.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/quick-profile-step-1')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </Button>
          <Button
            size="md"
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="flex items-center gap-2 ml-auto"
          >
            Build My Pathways <FiArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
