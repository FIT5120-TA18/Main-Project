import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useAppStore } from '../../store/useAppStore';
import Button from '../common/Button';
import TileSelect from '../common/TileSelect';
import InputField from '../common/InputField';

export default function QuickProfileStep1() {
  const navigate = useNavigate();
  const { profile, setProfile } = useAppStore();
  const [errors, setErrors] = useState({});

  const ageBands = ['18-20', '21-22'];
  const states = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'ACT', 'NT'];
  const workStatuses = ['Employed', 'Self-employed', 'Unemployed', 'Not seeking'];
  const livingArrangements = ['At home', 'Renting', 'Homeowner', 'Other'];
  const studyStatuses = ['Full-time', 'Part-time', 'Not studying'];

  const validate = () => {
    const newErrors = {};
    if (!profile.ageBand) newErrors.ageBand = 'Please select your age band';
    if (!profile.state) newErrors.state = 'Please select your state';
    if (!profile.workStatus) newErrors.workStatus = 'Please select your work status';
    if (!profile.weeklyIncome || isNaN(profile.weeklyIncome))
      newErrors.weeklyIncome = 'Please enter a valid weekly income';
    if (!profile.livingArrangement)
      newErrors.livingArrangement = 'Please select your living arrangement';
    if (!profile.studyStatus) newErrors.studyStatus = 'Please select your study status';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate('/quick-profile-step-2');
    }
  };

  const isFormValid = () => {
    return (
      profile.ageBand &&
      profile.state &&
      profile.workStatus &&
      profile.weeklyIncome &&
      !isNaN(profile.weeklyIncome) &&
      profile.livingArrangement &&
      profile.studyStatus
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
            Tell us about you
          </h1>
          <p className="text-gray-600">Step 1 of 2 - Your current situation</p>
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '50%' }}
              className="bg-[#1f3c88] h-full rounded-full"
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-8 rounded-xl shadow-lg"
        >
          <TileSelect
            label="Age band"
            options={ageBands}
            value={profile.ageBand}
            onChange={(val) => setProfile({ ...profile, ageBand: val })}
          />
          {errors.ageBand && <p className="text-red-500 text-sm mb-4">{errors.ageBand}</p>}

          <TileSelect
            label="State"
            options={states}
            value={profile.state}
            onChange={(val) => setProfile({ ...profile, state: val })}
          />
          {errors.state && <p className="text-red-500 text-sm mb-4">{errors.state}</p>}

          <TileSelect
            label="Work status"
            options={workStatuses}
            value={profile.workStatus}
            onChange={(val) => setProfile({ ...profile, workStatus: val })}
          />
          {errors.workStatus && <p className="text-red-500 text-sm mb-4">{errors.workStatus}</p>}

          <InputField
            label="Weekly income (AUD $)"
            type="number"
            value={profile.weeklyIncome}
            onChange={(e) => setProfile({ ...profile, weeklyIncome: e.target.value })}
            placeholder="e.g., 800"
            error={errors.weeklyIncome}
            required
          />

          <TileSelect
            label="Living arrangement"
            options={livingArrangements}
            value={profile.livingArrangement}
            onChange={(val) => setProfile({ ...profile, livingArrangement: val })}
          />
          {errors.livingArrangement && <p className="text-red-500 text-sm mb-4">{errors.livingArrangement}</p>}

          <TileSelect
            label="Study status"
            options={studyStatuses}
            value={profile.studyStatus}
            onChange={(val) => setProfile({ ...profile, studyStatus: val })}
          />
          {errors.studyStatus && <p className="text-red-500 text-sm mb-4">{errors.studyStatus}</p>}

          <div className="flex gap-4 mt-8">
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <FiArrowLeft /> Back
            </Button>
            <Button
              size="md"
              onClick={handleNext}
              disabled={!isFormValid()}
              className="flex items-center gap-2 ml-auto"
            >
              Next <FiArrowRight />
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
