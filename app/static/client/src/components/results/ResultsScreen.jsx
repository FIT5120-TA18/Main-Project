import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiRotateCcw, FiInfo } from 'react-icons/fi';
import { useAppStore } from '../../store/useAppStore';
import Button from '../common/Button';

export default function ResultsScreen() {
  const navigate = useNavigate();
  const { profile, pathways, results } = useAppStore();

  const stateMedianIncome = {
    NSW: 650,
    VIC: 630,
    QLD: 620,
    WA: 680,
    SA: 600,
    TAS: 580,
    ACT: 670,
    NT: 660,
  };

  const getRelativeIndicator = (userIncome, medianIncome) => {
    const ratio = userIncome / medianIncome;
    if (ratio < 0.85) return { label: '⬇ Below average', color: 'text-orange-600' };
    if (ratio > 1.15) return { label: '⬆ Above average', color: 'text-green-600' };
    return { label: '➡ Typical', color: 'text-blue-600' };
  };

  const calculateResults = () => {
    const weeklyIncome = parseFloat(profile.weeklyIncome) || 0;
    const monthlyIncome = weeklyIncome * 4.33;

    const calculatePathway = (pathway) => {
      const rentRanges = {
        'At home': [0, 100],
        Renting: [250, 450],
        Homeowner: [100, 300],
        Other: [150, 350],
      };

      const rentRange = rentRanges[pathway.living] || [150, 300];
      const weeklyRent = rentRange[0] + (rentRange[1] - rentRange[0]) / 2;
      const monthlyRent = weeklyRent * 4.33;

      const monthlyLiving = 400 + (pathway.workHours > 30 ? 200 : 100);
      const monthlyExpenses = monthlyRent + monthlyLiving;
      const monthlySurplus = monthlyIncome - monthlyExpenses;

      const isAffordable = monthlySurplus > 200;
      const housingStressRatio = (monthlyRent / monthlyIncome) * 100;

      return {
        weeklyIncomeRange: `$${Math.floor(weeklyIncome)} - $${Math.ceil(weeklyIncome * 1.1)}`,
        weeklyRentRange: `$${Math.floor(weeklyRent)} - $${Math.ceil(weeklyRent * 1.1)}`,
        monthlyLivingEst: `$${monthlyLiving}`,
        monthlySurplus: monthlySurplus,
        isAffordable,
        housingStressRatio,
      };
    };

    const pathwayAResults = calculatePathway(pathways.pathwayA);
    const pathwayBResults = pathways.pathwayB
      ? calculatePathway(pathways.pathwayB)
      : null;

    return {
      monthlyIncome,
      pathwayA: pathwayAResults,
      pathwayB: pathwayBResults,
    };
  };

  const displayResults = results || calculateResults();

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

  const PathwayResult = ({ name, result, userState, medianIncome }) => {
    const weeklyIncomeNum = parseFloat(profile.weeklyIncome) || 0;
    const indicator = getRelativeIndicator(weeklyIncomeNum, medianIncome);
    
    return (
      <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${result.isAffordable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
              }`}
          >
            {result.isAffordable ? 'Affordable' : 'Housing Stress Risk'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600 text-sm mb-1">Weekly Income</p>
            <p className="text-lg font-bold text-gray-900">{result.weeklyIncomeRange}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Weekly Rent</p>
            <p className="text-lg font-bold text-gray-900">{result.weeklyRentRange}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Monthly Living Est.</p>
            <p className="text-lg font-bold text-gray-900">{result.monthlyLivingEst}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm mb-1">Housing Stress Ratio</p>
            <p className="text-lg font-bold text-gray-900">
              {result.housingStressRatio.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Monthly Surplus/Deficit</span>
            <span
              className={`text-2xl font-bold ${result.monthlySurplus >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
            >
              ${Math.abs(Math.round(result.monthlySurplus)).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h4 className="text-lg font-bold text-gray-900 mb-3">How does this compare?</h4>
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-sm">Your estimated income:</span>
              <span className="text-gray-900 font-semibold">${weeklyIncomeNum.toFixed(0)}/week</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 text-sm">Median income (women 18-22, {userState}):</span>
              <span className="text-gray-900 font-semibold">${medianIncome}/week</span>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <span className={`text-sm font-semibold ${indicator.color}`}>
                {indicator.label}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Source: ABS Personal Income Australia 2022-23, adjusted for 2026 wage growth
          </p>
        </div>

        {!result.isAffordable && (
          <button
            onClick={() => navigate('/education/housing-stress')}
            className="w-full mt-4 text-left px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors group"
          >
            <span className="text-amber-900 font-semibold group-hover:text-amber-900">
              What does housing stress mean? →
            </span>
          </button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f3c88] mb-2">
            Your comparison results
          </h1>
          <p className="text-gray-600">
            Based on your profile and scenarios, here is how your pathways compare
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 mb-8"
        >
          {displayResults && (
            <>
              <PathwayResult
                pathway={pathways.pathwayA}
                name={pathways.pathwayA.name}
                result={displayResults.pathwayA}
                userState={profile.state || 'NSW'}
                medianIncome={stateMedianIncome[profile.state] || 650}
              />

              {displayResults.pathwayB && (
                <PathwayResult
                  pathway={pathways.pathwayB}
                  name={pathways.pathwayB.name}
                  result={displayResults.pathwayB}
                  userState={profile.state || 'NSW'}
                  medianIncome={stateMedianIncome[profile.state] || 650}
                />
              )}
            </>
          )}

          <motion.div
            variants={itemVariants}
            className="bg-blue-50 border-l-4 border-[#1f3c88] p-6 rounded-lg"
          >
            <div className="flex gap-3">
              <FiInfo className="text-[#1f3c88] flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">About these results</p>
                <p className="text-sm text-gray-600">
                  These estimates are based on Australian Bureau of Statistics data and
                  typical living costs. Your actual costs may vary based on location,
                  lifestyle choices, and other personal factors. Use this as a guide for
                  planning, not as definitive financial advice.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.section variants={itemVariants} className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn more</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate('/education/housing-stress')}
                className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 p-6 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <h3 className="font-bold text-gray-900 mb-2">🏠 Housing Stress</h3>
                <p className="text-sm text-gray-700">
                  Understand what housing stress means and how to manage it
                </p>
              </button>

              <button
                onClick={() => navigate('/education/payslip')}
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <h3 className="font-bold text-gray-900 mb-2">💰 Payslip Breakdown</h3>
                <p className="text-sm text-gray-700">
                  Learn how to read your payslip and understand deductions
                </p>
              </button>

              <button
                onClick={() => navigate('/education/moving-costs')}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 rounded-xl hover:shadow-lg transition-all text-left"
              >
                <h3 className="font-bold text-gray-900 mb-2">📦 Moving Costs</h3>
                <p className="text-sm text-gray-700">
                  Discover hidden costs of moving and money-saving tips
                </p>
              </button>
            </div>
          </motion.section>
        </motion.div>

        <div className="flex gap-3 flex-wrap">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/pathway-builder')}
            className="flex items-center gap-2"
          >
            <FiEdit2 /> Adjust Pathways
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              useAppStore.getState().reset();
              navigate('/');
            }}
            className="flex items-center gap-2"
          >
            <FiRotateCcw /> Start Over
          </Button>
          <Button
            size="md"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 ml-auto"
          >
            <FiArrowLeft /> Home
          </Button>
        </div>
      </div>
    </div>
  );
}
