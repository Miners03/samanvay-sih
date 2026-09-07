'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { WizardStepper } from '@/components/wizard/WizardStepper';
import { PageHeader } from '@/components/common/PageHeader';
import { generateRoadmapFromOperations } from '@/lib/data/roadmapRules';
import { ProjectOperations, ProjectLocation } from '@/lib/types';
import { 
  Building2, 
  MapPin, 
  Settings, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Info, 
  FileText, 
  ShieldAlert, 
  Flame, 
  Zap, 
  Droplets, 
  Users, 
  Edit3 
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

export default function RegisterProjectWizardPage() {
  const router = useRouter();
  const { registerProject } = useApp();

  const [currentStep, setCurrentStep] = useState(1);
  const [profileAutoFilled, setProfileAutoFilled] = useState(false);

  // Form State
  // Step 1: Business
  const [companyName, setCompanyName] = useState('GreenTech Bharat CleanEnergy Pvt. Ltd.');
  const [businessType, setBusinessType] = useState<'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship'>('Private Limited');
  const [sector, setSector] = useState('Renewable Energy & Heavy Electrical Equipment');
  const [subSector, setSubSector] = useState('Lithium Battery Packs & Solar PV Assemblies');
  const [entityStatus, setEntityStatus] = useState<'New' | 'Existing'>('Existing');
  const [registrationNumber, setRegistrationNumber] = useState('U29309HR2022PTC104521');
  const [panNumber, setPanNumber] = useState('AABCG4928K');
  const [gstin, setGstin] = useState('06AABCG4928K1Z3');
  const [udyamNumber, setUdyamNumber] = useState('UDYAM-HR-05-0049210');
  const [contactPerson, setContactPerson] = useState('Vikramaditya Singhania');
  const [contactEmail, setContactEmail] = useState('vikram.singhania@greentechbharat.in');
  const [contactPhone, setContactPhone] = useState('+91 98101 23456');

  // Step 2: Project
  const [projectName, setProjectName] = useState('GreenTech Advanced Battery & Solar Cell Manufacturing Unit');
  const [projectType, setProjectType] = useState<'New Greenfield Facility' | 'Expansion of Existing Unit' | 'Modernization / Modification'>('New Greenfield Facility');
  const [estimatedInvestmentCrores, setEstimatedInvestmentCrores] = useState<number>(48.5);
  const [projectSizeSqMeters, setProjectSizeSqMeters] = useState<number>(28500);
  const [productionCapacity, setProductionCapacity] = useState('1.2 GWh Annual Energy Storage Packs');
  const [expectedEmployees, setExpectedEmployees] = useState<number>(240);
  const [expectedConstructionStartDate, setExpectedConstructionStartDate] = useState('2026-10-15');
  const [expectedOperationsStartDate, setExpectedOperationsStartDate] = useState('2027-06-30');

  // Step 3: Location
  const [state, setState] = useState('Haryana');
  const [district, setDistrict] = useState('Gurugram');
  const [industrialArea, setIndustrialArea] = useState('IMT Manesar Phase-II (HSIIDC Industrial Estate)');
  const [landType, setLandType] = useState<'Industrial Park' | 'Agricultural (Converted)' | 'Private Industrial Land' | 'SEZ Zone'>('Industrial Park');
  const [address, setAddress] = useState('Plot No. 42-44, Sector 8, IMT Manesar, Gurugram, Haryana');
  const [pinCode, setPinCode] = useState('122050');

  // Step 4: Operations
  // Environmental
  const [hasWastewater, setHasWastewater] = useState(true);
  const [wastewaterVolumeKLD, setWastewaterVolumeKLD] = useState(45);
  const [hasEmissions, setHasEmissions] = useState(true);
  const [emissionTypes, setEmissionTypes] = useState<string[]>(['Boiler Flue Gas', 'DG Set Exhaust']);
  const [hasHazardousMaterials, setHasHazardousMaterials] = useState(true);
  const [wasteGeneratedDailyKg, setWasteGeneratedDailyKg] = useState(120);
  const [pollutionCategory, setPollutionCategory] = useState<'Red' | 'Orange' | 'Green' | 'White'>('Orange');

  // Utilities
  const [powerKVA, setPowerKVA] = useState(750);
  const [waterKLD, setWaterKLD] = useState(60);
  const [gasRequired, setGasRequired] = useState(true);
  const [gasUsageSCMD, setGasUsageSCMD] = useState(350);

  // Infrastructure
  const [requiresNewConstruction, setRequiresNewConstruction] = useState(true);
  const [builtUpAreaSqMeters, setBuiltUpAreaSqMeters] = useState(14500);
  const [buildingHeightMeters, setBuildingHeightMeters] = useState(12.5);
  const [factoryPremisesType, setFactoryPremisesType] = useState<'Industrial Shed' | 'Multi-storey Factory' | 'Warehouse' | 'Assembly Unit'>('Industrial Shed');
  const [hasFireSafetySystems, setHasFireSafetySystems] = useState(true);
  const [hasBoiler, setHasBoiler] = useState(true);
  const [boilerPressurePSI, setBoilerPressurePSI] = useState(150);

  // Labour
  const [totalWorkers, setTotalWorkers] = useState(240);
  const [shiftsCount, setShiftsCount] = useState(3);
  const [contractWorkers, setContractWorkers] = useState(95);
  const [hasHazardousOperations, setHasHazardousOperations] = useState(false);
  const [hasFemaleWorkersNightShift, setHasFemaleWorkersNightShift] = useState(true);

  const steps = [
    { number: 1, label: 'Business', description: 'Enterprise identity' },
    { number: 2, label: 'Project', description: 'Scale & capacity' },
    { number: 3, label: 'Location', description: 'Land & zoning' },
    { number: 4, label: 'Operations', description: 'Utilities & environment' },
    { number: 5, label: 'Review', description: 'Generate Roadmap' },
  ];

  const handleAutoFillProfile = () => {
    setCompanyName('GreenTech Bharat CleanEnergy Pvt. Ltd.');
    setRegistrationNumber('U29309HR2022PTC104521');
    setPanNumber('AABCG4928K');
    setGstin('06AABCG4928K1Z3');
    setUdyamNumber('UDYAM-HR-05-0049210');
    setContactPerson('Vikramaditya Singhania');
    setContactEmail('vikram.singhania@greentechbharat.in');
    setContactPhone('+91 98101 23456');
    setProfileAutoFilled(true);
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGenerateRoadmap = () => {
    const operationsData: ProjectOperations = {
      environmental: {
        category: pollutionCategory,
        hasWastewater,
        wastewaterVolumeKLD: hasWastewater ? Number(wastewaterVolumeKLD) : undefined,
        hasEmissions,
        emissionTypes: hasEmissions ? emissionTypes : undefined,
        hasHazardousMaterials,
        wasteGeneratedDailyKg: Number(wasteGeneratedDailyKg),
      },
      utilities: {
        powerKVA: Number(powerKVA),
        waterKLD: Number(waterKLD),
        gasRequired,
        gasUsageSCMD: gasRequired ? Number(gasUsageSCMD) : undefined,
      },
      infrastructure: {
        requiresNewConstruction,
        builtUpAreaSqMeters: Number(builtUpAreaSqMeters),
        buildingHeightMeters: Number(buildingHeightMeters),
        factoryPremisesType,
        hasFireSafetySystems,
        hasBoiler,
        boilerPressurePSI: hasBoiler ? Number(boilerPressurePSI) : undefined,
      },
      labour: {
        totalWorkers: Number(totalWorkers),
        shiftsCount: Number(shiftsCount),
        contractWorkers: Number(contractWorkers),
        hasHazardousOperations,
        hasFemaleWorkersNightShift,
      },
    };

    const locationData: ProjectLocation = {
      state,
      district,
      industrialArea,
      landType,
      address,
      pinCode,
      gisCoordinates: {
        lat: 28.3541,
        lng: 76.9412,
      },
    };

    const dummyId = `proj-${Date.now()}`;
    const generatedApprovals = generateRoadmapFromOperations(
      dummyId,
      projectName,
      operationsData,
      landType,
      Number(estimatedInvestmentCrores)
    );

    const newProject = registerProject({
      name: projectName,
      companyName,
      businessType,
      sector,
      subSector,
      registrationNumber,
      panNumber,
      gstin,
      udyamNumber,
      contactPerson,
      contactEmail,
      contactPhone,
      projectType,
      estimatedInvestmentCrores: Number(estimatedInvestmentCrores),
      projectSizeSqMeters: Number(projectSizeSqMeters),
      productionCapacity,
      expectedEmployees: Number(expectedEmployees),
      expectedConstructionStartDate,
      expectedOperationsStartDate,
      location: locationData,
      operations: operationsData,
      approvals: generatedApprovals,
    });

    router.push(`/applicant/roadmap/${newProject.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Register New Industrial Project"
        subtitle="Establishment Wizard: Input your enterprise parameters once to generate an integrated cross-departmental approval roadmap."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Projects', href: '/applicant/projects' },
          { label: 'Register New Project', current: true },
        ]}
      />

      {/* Progress Stepper */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <WizardStepper
          currentStep={currentStep}
          steps={steps}
          onStepClick={(step) => setCurrentStep(step)}
        />
      </div>

      {/* Main Wizard Form Container */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 sm:p-8">
        {/* STEP 1: BUSINESS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-gov-blue-secondary" />
                  Step 1 – Business &amp; Entity Identification
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Corporate identity, registration certificates, and verified statutory identifiers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutoFillProfile}
                className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-gov-blue-secondary px-3 py-1.5 rounded text-xs font-semibold border border-blue-200 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-gov-blue-secondary" />
                <span>Auto-fill from Verified Profile</span>
              </button>
            </div>

            {profileAutoFilled && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Some information has been pre-filled from your verified Business Profile.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Legal Entity / Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue-secondary"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Constitution / Business Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue-secondary bg-white"
                >
                  <option value="Private Limited">Private Limited Company</option>
                  <option value="Public Limited">Public Limited Company</option>
                  <option value="LLP">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership">Partnership Firm</option>
                  <option value="Proprietorship">Sole Proprietorship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Industrial Sector</label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Sub-sector / Product Line</label>
                <input
                  type="text"
                  value={subSector}
                  onChange={(e) => setSubSector(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Entity Status</label>
                <div className="flex items-center gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="entityStatus"
                      checked={entityStatus === 'New'}
                      onChange={() => setEntityStatus('New')}
                      className="text-gov-blue-secondary"
                    />
                    <span>New Enterprise</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="entityStatus"
                      checked={entityStatus === 'Existing'}
                      onChange={() => setEntityStatus('Existing')}
                      className="text-gov-blue-secondary"
                    />
                    <span>Existing Registered Enterprise</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Registration Number (CIN / LLPIN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Company PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">GSTIN Registration</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Udyam Registration (MSME)</label>
                <input
                  type="text"
                  value={udyamNumber}
                  onChange={(e) => setUdyamNumber(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Designated Authorised Signatory <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Authorised Email ID</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Authorised Mobile Number</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PROJECT */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gov-blue-secondary" />
                Step 2 – Proposed Project Scale &amp; Timelines
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Investment slabs, land requirement, capacity, and commissioning milestones.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-800">
                  Project Title / Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Project Classification <span className="text-red-500">*</span>
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white"
                >
                  <option value="New Greenfield Facility">New Greenfield Facility</option>
                  <option value="Expansion of Existing Unit">Expansion of Existing Unit</option>
                  <option value="Modernization / Modification">Modernization / Modification</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Estimated Capital Investment (₹ in Crores) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.5"
                    value={estimatedInvestmentCrores}
                    onChange={(e) => setEstimatedInvestmentCrores(Number(e.target.value))}
                    className="w-full pl-8 p-2.5 rounded border border-slate-300 text-xs font-semibold"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  {estimatedInvestmentCrores >= 50 ? 'Qualifies as Mega Project with fast-track single-desk cabinet clearance.' : 'Qualifies under MSME / Medium Industry industrial policy bracket.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Total Plot Size (in Sq. Meters)</label>
                <input
                  type="number"
                  value={projectSizeSqMeters}
                  onChange={(e) => setProjectSizeSqMeters(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
                <span className="text-[10px] text-slate-500">
                  Approx. {(projectSizeSqMeters / 4046.86).toFixed(2)} Acres
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Annual Rated Production Capacity</label>
                <input
                  type="text"
                  value={productionCapacity}
                  onChange={(e) => setProductionCapacity(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Expected Peak Direct Employment <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={expectedEmployees}
                  onChange={(e) => setExpectedEmployees(Number(e.target.value))}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Expected Construction Commencement Date
                </label>
                <input
                  type="date"
                  value={expectedConstructionStartDate}
                  onChange={(e) => setExpectedConstructionStartDate(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Expected Commercial Operations Date (COD)
                </label>
                <input
                  type="date"
                  value={expectedOperationsStartDate}
                  onChange={(e) => setExpectedOperationsStartDate(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gov-blue-secondary" />
                Step 3 – Project Location &amp; Land Specifics
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Site details, industrial estate zones, and town planning jurisdiction.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Approval requirements and environmental categorizations may vary based on project location and municipal zoning.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">State / UT <span className="text-red-500">*</span></label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white"
                >
                  <option value="Haryana">Haryana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">District <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  Designated Industrial Cluster / Estate Name
                </label>
                <input
                  type="text"
                  value={industrialArea}
                  onChange={(e) => setIndustrialArea(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Land Type &amp; Tenure</label>
                <select
                  value={landType}
                  onChange={(e) => setLandType(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white"
                >
                  <option value="Industrial Park">Industrial Park / Government Notified Estate (HSIIDC / MIDC)</option>
                  <option value="Agricultural (Converted)">Agricultural Land (Change of Land Use Required)</option>
                  <option value="Private Industrial Land">Private Freehold Industrial Land</option>
                  <option value="SEZ Zone">Special Economic Zone (SEZ)</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-slate-800">Complete Site Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">PIN Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>
            </div>

            {/* Visual Location Preview Box */}
            <div className="bg-slate-100 rounded-lg p-4 border border-slate-300">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>GIS Cadastral Verification &amp; Zoning Preview</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  Coordinates: 28.3541° N, 76.9412° E
                </span>
              </div>
              <div className="h-28 bg-slate-200 rounded border border-slate-300 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                <div className="text-center z-10">
                  <MapPin className="w-6 h-6 text-red-600 mx-auto animate-bounce" />
                  <span className="text-xs font-bold text-slate-800 mt-1 block">
                    {industrialArea || 'Selected Site Location'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Notified Industrial Master Plan • Zone Category: High Intensity Manufacturing
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: OPERATIONS */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gov-blue-secondary" />
                Step 4 – Dynamic Operational &amp; Compliance Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conditional technical inputs dynamically dictate statutory approvals across departments.
              </p>
            </div>

            {/* SECTION A: ENVIRONMENTAL */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  1. Environmental &amp; Pollution Parameters (SPCB)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-600">Category:</span>
                  <select
                    value={pollutionCategory}
                    onChange={(e) => setPollutionCategory(e.target.value as any)}
                    className="text-xs font-bold px-2.5 py-1 rounded border border-slate-300 bg-white"
                  >
                    <option value="Red">Red (Severe Pollution Potential)</option>
                    <option value="Orange">Orange (Moderate Pollution Potential)</option>
                    <option value="Green">Green (Low Pollution Potential)</option>
                    <option value="White">White (Non-Polluting / Exemption)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Wastewater Check */}
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Generates Trade / Domestic Wastewater?</span>
                    <input
                      type="checkbox"
                      checked={hasWastewater}
                      onChange={(e) => setHasWastewater(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  {hasWastewater && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <label className="text-[11px] text-slate-600">Expected Wastewater Volume (in KLD):</label>
                      <input
                        type="number"
                        value={wastewaterVolumeKLD}
                        onChange={(e) => setWastewaterVolumeKLD(Number(e.target.value))}
                        className="w-full p-1.5 rounded border border-slate-300 text-xs"
                      />
                      <span className="text-[10px] text-amber-800 block">
                        Requires Effluent Treatment Plant (ETP) / Zero Liquid Discharge design.
                      </span>
                    </div>
                  )}
                </div>

                {/* Emissions Check */}
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Generates Atmospheric Emissions / Flue Gas?</span>
                    <input
                      type="checkbox"
                      checked={hasEmissions}
                      onChange={(e) => setHasEmissions(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  {hasEmissions && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <label className="text-[11px] text-slate-600">Active Emission Sources:</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {['Boiler Flue Gas', 'DG Set Exhaust', 'Furnace Stacks', 'Volatile Solvents'].map((src) => (
                          <span
                            key={src}
                            onClick={() => {
                              if (emissionTypes.includes(src)) {
                                setEmissionTypes(emissionTypes.filter(s => s !== src));
                              } else {
                                setEmissionTypes([...emissionTypes, src]);
                              }
                            }}
                            className={`cursor-pointer px-2 py-0.5 rounded text-[10px] border ${emissionTypes.includes(src) ? 'bg-blue-100 text-blue-900 border-blue-300 font-semibold' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                          >
                            {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hazardous Waste */}
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Handles / Generates Hazardous Waste?</span>
                    <input
                      type="checkbox"
                      checked={hasHazardousMaterials}
                      onChange={(e) => setHasHazardousMaterials(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  {hasHazardousMaterials && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-amber-800 font-medium">
                        Triggers Hazardous Waste Management Rules, 2016 Authorization requirement.
                      </span>
                    </div>
                  )}
                </div>

                {/* Solid Waste */}
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-800">Total Solid Waste Generated (Kg/Day)</span>
                  <input
                    type="number"
                    value={wasteGeneratedDailyKg}
                    onChange={(e) => setWasteGeneratedDailyKg(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* SECTION B: UTILITIES */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                2. Utilities &amp; Energy Demands (DISCOM &amp; PHED)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Electricity Demand (kVA)</label>
                  <input
                    type="number"
                    value={powerKVA}
                    onChange={(e) => setPowerKVA(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                  {powerKVA > 50 && (
                    <span className="text-[10px] text-blue-800 block">
                      &gt; 50 kVA requires dedicated High-Tension (HT) Line &amp; Transformer Feasibility.
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Water Requirement (KLD)</label>
                  <input
                    type="number"
                    value={waterKLD}
                    onChange={(e) => setWaterKLD(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                  {waterKLD > 20 && (
                    <span className="text-[10px] text-blue-800 block">
                      Triggers PHED Bulk Industrial Water Supply Allocation.
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Industrial Piped Gas?</span>
                    <input
                      type="checkbox"
                      checked={gasRequired}
                      onChange={(e) => setGasRequired(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  {gasRequired && (
                    <div className="pt-1">
                      <label className="text-[10px] text-slate-500">Usage (SCMD):</label>
                      <input
                        type="number"
                        value={gasUsageSCMD}
                        onChange={(e) => setGasUsageSCMD(Number(e.target.value))}
                        className="w-full p-1 rounded border border-slate-300 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION C: INFRASTRUCTURE & SAFETY */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-red-600" />
                3. Infrastructure, Buildings &amp; Boilers (Fire &amp; Boilers Dept)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Built-up Area (Sq. Meters)</label>
                  <input
                    type="number"
                    value={builtUpAreaSqMeters}
                    onChange={(e) => setBuiltUpAreaSqMeters(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Building Height (Meters)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={buildingHeightMeters}
                    onChange={(e) => setBuildingHeightMeters(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                  {buildingHeightMeters >= 15 && (
                    <span className="text-[10px] text-amber-800 font-bold block">
                      &gt; 15m classified as High-Rise: requires State Fire Directorate NOC.
                    </span>
                  )}
                </div>

                {/* Industrial Boiler */}
                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Industrial Boiler / Steam Vessel?</span>
                    <input
                      type="checkbox"
                      checked={hasBoiler}
                      onChange={(e) => setHasBoiler(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  {hasBoiler && (
                    <div className="pt-1">
                      <label className="text-[10px] text-slate-500">Design Pressure (PSI):</label>
                      <input
                        type="number"
                        value={boilerPressurePSI}
                        onChange={(e) => setBoilerPressurePSI(Number(e.target.value))}
                        className="w-full p-1 rounded border border-slate-300 text-xs"
                      />
                      <span className="text-[10px] text-amber-800 block mt-0.5">
                        Triggers Chief Inspector of Boilers certification.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION D: LABOUR & FACTORIES */}
            <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                4. Labour, Shifts &amp; Safety Compliance (DISH)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Total Factory Personnel</label>
                  <input
                    type="number"
                    value={totalWorkers}
                    onChange={(e) => setTotalWorkers(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                  <span className="text-[10px] text-slate-500">
                    Triggers registration under Section 2(m)(i) of Factories Act.
                  </span>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <label className="font-bold text-slate-800">Contract Workers Engaged</label>
                  <input
                    type="number"
                    value={contractWorkers}
                    onChange={(e) => setContractWorkers(Number(e.target.value))}
                    className="w-full p-1.5 rounded border border-slate-300 text-xs"
                  />
                  {contractWorkers >= 50 && (
                    <span className="text-[10px] text-amber-800 font-bold block">
                      &gt; 50 workers requires Contract Labour (R&amp;A) Principal Employer Licence.
                    </span>
                  )}
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Hazardous Chemical Operations?</span>
                    <input
                      type="checkbox"
                      checked={hasHazardousOperations}
                      onChange={(e) => setHasHazardousOperations(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-slate-800">Female Staff in Night Shifts?</span>
                    <input
                      type="checkbox"
                      checked={hasFemaleWorkersNightShift}
                      onChange={(e) => setHasFemaleWorkersNightShift(e.target.checked)}
                      className="w-4 h-4 text-gov-blue-secondary rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & GENERATE ROADMAP */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="pb-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Step 5 – Consolidated Review &amp; Statutory Roadmap Synthesis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your submitted specifications across all dimensions before generating the coordinated multi-departmental roadmap.
              </p>
            </div>

            {/* Section 1 Review */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  1. Business Profile
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-gov-blue-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Company</span>
                  <span className="font-bold text-slate-800">{companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">CIN</span>
                  <span className="font-mono text-slate-800">{registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">PAN / GSTIN</span>
                  <span className="font-mono text-slate-800">{panNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Signatory</span>
                  <span className="text-slate-800">{contactPerson} ({contactPhone})</span>
                </div>
              </div>
            </div>

            {/* Section 2 Review */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Project Scope &amp; Investment
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-gov-blue-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Project Title</span>
                  <span className="font-bold text-slate-800 truncate block">{projectName}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Proposed Outlay</span>
                  <span className="font-bold text-emerald-800">{formatCurrencyINR(estimatedInvestmentCrores * 10000000)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Target Personnel</span>
                  <span className="text-slate-800">{expectedEmployees} Employees</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Target Operations</span>
                  <span className="text-slate-800">{expectedOperationsStartDate}</span>
                </div>
              </div>
            </div>

            {/* Section 3 Review */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Location &amp; Land
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-gov-blue-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">District &amp; State</span>
                  <span className="font-bold text-slate-800">{district}, {state}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Industrial Area</span>
                  <span className="text-slate-800">{industrialArea}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Land Tenure</span>
                  <span className="text-slate-800">{landType}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">PIN Code</span>
                  <span className="font-mono text-slate-800">{pinCode}</span>
                </div>
              </div>
            </div>

            {/* Section 4 Review */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  4. Operations &amp; Statutory Triggers
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs text-gov-blue-secondary hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Pollution Category</span>
                  <span className="font-bold text-amber-800">{pollutionCategory} Category</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Power Load</span>
                  <span className="font-bold text-slate-800">{powerKVA} kVA (HT Feasibility)</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Water Volume</span>
                  <span className="text-slate-800">{waterKLD} KLD Bulk Supply</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Industrial Boiler</span>
                  <span className="text-slate-800">{hasBoiler ? `${boilerPressurePSI} PSI Steam` : 'None'}</span>
                </div>
              </div>
            </div>

            {/* Coordinated Journey Highlight */}
            <div className="bg-blue-50 border border-gov-blue-border rounded-lg p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-gov-blue-secondary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-gov-blue-primary">
                    Coordinated Single-Window Engine Ready
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    Based on your operational inputs, Samanvay will synthesize a unified approval roadmap across <strong>7 departments</strong> (Pollution Control, Labour &amp; Factories, Fire Services, DISCOM, Town Planning, Water Resources, and Industries Directorate). Clearances that can run in parallel will be scheduled simultaneously to eliminate sequential bottlenecks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Step {currentStep - 1}</span>
              </button>
            )}
          </div>

          <div>
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white text-xs font-bold px-5 py-2.5 rounded shadow hover:shadow-md transition-all"
              >
                <span>Proceed to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black px-6 py-2.5 rounded shadow hover:shadow-md transition-all border border-amber-400 focus:ring-2 focus:ring-amber-300"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Approval Roadmap</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
