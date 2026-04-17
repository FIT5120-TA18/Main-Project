import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiShield, FiZap, FiTarget } from 'react-icons/fi';
import Button from '../common/Button';

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Data-driven',
      description: 'Compare pathways based on real Australian data',
    },
    {
      icon: FiShield,
      title: 'Private',
      description: 'Your data is processed locally, never stored',
    },
    {
      icon: FiZap,
      title: 'Instant',
      description: 'Get personalized results in seconds',
    },
    {
      icon: FiTarget,
      title: 'Practical',
      description: 'Real costs you need to plan your move',
    },
  ];

  const steps = [
    { num: '1', title: 'Share your situation', desc: 'Tell us about your income, living arrangements and goals' },
    { num: '2', title: 'Build your pathways', desc: 'Explore different life scenarios and how they affect your finances' },
    { num: '3', title: 'See your results', desc: 'Compare affordability, living costs, and make informed decisions' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-16 md:py-24 px-4 text-center max-w-6xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f3c88] mb-6"
        >
          Compare your next life move using real Australian data
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          Make confident decisions about moving, work, and study with personalized financial insights tailored to your situation.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            size="lg"
            onClick={() => navigate('/quick-profile-step-1')}
            className="inline-block"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.section>

      {/* Process Steps */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 px-4 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center text-[#1f3c88] mb-16"
          >
            How it works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-[#1f3c88] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4"
                >
                  {step.num}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.desc}</p>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 text-[#d92d20] text-3xl">

                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold text-center text-[#1f3c88] mb-16"
          >
            Why choose us
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#1f3c88]"
                >
                  <Icon className="w-12 h-12 text-[#d92d20] mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 md:py-24 px-4 bg-[#1f3c88] text-white text-center"
      >
        <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-6">
          Ready to explore your options?
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
          Start comparing your life moves with real data in less than 5 minutes.
        </motion.p>
        <motion.div variants={itemVariants}>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/quick-profile-step-1')}
          >
            Begin Comparison
          </Button>
        </motion.div>
      </motion.section>
    </div>
  );
}
