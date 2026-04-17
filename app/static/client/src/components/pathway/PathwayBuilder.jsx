import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { useAppStore } from '../../store/useAppStore';
import Button from '../common/Button';
import InputField from '../common/InputField';

const PathwayForm = ({ pathway, pathwayLabel, onUpdate, prefix, errors }) => (
  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
    <h3 className="font-bold text-lg text-gray-900 mb-4">{pathwayLabel}</h3>
    <InputField
      label="Pathway Name"
      value={pathway.name}
      onChange={(e) => onUpdate({ name: e.target.value })}
      placeholder="e.g., Stay home and save"
      error={errors[`${prefix}Name`]}
      required
    />
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Living Arrangement
      </label>
      <select
        value={pathway.living}
        onChange={(e) => onUpdate({ living: e.target.value })}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1f3c88]"
      >
        <option value="">Select...</option>
        <option value="At home">At home</option>
        <option value="Renting">Renting</option>
        <option value="Homeowner">Homeowner</option>
        <option value="Other">Other</option>
      </select>
      {errors[`${prefix}Living`] && (
        <p className="text-red-500 text-sm mt-1">{errors[`${prefix}Living`]}</p>
      )}
    </div>
    <InputField
      label="Work Hours per Week"
      type="number"
      value={pathway.workHours}
      onChange={(e) => onUpdate({ workHours: e.target.value })}
      placeholder="e.g., 40"
      error={errors[`${prefix}WorkHours`]}
      required
    />
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Study Load
      </label>
      <select
        value={pathway.studyLoad}
        onChange={(e) => onUpdate({ studyLoad: e.target.value })}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#1f3c88]"
      >
        <option value="">Select...</option>
        <option value="None">None</option>
        <option value="Part-time">Part-time</option>
        <option value="Full-time">Full-time</option>
      </select>
      {errors[`${prefix}StudyLoad`] && (
        <p className="text-red-500 text-sm mt-1">{errors[`${prefix}StudyLoad`]}</p>
      )}
    </div>
  </div>
);

export default function PathwayBuilder() {
  const navigate = useNavigate();
  const { pathways, setPathwayA, setPathwayB, removePathwayB } = useAppStore();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!pathways.pathwayA.name) newErrors.pathwayAName = 'Pathway A name is required';
    if (!pathways.pathwayA.living)
      newErrors.pathwayALiving = 'Please select a living arrangement';
    if (!pathways.pathwayA.workHours || isNaN(pathways.pathwayA.workHours))
      newErrors.pathwayAWorkHours = 'Please enter valid work hours';
    if (!pathways.pathwayA.studyLoad)
      newErrors.pathwayAStudyLoad = 'Please select a study load';

    if (pathways.pathwayB) {
      if (!pathways.pathwayB.name) newErrors.pathwayBName = 'Pathway B name is required';
      if (!pathways.pathwayB.living)
        newErrors.pathwayBLiving = 'Please select a living arrangement';
      if (!pathways.pathwayB.workHours || isNaN(pathways.pathwayB.workHours))
        newErrors.pathwayBWorkHours = 'Please enter valid work hours';
      if (!pathways.pathwayB.studyLoad)
        newErrors.pathwayBStudyLoad = 'Please select a study load';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSeeResults = () => {
    if (validate()) {
      navigate('/results');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f3c88] mb-2">
            Build your pathways
          </h1>
          <p className="text-gray-600">
            Define different scenarios to compare and see which works best for you
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg mb-6"
        >
          <p className="text-blue-700 bg-blue-50 p-3 rounded-lg mb-6">
          </p>            

          <PathwayForm
            pathway={pathways.pathwayA}
            pathwayLabel="Pathway A (Required)"
            onUpdate={(data) => setPathwayA(data)}
            prefix="pathwayA"
            errors={errors}
          />

          <AnimatePresence>
            {pathways.pathwayB && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 relative"
              >
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => removePathwayB()}
                    className="p-2 hover:bg-red-50 rounded-lg text-[#d92d20]"
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <PathwayForm
                  pathway={pathways.pathwayB}
                  pathwayLabel="Pathway B (Optional)"
                  onUpdate={(data) => setPathwayB({ ...pathways.pathwayB, ...data })}
                  prefix="pathwayB"
                  errors={errors}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!pathways.pathwayB && (
            <motion.button
              onClick={() =>
                setPathwayB({
                  name: '',
                  living: '',
                  workHours: '',
                  studyLoad: '',
                })
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#1f3c88] hover:text-[#1f3c88] transition-colors flex items-center justify-center gap-2"
            >
              <FiPlus /> Add Pathway B
            </motion.button>
          )}
        </motion.div>

        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/quick-profile-step-2')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </Button>
          <Button
            size="md"
            onClick={handleSeeResults}
            className="flex items-center gap-2 ml-auto"
          >
            See My Results <FiArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
