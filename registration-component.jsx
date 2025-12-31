// Registration Screen Component - To be inserted into MasterMindCouncil.jsx

const RegistrationScreen = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    agreeRules: false,
    agreeNDA: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }
    
    if (!formData.agreeRules || !formData.agreeNDA) {
      alert('Please agree to the Rules of Engagement and NDA');
      return;
    }
    
    // Mock registration - no DB write
    console.log('Registration data:', formData);
    
    // Go to orientation
    setCurrentScreen('orientation');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      <CosmicParticles count={80} />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light tracking-wider mb-2" style={{ 
            color: '#F2EBDD'
          }}>
            THE MASTER MIND COUNCIL™
          </h1>
          <p className="text-ivory-secondary text-sm">Create Your Account</p>
        </div>

        {/* Registration Form */}
        <div className="rounded-2xl p-8 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 bg-transparent rounded-xl text-ivory-primary placeholder-ivory-secondary focus:outline-none transition-all"
                style={{
                  border: '1px solid #2A2F36',
                  boxShadow: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.border = '1px solid #3BB7A4';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59,183,164,0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '1px solid #2A2F36';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Rules of Engagement Checkbox */}
            <div className="flex items-start gap-3 mt-6">
              <input
                type="checkbox"
                id="agreeRules"
                checked={formData.agreeRules}
                onChange={(e) => setFormData({...formData, agreeRules: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent checked:bg-[#3BB7A4] focus:ring-2 focus:ring-[#3BB7A4] focus:ring-offset-0"
              />
              <label htmlFor="agreeRules" className="text-sm text-ivory-secondary cursor-pointer">
                I agree to the <span className="text-[#3BB7A4] hover:underline">Rules of Engagement</span>
              </label>
            </div>

            {/* NDA Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeNDA"
                checked={formData.agreeNDA}
                onChange={(e) => setFormData({...formData, agreeNDA: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent checked:bg-[#3BB7A4] focus:ring-2 focus:ring-[#3BB7A4] focus:ring-offset-0"
              />
              <label htmlFor="agreeNDA" className="text-sm text-ivory-secondary cursor-pointer">
                I agree to the <span className="text-[#3BB7A4] hover:underline">Non-Disclosure Agreement</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r text-ivory-primary rounded-xl font-medium hover:from-[#1A6B61] hover:to-[#32A593] transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mt-6"
              style={{
                backgroundImage: 'linear-gradient(to right, #1F7F73, #3BB7A4)'
              }}
            >
              Continue to Orientation
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button 
              onClick={() => setCurrentScreen('login')}
              className="text-sm transition-colors opacity-80 hover:opacity-100" 
              style={{ color: '#3BB7A4' }}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
