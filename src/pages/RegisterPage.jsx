import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Code, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    username: '',
    gender: 'male',
    dob: '',
    skill_level: 'beginner',
    college_name: '',
    preferred_language: 'cpp'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      // Basic validation for step 1
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }

      if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
    }

    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Basic validation for step 2
      if (!formData.full_name || !formData.username || !formData.dob || !formData.college_name) {
        showToast('Please fill in all required fields', 'error');
        setLoading(false);
        return;
      }
      
      // Remove confirmPassword before sending to the server
      const { confirmPassword, ...userData } = formData;
      
      await register(formData.email, formData.password, userData);
      navigate('/dashboard');
    } catch (error) {
      showToast(error.message || 'Failed to register. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Code className="h-12 w-12 text-indigo-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Step Indicator */}
          <div className="mb-6">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= 1 ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-500 text-gray-500'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-indigo-500' : 'bg-gray-500'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${step >= 2 ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-gray-500 text-gray-500'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">Account Details</span>
              <span className="text-xs text-gray-400">Personal Information</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full btn-primary flex justify-center items-center py-2 px-4"
                  >
                    Next
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                      Username
                    </label>
                    <div className="mt-1">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Gender
                    </label>
                    <div className="mt-1 flex space-x-6">
                      <div className="flex items-center">
                        <input
                          id="gender-male"
                          name="gender"
                          type="radio"
                          value="male"
                          checked={formData.gender === 'male'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                        />
                        <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-300">
                          Male
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="gender-female"
                          name="gender"
                          type="radio"
                          value="female"
                          checked={formData.gender === 'female'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                        />
                        <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-300">
                          Female
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="gender-other"
                          name="gender"
                          type="radio"
                          value="other"
                          checked={formData.gender === 'other'}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                        />
                        <label htmlFor="gender-other" className="ml-2 block text-sm text-gray-300">
                          Other
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-300">
                      Date of Birth
                    </label>
                    <div className="mt-1">
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        required
                        value={formData.dob}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="skill_level" className="block text-sm font-medium text-gray-300">
                      Skill Level
                    </label>
                    <div className="mt-1">
                      <select
                        id="skill_level"
                        name="skill_level"
                        required
                        value={formData.skill_level}
                        onChange={handleChange}
                        className="select-field"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="college_name" className="block text-sm font-medium text-gray-300">
                      College Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="college_name"
                        name="college_name"
                        type="text"
                        required
                        value={formData.college_name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="preferred_language" className="block text-sm font-medium text-gray-300">
                      Preferred Programming Language
                    </label>
                    <div className="mt-1">
                      <select
                        id="preferred_language"
                        name="preferred_language"
                        required
                        value={formData.preferred_language}
                        onChange={handleChange}
                        className="select-field"
                      >
                        <option value="c">C</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-1/2 btn-secondary flex justify-center items-center py-2 px-4"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-1/2 btn-primary py-2 px-4 flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        Register
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;